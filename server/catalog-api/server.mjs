import { createServer } from "node:http";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const port = Number(process.env.PORT || 3100);
const host = process.env.HOST || "127.0.0.1";
const token = String(process.env.CATALOG_API_TOKEN || "");
const dataFile = process.env.CATALOG_PRODUCTS_FILE || "/root/mycarportguy-data/products.json";
const quotesFile = process.env.CATALOG_QUOTES_FILE || "/root/mycarportguy-data/quotes.json";
const adminAuthFile = process.env.CATALOG_ADMIN_AUTH_FILE || "/root/mycarportguy-data/admin-auth.json";
const maxBodyBytes = 250_000;
const quoteStatuses = new Set(["New", "Contacted", "Quoted", "Won", "Lost"]);
let quoteWriteQueue = Promise.resolve();

function json(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(JSON.stringify(body));
}

function authorized(request) {
  if (!token) return false;
  const supplied = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const left = Buffer.from(supplied);
  const right = Buffer.from(token);
  return left.length === right.length && timingSafeEqual(left, right);
}

async function readProducts() {
  try {
    const raw = JSON.parse(await fs.readFile(dataFile, "utf8"));
    return Array.isArray(raw) ? raw : [];
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

function backupName() {
  return `products-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
}

async function pruneBackups(directory, keep = 50) {
  const names = await fs.readdir(directory).catch(() => []);
  const files = await Promise.all(
    names
      .filter((name) => /^products-.*\.json$/.test(name))
      .map(async (name) => ({ name, stat: await fs.stat(path.join(directory, name)) })),
  );
  files.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
  await Promise.all(files.slice(keep).map((file) => fs.unlink(path.join(directory, file.name))));
}

async function saveProducts(products) {
  const directory = path.dirname(dataFile);
  const backupDirectory = path.join(directory, "backups");
  await fs.mkdir(backupDirectory, { recursive: true, mode: 0o700 });

  try {
    await fs.copyFile(dataFile, path.join(backupDirectory, backupName()));
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  const temporaryFile = `${dataFile}.tmp`;
  await fs.writeFile(temporaryFile, `${JSON.stringify(products, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await fs.rename(temporaryFile, dataFile);
  await pruneBackups(backupDirectory);
}

async function readQuotes() {
  try {
    const raw = JSON.parse(await fs.readFile(quotesFile, "utf8"));
    return Array.isArray(raw) ? raw : [];
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

async function saveQuotes(quotes) {
  const directory = path.dirname(quotesFile);
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  const temporaryFile = `${quotesFile}.tmp`;
  await fs.writeFile(temporaryFile, `${JSON.stringify(quotes, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await fs.rename(temporaryFile, quotesFile);
}

async function readAdminAuth() {
  try {
    const value = JSON.parse(await fs.readFile(adminAuthFile, "utf8"));
    return typeof value?.passwordHash === "string" ? value : { passwordHash: "" };
  } catch (error) {
    if (error?.code === "ENOENT") return { passwordHash: "" };
    throw error;
  }
}

async function saveAdminAuth(passwordHash) {
  const directory = path.dirname(adminAuthFile);
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  const temporaryFile = `${adminAuthFile}.tmp`;
  await fs.writeFile(temporaryFile, `${JSON.stringify({ passwordHash }, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await fs.rename(temporaryFile, adminAuthFile);
}

function queueQuoteWrite(operation) {
  const result = quoteWriteQueue.then(operation, operation);
  quoteWriteQueue = result.catch(() => undefined);
  return result;
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizeNewQuote(value) {
  if (!value || typeof value !== "object") return null;
  const quote = {
    name: clean(value.name, 100), phone: clean(value.phone, 40), email: clean(value.email, 160), zip: clean(value.zip, 10),
    structure: clean(value.structure, 80), product: clean(value.product, 160), roofColor: clean(value.roofColor, 60),
    trimColor: clean(value.trimColor, 60), wallColor: clean(value.wallColor, 60), preferredContact: clean(value.preferredContact, 40),
    timeframe: clean(value.timeframe, 60), intendedUse: clean(value.intendedUse, 100), bestTime: clean(value.bestTime, 40),
    dimensions: clean(value.dimensions, 80), siteReadiness: clean(value.siteReadiness, 100), details: clean(value.details, 2000),
  };
  return quote.name && quote.phone && quote.email && quote.zip && quote.structure ? quote : null;
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodyBytes) throw new Error("Request is too large.");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

    if (url.pathname === "/health" && request.method === "GET") {
      return json(response, 200, { ok: true });
    }

    if (!authorized(request)) {
      return json(response, 401, { message: "Unauthorized." });
    }

    if (url.pathname === "/products" && request.method === "GET") {
      return json(response, 200, { products: await readProducts() });
    }

    if (url.pathname === "/products" && request.method === "PUT") {
      const body = await readJsonBody(request);
      if (!Array.isArray(body?.products) || body.products.length > 250) {
        return json(response, 400, { message: "Invalid product list." });
      }
      await saveProducts(body.products);
      return json(response, 200, { ok: true });
    }

    if (url.pathname === "/quotes" && request.method === "GET") {
      return json(response, 200, { quotes: await readQuotes() });
    }

    if (url.pathname === "/admin-auth" && request.method === "GET") {
      return json(response, 200, await readAdminAuth());
    }

    if (url.pathname === "/admin-auth" && request.method === "PUT") {
      const body = await readJsonBody(request);
      const passwordHash = clean(body?.passwordHash, 200);
      if (!/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(passwordHash)) {
        return json(response, 400, { message: "Invalid password hash." });
      }
      await saveAdminAuth(passwordHash);
      return json(response, 200, { ok: true });
    }

    if (url.pathname === "/quotes" && request.method === "POST") {
      const body = await readJsonBody(request);
      const input = normalizeNewQuote(body?.quote);
      if (!input) return json(response, 400, { message: "Invalid quote." });
      const now = new Date().toISOString();
      const quote = { ...input, id: randomUUID(), createdAt: now, updatedAt: now, status: "New", notes: "" };
      await queueQuoteWrite(async () => {
        const quotes = await readQuotes();
        quotes.unshift(quote);
        await saveQuotes(quotes.slice(0, 10_000));
      });
      return json(response, 201, { ok: true, quote });
    }

    const quoteMatch = url.pathname.match(/^\/quotes\/([^/]+)$/);
    if (quoteMatch && request.method === "PUT") {
      const id = decodeURIComponent(quoteMatch[1]).slice(0, 100);
      const body = await readJsonBody(request);
      const status = clean(body?.status, 20);
      const notes = clean(body?.notes, 5000);
      if (!quoteStatuses.has(status)) return json(response, 400, { message: "Invalid quote status." });
      const updated = await queueQuoteWrite(async () => {
        const quotes = await readQuotes();
        const index = quotes.findIndex((quote) => quote.id === id);
        if (index < 0) return null;
        quotes[index] = { ...quotes[index], status, notes, updatedAt: new Date().toISOString() };
        await saveQuotes(quotes);
        return quotes[index];
      });
      if (!updated) return json(response, 404, { message: "Quote not found." });
      return json(response, 200, { ok: true, quote: updated });
    }

    return json(response, 404, { message: "Not found." });
  } catch (error) {
    console.error(error);
    return json(response, 500, { message: error instanceof Error ? error.message : "Server error." });
  }
});

if (!token) {
  console.error("CATALOG_API_TOKEN is required.");
  process.exit(1);
}

server.listen(port, host, () => {
  console.log(`My Carport Guy catalog API listening on http://${host}:${port}`);
});
