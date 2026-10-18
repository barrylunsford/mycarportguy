import { hasAdminSession, isAdminConfigured } from "@/lib/adminAuth";
import { canManageQuotes, createQuoteLead, getQuoteLeads, updateQuoteLead } from "@/lib/quotes";
import { quoteStatuses, type NewQuoteLead, type QuoteStatus } from "@/lib/quote-types";

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

  let body: { id?: unknown; status?: unknown; notes?: unknown; nextFollowUp?: unknown; lastContactedAt?: unknown };
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

  const nextFollowUp = body.nextFollowUp;
  const lastContactedAt = body.lastContactedAt;
  if ((nextFollowUp !== undefined && (typeof nextFollowUp !== "string" || (nextFollowUp !== "" && (!/^\d{4}-\d{2}-\d{2}$/.test(nextFollowUp) || !Number.isFinite(Date.parse(nextFollowUp)) || new Date(nextFollowUp).toISOString().slice(0, 10) !== nextFollowUp)))) ||
      (lastContactedAt !== undefined && (typeof lastContactedAt !== "string" || (lastContactedAt !== "" && !Number.isFinite(Date.parse(lastContactedAt)))))) {
    return Response.json({ message: "Invalid follow-up date." }, { status: 400 });
  }
  try {
    const quote = await updateQuoteLead(id, { status: status as QuoteStatus, notes, ...(nextFollowUp !== undefined ? { nextFollowUp: nextFollowUp as string } : {}), ...(lastContactedAt !== undefined ? { lastContactedAt: lastContactedAt as string } : {}) });
    return Response.json({ ok: true, quote });
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : "Could not save quote." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await authorized())) return Response.json({ message: "Please sign in again." }, { status: 401 });
  if (!canManageQuotes()) return Response.json({ message: "Hosted quote storage is not configured." }, { status: 503 });
  try {
    const body = await request.json();
    const fields = ["name", "phone", "email", "zip", "structure", "product", "roofColor", "trimColor", "wallColor", "preferredContact", "timeframe", "intendedUse", "bestTime", "dimensions", "siteReadiness", "details"] as const;
    const input = Object.fromEntries(fields.map((key) => [key, typeof body?.[key] === "string" ? body[key].trim().slice(0, key === "details" ? 2000 : 160) : ""])) as NewQuoteLead;
    if (!input.name || !input.phone || !input.email || !input.zip || !input.structure) return Response.json({ message: "Enter a name, phone, email, ZIP, and building interest." }, { status: 400 });
    await createQuoteLead(input);
    return Response.json({ ok: true, quotes: await getQuoteLeads() }, { status: 201 });
  } catch {
    return Response.json({ message: "Could not add lead. Check the details and try again." }, { status: 500 });
  }
}
