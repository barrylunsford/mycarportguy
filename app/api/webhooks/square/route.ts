import { getQuoteLeads, updateQuoteLead } from "@/lib/quotes";
import { type SquareInvoiceEvent, validSquareSignature } from "@/lib/square-webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handledEvents = new Set(["invoice.payment_made", "invoice.canceled", "invoice.refunded", "invoice.updated"]);

export async function POST(request: Request) {
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  const signature = request.headers.get("x-square-hmacsha256-signature") || "";
  const rawBody = await request.text();
  if (!signatureKey || !validSquareSignature(rawBody, signature, signatureKey)) {
    return Response.json({ message: "Invalid signature." }, { status: 403 });
  }

  let event: SquareInvoiceEvent;
  try {
    event = JSON.parse(rawBody) as SquareInvoiceEvent;
  } catch {
    return Response.json({ message: "Invalid payload." }, { status: 400 });
  }
  if (!event.type || !handledEvents.has(event.type)) return Response.json({ ok: true, ignored: true });

  const invoice = event.data?.object?.invoice;
  const invoiceId = invoice?.id || event.data?.id || "";
  if (!invoiceId) return Response.json({ ok: true, ignored: true });

  const quotes = await getQuoteLeads();
  const lead = quotes.find((quote) => quote.squareInvoiceId === invoiceId || quote.notes.includes(`ID ${invoiceId}`));
  if (!lead) return Response.json({ ok: true, unmatched: true });

  const invoiceStatus = invoice?.status || (event.type === "invoice.payment_made" ? "PAID" : event.type.replace("invoice.", "").toUpperCase());
  const paid = invoiceStatus === "PAID" || event.type === "invoice.payment_made";
  const paidAt = paid ? (event.created_at || new Date().toISOString()) : lead.squareInvoicePaidAt;
  const completedCents = invoice?.payment_requests?.reduce((total, request) => total + (request.total_completed_amount_money?.amount || 0), 0) || 0;
  const alreadyRecorded = paid && lead.squareInvoiceStatus === "PAID";
  const paymentNote = paid && !alreadyRecorded
    ? `Square confirmed deposit paid ${new Date(paidAt || Date.now()).toLocaleString("en-US", { timeZone: "America/New_York" })}: $${((completedCents || Math.round((lead.squareInvoiceAmount || 0) * 100)) / 100).toFixed(2)}, ID ${invoiceId}`
    : "";
  const followUp = new Date();
  followUp.setDate(followUp.getDate() + 7);
  const followUpParts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(followUp);
  const datePart = (type: string) => followUpParts.find((part) => part.type === type)?.value || "";
  const purchaseFollowUp = `${datePart("year")}-${datePart("month")}-${datePart("day")}`;

  await updateQuoteLead(lead.id, {
    status: paid ? "Purchased" : lead.status,
    notes: `${lead.notes}${paymentNote ? `${lead.notes ? "\n" : ""}${paymentNote}` : ""}`,
    nextFollowUp: paid ? purchaseFollowUp : (lead.nextFollowUp || ""),
    lastContactedAt: lead.lastContactedAt || "",
    squareInvoiceId: invoiceId,
    squareInvoiceUrl: lead.squareInvoiceUrl || "",
    squareInvoiceStatus: paid ? "PAID" : invoiceStatus,
    squareInvoiceAmount: completedCents ? completedCents / 100 : (lead.squareInvoiceAmount || 0),
    squareInvoiceDueDate: lead.squareInvoiceDueDate || "",
    squareInvoicePaidAt: paidAt || "",
  });

  return Response.json({ ok: true });
}
