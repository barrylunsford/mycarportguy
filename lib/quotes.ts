import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import type { NewQuoteLead, QuoteLead, QuoteStatus } from "@/lib/quote-types";

const quotesPath = path.join(process.cwd(), "data", "quotes.json");

function remoteCatalogConfig() {
  const url = process.env.CATALOG_API_URL?.replace(/\/$/, "");
  const token = process.env.CATALOG_API_TOKEN;
  return url && token ? { url, token } : null;
}

async function readLocalQuotes(): Promise<QuoteLead[]> {
  try {
    const raw = JSON.parse(await fs.readFile(quotesPath, "utf8"));
    return Array.isArray(raw) ? raw : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeLocalQuotes(quotes: QuoteLead[]) {
  await fs.mkdir(path.dirname(quotesPath), { recursive: true });
  const temporaryPath = `${quotesPath}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(quotes, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await fs.rename(temporaryPath, quotesPath);
}

export async function getQuoteLeads() {
  const remote = remoteCatalogConfig();
  let quotes: QuoteLead[];
  if (remote) {
    const response = await fetch(`${remote.url}/quotes`, {
      headers: { Authorization: `Bearer ${remote.token}` },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("The hosted quote database is unavailable.");
    const result = (await response.json()) as { quotes?: QuoteLead[] };
    quotes = Array.isArray(result.quotes) ? result.quotes : [];
  } else {
    quotes = await readLocalQuotes();
  }
  return quotes.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createQuoteLead(input: NewQuoteLead) {
  const remote = remoteCatalogConfig();
  if (remote) {
    const response = await fetch(`${remote.url}/quotes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${remote.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quote: input }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("The quote could not be stored.");
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Hosted quote storage is not configured.");
  }
  const now = new Date().toISOString();
  const quotes = await readLocalQuotes();
  quotes.unshift({ ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now, status: "New", notes: "" });
  await writeLocalQuotes(quotes);
}

export async function updateQuoteLead(id: string, patch: { status: QuoteStatus; notes: string }) {
  const remote = remoteCatalogConfig();
  if (remote) {
    const response = await fetch(`${remote.url}/quotes/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${remote.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patch),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("The quote changes could not be saved.");
    const result = (await response.json()) as { quote: QuoteLead };
    return result.quote;
  }

  if (process.env.NODE_ENV === "production") throw new Error("Hosted quote storage is not configured.");
  const quotes = await readLocalQuotes();
  const index = quotes.findIndex((quote) => quote.id === id);
  if (index < 0) throw new Error("Quote not found.");
  quotes[index] = { ...quotes[index], ...patch, updatedAt: new Date().toISOString() };
  await writeLocalQuotes(quotes);
  return quotes[index];
}

export function canManageQuotes() {
  return Boolean(remoteCatalogConfig()) || process.env.NODE_ENV !== "production";
}
