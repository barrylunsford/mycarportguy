import { hasAdminSession, isAdminConfigured } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const squareBaseUrl = "https://connect.squareup.com/v2";
const squareVersion = "2026-09-16";

async function authorized() {
  if (!isAdminConfigured() && process.env.NODE_ENV === "production") return false;
  return !isAdminConfigured() || (await hasAdminSession());
}

async function squareRequest<T>(path: string, body: unknown): Promise<T> {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) throw new Error("Square is not connected yet.");
  const response = await fetch(`${squareBaseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Square-Version": squareVersion,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const result = (await response.json()) as T & { errors?: Array<{ detail?: string }> };
  if (!response.ok) throw new Error(result.errors?.[0]?.detail || "Square could not complete the request.");
  return result;
}

export async function POST(request: Request) {
  if (!(await authorized())) return Response.json({ message: "Please sign in again." }, { status: 401 });
  const locationId = process.env.SQUARE_LOCATION_ID;
  if (!process.env.SQUARE_ACCESS_TOKEN || !locationId) {
    return Response.json({ message: "Square is not connected yet." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  const quoteId = typeof body.quoteId === "string" ? body.quoteId.trim().slice(0, 100) : "";
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 160) : "";
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : "";
  const project = typeof body.project === "string" ? body.project.trim().slice(0, 160) : "Building";
  const dueDate = typeof body.dueDate === "string" ? body.dueDate : "";
  const amount = typeof body.amount === "number" ? body.amount : Number(body.amount);
  const amountCents = Math.round(amount * 100);

  if (!quoteId || !name || !email || !/^\S+@\S+\.\S+$/.test(email) || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) || dueDate < new Date().toISOString().slice(0, 10) || !Number.isSafeInteger(amountCents) || amountCents < 100 || amountCents > 10_000_000) {
    return Response.json({ message: "Enter a valid deposit of at least $1 and a current or future due date." }, { status: 400 });
  }

  const requestKey = crypto.randomUUID();
  const nameParts = name.split(/\s+/);
  const givenName = nameParts.shift() || name;
  const familyName = nameParts.join(" ");

  try {
    const customerResult = await squareRequest<{ customer?: { id?: string } }>("/customers", {
      idempotency_key: `${requestKey}-customer`,
      given_name: givenName,
      ...(familyName ? { family_name: familyName } : {}),
      email_address: email,
      ...(phone ? { phone_number: phone } : {}),
      reference_id: quoteId,
    });
    const customerId = customerResult.customer?.id;
    if (!customerId) throw new Error("Square did not return a customer record.");

    const orderResult = await squareRequest<{ order?: { id?: string } }>("/orders", {
      idempotency_key: `${requestKey}-order`,
      order: {
        location_id: locationId,
        reference_id: quoteId,
        line_items: [{
          name: `Required deposit — ${project}`.slice(0, 512),
          quantity: "1",
          base_price_money: { amount: amountCents, currency: "USD" },
        }],
      },
    });
    const orderId = orderResult.order?.id;
    if (!orderId) throw new Error("Square did not return an order record.");

    const invoiceResult = await squareRequest<{ invoice?: { id?: string; version?: number } }>("/invoices", {
      idempotency_key: `${requestKey}-invoice`,
      invoice: {
        location_id: locationId,
        order_id: orderId,
        primary_recipient: { customer_id: customerId },
        delivery_method: "EMAIL",
        title: "My Carport Guy required deposit",
        description: `Required deposit for ${project}. The remaining balance and final terms are governed by the signed order documents.`,
        payment_requests: [{ request_type: "BALANCE", due_date: dueDate }],
        accepted_payment_methods: { card: true, bank_account: true },
      },
    });
    const invoiceId = invoiceResult.invoice?.id;
    const version = invoiceResult.invoice?.version;
    if (!invoiceId || typeof version !== "number") throw new Error("Square did not return an invoice record.");

    const published = await squareRequest<{ invoice?: { id?: string; public_url?: string; status?: string } }>(`/invoices/${encodeURIComponent(invoiceId)}/publish`, {
      idempotency_key: `${requestKey}-publish`,
      version,
    });
    return Response.json({
      ok: true,
      invoiceId,
      invoiceUrl: published.invoice?.public_url || "",
      status: published.invoice?.status || "UNPAID",
      amount: amountCents / 100,
      dueDate,
    });
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : "Square could not send the invoice." }, { status: 502 });
  }
}
