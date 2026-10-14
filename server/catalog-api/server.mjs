import { createServer } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const port = Number(process.env.PORT || 3100);
const host = process.env.HOST || "127.0.0.1";
const token = String(process.env.CATALOG_API_TOKEN || "");
const dataFile = process.env.CATALOG_PRODUCTS_FILE || "/root/mycarportguy-data/products.json";
const maxBodyBytes = 250_000;

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
