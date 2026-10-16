import { hasAdminSession, isAdminConfigured } from "@/lib/adminAuth";
import { canManageQuotes, getQuoteLeads, updateQuoteLead } from "@/lib/quotes";
import { quoteStatuses, type QuoteStatus } from "@/lib/quote-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorized() {
  if (!isAdminConfigured() && process.env.NODE_ENV === "production") return false;
  return !isAdminConfigured() || (await hasAdminSession());
}

export async function GET() {
  if (!(await authorized())) return Response.json({ message: "Unauthorized." }, { status: 401 });
  return Response.json({ quotes: await getQuoteLeads(), editable: canManageQuotes() });
}

export async function PATCH(request: Request) {
  if (!(await authorized())) return Response.json({ message: "Please sign in again." }, { status: 401 });
  if (!canManageQuotes()) return Response.json({ message: "Hosted quote storage is not configured." }, { status: 503 });

  let body: { id?: unknown; status?: unknown; notes?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id.trim().slice(0, 100) : "";
  const status = typeof body.status === "string" ? body.status : "";
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 5_000) : "";
  if (!id || !quoteStatuses.includes(status as QuoteStatus)) {
    return Response.json({ message: "Invalid quote update." }, { status: 400 });
  }

  try {
    const quote = await updateQuoteLead(id, { status: status as QuoteStatus, notes });
    return Response.json({ ok: true, quote });
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : "Could not save quote." }, { status: 500 });
  }
}
