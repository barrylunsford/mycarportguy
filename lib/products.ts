import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  width?: number;
  length?: number;
  height?: number;
  roofStyle?: string;
  carCapacity?: string;
  summary: string;
  description: string;
  sizeNote: string;
  priceLabel: string;
  imageUrl: string;
  designUrl: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

const productsPath = path.join(process.cwd(), "data", "products.json");

function remoteCatalogConfig() {
  const url = process.env.CATALOG_API_URL?.replace(/\/$/, "");
  const token = process.env.CATALOG_API_TOKEN;
  return url && token ? { url, token } : null;
}

export async function getProducts(options?: { includeHidden?: boolean }) {
  const remote = remoteCatalogConfig();
  let products: Product[];

  if (remote) {
    try {
      const response = await fetch(`${remote.url}/products`, {
        headers: { Authorization: `Bearer ${remote.token}` },
        cache: "no-store",
      });
      if (!response.ok) throw new Error("The hosted product catalog is unavailable.");
      const result = (await response.json()) as { products?: Product[] };
      products = Array.isArray(result.products) ? result.products : [];
    } catch (error) {
      if (process.env.NODE_ENV === "production") throw error;
      const raw = await fs.readFile(productsPath, "utf8");
      products = JSON.parse(raw) as Product[];
    }
  } else {
    const raw = await fs.readFile(productsPath, "utf8");
    products = JSON.parse(raw) as Product[];
  }

  const filtered = options?.includeHidden
    ? products
    : products.filter((product) => product.published);

  return filtered.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProduct(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export async function saveProducts(products: Product[]) {
  const remote = remoteCatalogConfig();
  if (remote) {
    const response = await fetch(`${remote.url}/products`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${remote.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ products }),
      cache: "no-store",
    });
    if (!response.ok) {
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      throw new Error(result.message || "The hosted product catalog could not be saved.");
    }
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Hosted product storage is not configured.");
  }

  await fs.mkdir(path.dirname(productsPath), { recursive: true });
  const temporaryPath = `${productsPath}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(products, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await fs.rename(temporaryPath, productsPath);
}

export function canEditProducts() {
  return Boolean(remoteCatalogConfig()) || process.env.NODE_ENV !== "production";
}
