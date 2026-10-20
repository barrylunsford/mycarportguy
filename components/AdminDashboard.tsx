"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdminQuotes from "@/components/AdminQuotes";
import type { Product } from "@/lib/products";
import type { QuoteLead } from "@/lib/quote-types";

type Props = {
  initialProducts: Product[];
  initialQuotes: QuoteLead[];
  editable: boolean;
  loginConfigured: boolean;
};

const blankProduct = (): Product => ({
  id: crypto.randomUUID(),
  slug: "",
  name: "",
  category: "Carports",
  width: undefined,
  length: undefined,
  height: undefined,
  roofStyle: "",
  carCapacity: "",
  summary: "",
  description: "",
  sizeNote: "",
  priceLabel: "Request current pricing",
  imageUrl: "",
  designUrl: "",
  featured: false,
  published: true,
  sortOrder: 0,
});

export default function AdminDashboard({ initialProducts, initialQuotes, editable, loginConfigured }: Props) {
  const [view, setView] = useState<"products" | "quotes">("quotes");
  const [products, setProducts] = useState(initialProducts);
  const [selectedId, setSelectedId] = useState(initialProducts[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const selected = products.find((product) => product.id === selectedId);
  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return products.filter((product) =>
      `${product.name} ${product.category}`.toLowerCase().includes(needle),
    );
  }, [products, query]);

  function updateSelected(patch: Partial<Product>) {
    setProducts((current) =>
      current.map((product) =>
        product.id === selectedId ? { ...product, ...patch } : product,
      ),
    );
    setNotice("Unsaved changes");
  }

  function addProduct() {
    const product = blankProduct();
    product.sortOrder = products.length + 1;
    setProducts((current) => [...current, product]);
    setSelectedId(product.id);
    setNotice("New product ready to edit");
  }

  function duplicateProduct() {
    if (!selected) return;
    const copy = {
      ...selected,
      id: crypto.randomUUID(),
      name: `${selected.name} copy`,
      slug: `${selected.slug}-copy`,
      published: false,
      sortOrder: products.length + 1,
    };
    setProducts((current) => [...current, copy]);
    setSelectedId(copy.id);
    setNotice("Duplicate created as hidden");
  }

  function removeProduct() {
    if (!selected) return;
    const next = products.filter((product) => product.id !== selected.id);
    setProducts(next);
    setSelectedId(next[0]?.id ?? "");
    setNotice("Product removed. Save changes to confirm.");
  }

  function move(direction: -1 | 1) {
    const index = products.findIndex((product) => product.id === selectedId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= products.length) return;
    const next = [...products];
    [next[index], next[target]] = [next[target], next[index]];
    setProducts(next.map((product, order) => ({ ...product, sortOrder: order + 1 })));
    setNotice("Order changed");
  }

  async function save() {
    setSaving(true);
    setNotice("Saving…");
    try {
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });
      const result = (await response.json()) as { message?: string; products?: Product[] };
      if (!response.ok) throw new Error(result.message || "Could not save products.");
      if (result.products) setProducts(result.products);
      setNotice("All changes saved");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save products.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-app">
      <header className="admin-topbar">
        <Link className="admin-brand" href="/">My Carport Guy</Link>
        <nav className="admin-primary-nav" aria-label="Admin sections">
          <button type="button" className={view === "products" ? "active" : ""} onClick={() => setView("products")}>Products</button>
          <button type="button" className={view === "quotes" ? "active" : ""} onClick={() => setView("quotes")}>Leads{initialQuotes.filter((quote) => quote.status === "New").length > 0 && <span>{initialQuotes.filter((quote) => quote.status === "New").length}</span>}</button>
        </nav>
        <div>
          <span className={`admin-mode ${editable ? "" : "locked"}`}>
            {editable ? "Local editing" : "Hosted editing locked"}
          </span>
          <Link href="/" target="_blank" rel="noreferrer">View website ↗</Link>
          {loginConfigured && (
            <>
              <Link href="/admin/change-password">Change password</Link>
              <form action="/api/admin/logout" method="post">
                <button className="admin-logout" type="submit">Sign out</button>
              </form>
            </>
          )}
        </div>
      </header>

      {!editable && (
        <div className="admin-alert">
          Secure login and hosted database storage must be connected before online editing is enabled.
        </div>
      )}

      <div hidden={view !== "quotes"}><AdminQuotes initialQuotes={initialQuotes} editable={editable} /></div>
      {view === "products" && <main className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-heading">
            <div>
              <span>Catalog</span>
              <strong>{products.length} products</strong>
            </div>
            <button type="button" onClick={addProduct} disabled={!editable}>+ Add</button>
          </div>
          <label className="admin-search">
            <span className="sr-only">Search products</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products…"
            />
          </label>
          <div className="admin-product-list">
            {filtered.map((product) => (
              <button
                type="button"
                key={product.id}
                className={product.id === selectedId ? "active" : ""}
                onClick={() => setSelectedId(product.id)}
              >
                <span className="admin-product-thumb" aria-hidden="true">
                  {product.name.slice(0, 1) || "+"}
                </span>
                <span>
                  <strong>{product.name || "Untitled product"}</strong>
                  <small>{product.category} · {product.published ? "Visible" : "Hidden"}</small>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="admin-editor">
          {selected ? (
            <>
              <div className="admin-editor-heading">
                <div>
                  <span>Product details</span>
                  <h1>{selected.name || "New product"}</h1>
                </div>
                <div className="admin-actions">
                  <button type="button" onClick={() => move(-1)} disabled={!editable}>↑</button>
                  <button type="button" onClick={() => move(1)} disabled={!editable}>↓</button>
                  <button type="button" onClick={duplicateProduct} disabled={!editable}>Duplicate</button>
                  <Link href={`/products/${selected.slug}`} target="_blank" rel="noreferrer">Preview ↗</Link>
                </div>
              </div>

              <div className="admin-form-grid">
                <label>
                  Product name
                  <input value={selected.name} onChange={(e) => updateSelected({ name: e.target.value })} disabled={!editable} />
                </label>
                <label>
                  Category
                  <input value={selected.category} onChange={(e) => updateSelected({ category: e.target.value })} disabled={!editable} />
                </label>
                <label>
                  Vehicle capacity
                  <input value={selected.carCapacity ?? ""} onChange={(e) => updateSelected({ carCapacity: e.target.value })} placeholder="Example: 2 Car" disabled={!editable} />
                </label>
                <label>
                  Roof style
                  <input value={selected.roofStyle ?? ""} onChange={(e) => updateSelected({ roofStyle: e.target.value })} placeholder="Example: Vertical Roof" disabled={!editable} />
                </label>
                <label>
                  Width (feet)
                  <input type="number" min="1" value={selected.width ?? ""} onChange={(e) => updateSelected({ width: e.target.value ? Number(e.target.value) : undefined })} disabled={!editable} />
                </label>
                <label>
                  Length (feet)
                  <input type="number" min="1" value={selected.length ?? ""} onChange={(e) => updateSelected({ length: e.target.value ? Number(e.target.value) : undefined })} disabled={!editable} />
                </label>
                <label>
                  Height (feet)
                  <input type="number" min="1" value={selected.height ?? ""} onChange={(e) => updateSelected({ height: e.target.value ? Number(e.target.value) : undefined })} disabled={!editable} />
                </label>
                <label className="admin-full">
                  Page address
                  <div className="admin-slug"><span>mycarportguy.com/products/</span><input value={selected.slug} onChange={(e) => updateSelected({ slug: e.target.value })} disabled={!editable} /></div>
                </label>
                <label className="admin-full">
                  Short description
                  <input value={selected.summary} onChange={(e) => updateSelected({ summary: e.target.value })} maxLength={220} disabled={!editable} />
                </label>
                <label className="admin-full">
                  Full description
                  <textarea value={selected.description} onChange={(e) => updateSelected({ description: e.target.value })} rows={6} disabled={!editable} />
                </label>
                <label>
                  Size or options note
                  <input value={selected.sizeNote} onChange={(e) => updateSelected({ sizeNote: e.target.value })} disabled={!editable} />
                </label>
                <label>
                  Price text
                  <input value={selected.priceLabel} onChange={(e) => updateSelected({ priceLabel: e.target.value })} disabled={!editable} />
                </label>
                <label className="admin-full">
                  Image URL
                  <input value={selected.imageUrl} onChange={(e) => updateSelected({ imageUrl: e.target.value })} placeholder="Image uploads will be connected with hosted storage" disabled={!editable} />
                </label>
                <label className="admin-full admin-design-link">
                  Prebuilt design link
                  <input
                    type="url"
                    value={selected.designUrl}
                    onChange={(e) => updateSelected({ designUrl: e.target.value })}
                    placeholder="https://manufacturer.example/your-prebuilt-design"
                    disabled={!editable}
                  />
                  <small>Customers will use this link to open and customize this exact structure.</small>
                </label>
              </div>

              <div className="admin-switches">
                <label><input type="checkbox" checked={selected.published} onChange={(e) => updateSelected({ published: e.target.checked })} disabled={!editable} /> Visible on website</label>
                <label><input type="checkbox" checked={selected.featured} onChange={(e) => updateSelected({ featured: e.target.checked })} disabled={!editable} /> Featured on homepage</label>
              </div>

              <div className="admin-footer-actions">
                <button type="button" className="admin-delete" onClick={removeProduct} disabled={!editable}>Remove product</button>
                <div>
                  <span role="status" aria-live="polite">{notice}</span>
                  <button type="button" className="admin-save" onClick={save} disabled={!editable || saving}>{saving ? "Saving…" : "Save changes"}</button>
                </div>
              </div>
            </>
          ) : (
            <div className="admin-empty"><h1>No products yet</h1><p>Add your first product to get started.</p></div>
          )}
        </section>
      </main>}
    </div>
  );
}
