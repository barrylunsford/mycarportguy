import { timingSafeEqual } from "node:crypto";
import { getQuoteLeads } from "@/lib/quotes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const expected = Buffer.from(`Bearer ${process.env.CRON_SECRET || ""}`);
  const supplied = Buffer.from(request.headers.get("authorization") || "");
  return expected.length > 7 && expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ message: "Unauthorized." }, { status: 401 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.QUOTE_FROM_EMAIL;
  if (!apiKey || !from) return Response.json({ message: "Email backup is not configured." }, { status: 503 });

  const quotes = await getQuoteLeads();
  const date = new Date().toISOString().slice(0, 10);
  const backup = JSON.stringify({
    format: "my-carport-guy-quote-backup",
    version: 1,
    createdAt: new Date().toISOString(),
    quoteCount: quotes.length,
    quotes,
  }, null, 2);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: ["sales@mycarportguy.com"],
      subject: `Weekly quote backup | ${date}`,
      text: `Attached is the weekly My Carport Guy quote backup containing ${quotes.length} quote record${quotes.length === 1 ? "" : "s"}. Store this email securely.`,
      attachments: [{
        filename: `my-carport-guy-quotes-${date}.json`,
        content: Buffer.from(backup).toString("base64"),
      }],
    }),
  });

  if (!response.ok) return Response.json({ message: "Backup email could not be delivered." }, { status: 502 });
  return Response.json({ ok: true, quoteCount: quotes.length });
}
