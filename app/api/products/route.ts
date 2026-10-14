import { canEditProducts, getProducts, saveProducts, type Product } from "@/lib/products";
import { hasAdminSession, isAdminConfigured } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function dimension(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 && number <= 500 ? number : undefined;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function normalizeProduct(value: unknown, index: number): Product | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<Product>;
  const name = text(item.name, 100);
  const requestedSlug = text(item.slug, 80);
  const slug = slugify(requestedSlug || name);
  const imageUrl = text(item.imageUrl, 500);
  const designUrl = text(item.designUrl, 500);
  const validOptionalUrl = (url: string) => !url || /^https?:\/\//i.test(url);
  if (!name || !slug || !validOptionalUrl(imageUrl) || !validOptionalUrl(designUrl)) {
    return null;
  }

  return {
    id: text(item.id, 100) || crypto.randomUUID(),
    slug,
    name,
    category: text(item.category, 80) || "Other",
    width: dimension(item.width),
    length: dimension(item.length),
    height: dimension(item.height),
    roofStyle: text(item.roofStyle, 60),
    carCapacity: text(item.carCapacity, 40),
    summary: text(item.summary, 220),
    description: text(item.description, 2_000),
    sizeNote: text(item.sizeNote, 160),
    priceLabel: text(item.priceLabel, 100) || "Request current pricing",
    imageUrl,
    designUrl,
    featured: Boolean(item.featured),
    published: item.published !== false,
    sortOrder: index + 1,
  };
}

export async function GET() {
  if (!isAdminConfigured() && process.env.NODE_ENV === "production") {
    return Response.json({ message: "Admin login is not configured." }, { status: 503 });
  }
  if (isAdminConfigured() && !(await hasAdminSession())) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }
  return Response.json({
    products: await getProducts({ includeHidden: true }),
    editable: canEditProducts(),
  });
}

export async function PUT(request: Request) {
  if (!isAdminConfigured() && process.env.NODE_ENV === "production") {
    return Response.json({ message: "Admin login is not configured." }, { status: 503 });
  }
  if (isAdminConfigured() && !(await hasAdminSession())) {
    return Response.json({ message: "Please sign in again." }, { status: 401 });
  }

  if (!canEditProducts()) {
    return Response.json(
      { message: "Hosted editing is locked until secure login and database storage are connected." },
      { status: 503 },
    );
  }

  let body: { products?: unknown };
  try {
    body = (await request.json()) as { products?: unknown };
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  if (!Array.isArray(body.products) || body.products.length > 250) {
    return Response.json({ message: "Invalid product list." }, { status: 400 });
  }

  const products = body.products
    .map(normalizeProduct)
    .filter((product): product is Product => product !== null);
  const slugs = products.map((product) => product.slug);
  if (products.length !== body.products.length || new Set(slugs).size !== slugs.length) {
    return Response.json(
      { message: "Every product needs a unique name and page address." },
      { status: 400 },
    );
  }

  await saveProducts(products);
  return Response.json({ ok: true, products });
}
