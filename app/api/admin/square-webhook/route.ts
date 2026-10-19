import { hasAdminSession, isAdminConfigured } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const squareVersion = "2026-09-16";

async function authorized() {
  if (!isAdminConfigured() && process.env.NODE_ENV === "production") return false;
  return !isAdminConfigured() || (await hasAdminSession());
}

export async function POST() {
  if (!(await authorized())) return Response.json({ message: "Please sign in again." }, { status: 401 });
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) return Response.json({ message: "Square is not connected yet." }, { status: 503 });

  try {
    const response = await fetch("https://connect.squareup.com/v2/webhooks/subscriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "Square-Version": squareVersion },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        subscription: {
          name: "My Carport Guy invoice status",
          enabled: true,
          notification_url: "https://www.mycarportguy.com/api/webhooks/square",
          api_version: squareVersion,
          event_types: ["invoice.canceled", "invoice.payment_made", "invoice.refunded", "invoice.updated"],
        },
      }),
      cache: "no-store",
    });
    const result = (await response.json()) as { subscription?: { id?: string; signature_key?: string }; errors?: Array<{ detail?: string }> };
    if (!response.ok || !result.subscription?.signature_key) throw new Error(result.errors?.[0]?.detail || "Square could not create the webhook.");
    return Response.json({ ok: true, subscriptionId: result.subscription.id, signatureKey: result.subscription.signature_key });
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : "Square could not create the webhook." }, { status: 502 });
  }
}
