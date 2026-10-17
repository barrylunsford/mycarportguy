import { hasAdminSession, isAdminConfigured } from "@/lib/adminAuth";
import { getQuoteLeads } from "@/lib/quotes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const authorized = !isAdminConfigured() || (await hasAdminSession());
  if (!authorized) return Response.json({ message: "Unauthorized." }, { status: 401 });

  const quotes = await getQuoteLeads();
  const date = new Date().toISOString().slice(0, 10);
  const backup = JSON.stringify({
    format: "my-carport-guy-quote-backup",
    version: 1,
    createdAt: new Date().toISOString(),
    quoteCount: quotes.length,
    quotes,
  }, null, 2);

  return new Response(`${backup}\n`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="my-carport-guy-quotes-${date}.json"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
