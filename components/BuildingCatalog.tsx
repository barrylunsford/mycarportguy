"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";

type Props = { products: Product[] };

function inferredDimensions(product: Product) {
  const match = product.name.match(/(\d+)x(\d+)x(\d+)/i);
  return {
    width: product.width ?? (match ? Number(match[1]) : undefined),
    length: product.length ?? (match ? Number(match[2]) : undefined),
    height: product.height ?? (match ? Number(match[3]) : undefined),
  };
}

function inferredRoofStyle(product: Product) {
  if (product.roofStyle) return product.roofStyle;
  const name = product.name.toLowerCase();
  if (name.includes("vertical")) return "Vertical Roof";
  if (name.includes("boxed eave")) return "Boxed Eave Roof";
  if (name.includes("regular")) return "Regular Roof";
  return "";
}

function uniqueSorted(values: Array<string | number | undefined>) {
  return [...new Set(values.filter((value): value is string | number => value !== undefined && value !== ""))]
    .sort((a, b) => typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b)));
}

export default function BuildingCatalog({ products }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [capacity, setCapacity] = useState("All");
  const [roofStyle, setRoofStyle] = useState("All");
  const [width, setWidth] = useState("All");
  const [length, setLength] = useState("All");
  const [height, setHeight] = useState("All");

  const enriched = useMemo(() => products.map((product) => ({
    product,
    ...inferredDimensions(product),
    roofStyle: inferredRoofStyle(product),
  })), [products]);

  const categories = uniqueSorted(products.map((product) => product.category));
  const capacities = uniqueSorted(products.map((product) => product.carCapacity));
  const roofStyles = uniqueSorted(enriched.map((item) => item.roofStyle));
  const widths = uniqueSorted(enriched.map((item) => item.width));
  const lengths = uniqueSorted(enriched.map((item) => item.length));
  const heights = uniqueSorted(enriched.map((item) => item.height));

  const filtered = enriched.filter(({ product, width: itemWidth, length: itemLength, height: itemHeight, roofStyle: itemRoof }) => {
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || `${product.name} ${product.summary} ${product.category} ${product.sizeNote}`.toLowerCase().includes(needle);
    return matchesQuery &&
      (category === "All" || product.category === category) &&
      (capacity === "All" || product.carCapacity === capacity) &&
      (roofStyle === "All" || itemRoof === roofStyle) &&
      (width === "All" || itemWidth === Number(width)) &&
      (length === "All" || itemLength === Number(length)) &&
      (height === "All" || itemHeight === Number(height));
  });

  const reset = () => {
    setQuery("");
    setCategory("All");
    setCapacity("All");
    setRoofStyle("All");
    setWidth("All");
    setLength("All");
    setHeight("All");
  };

  return (
    <div className="catalog-shell">
      <aside className="catalog-filters" aria-label="Filter buildings">
        <div className="catalog-filter-heading">
          <div><span>Filter products</span><strong>{filtered.length} results</strong></div>
          <button type="button" onClick={reset}>Reset</button>
        </div>
        <label className="catalog-search">
          <span>Search buildings</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or size…" />
        </label>
        <fieldset>
          <legend>Building type</legend>
          <div className="catalog-category-options">
            {["All", ...categories].map((item) => (
              <button key={item} type="button" className={category === item ? "active" : ""} onClick={() => setCategory(String(item))}>
                {item}
              </button>
            ))}
          </div>
        </fieldset>
        <label>Vehicle capacity<select value={capacity} onChange={(event) => setCapacity(event.target.value)}><option>All</option>{capacities.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Roof style<select value={roofStyle} onChange={(event) => setRoofStyle(event.target.value)}><option>All</option>{roofStyles.map((item) => <option key={item}>{item}</option>)}</select></label>
        <div className="catalog-dimensions">
          <label>Width<select value={width} onChange={(event) => setWidth(event.target.value)}><option>All</option>{widths.map((item) => <option key={item} value={item}>{item}&apos;</option>)}</select></label>
          <label>Length<select value={length} onChange={(event) => setLength(event.target.value)}><option>All</option>{lengths.map((item) => <option key={item} value={item}>{item}&apos;</option>)}</select></label>
          <label>Height<select value={height} onChange={(event) => setHeight(event.target.value)}><option>All</option>{heights.map((item) => <option key={item} value={item}>{item}&apos;</option>)}</select></label>
        </div>
      </aside>

      <section className="catalog-results" aria-live="polite">
        <div className="catalog-results-heading">
          <p><strong>{filtered.length}</strong> buildings match your filters</p>
        </div>
        {filtered.length ? (
          <div className="catalog-grid">
            {filtered.map(({ product, roofStyle: itemRoof }) => (
              <article className="catalog-card" key={product.id}>
                <Link className="catalog-card-image" href={`/products/${product.slug}`}>
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrl} alt={product.name} />
                  ) : <span aria-hidden="true">MCG</span>}
                </Link>
                <div className="catalog-card-body">
                  <span className="catalog-card-category">{product.category}</span>
                  <h2><Link href={`/products/${product.slug}`}>{product.name}</Link></h2>
                  <p>{product.summary}</p>
                  <div className="catalog-card-specs">
                    {product.carCapacity && <span>{product.carCapacity}</span>}
                    {itemRoof && <span>{itemRoof}</span>}
                    {product.sizeNote && <span>{product.sizeNote.split("·")[0]}</span>}
                  </div>
                  <div className="catalog-card-footer">
                    <strong>{product.priceLabel}</strong>
                    <Link href={`/products/${product.slug}`}>View details <span aria-hidden="true">→</span></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <h2>No exact matches yet.</h2>
            <p>Clear a filter or contact us—we can help configure a building around your needs.</p>
            <button className="button button-dark" type="button" onClick={reset}>Clear all filters</button>
          </div>
        )}
      </section>
    </div>
  );
}
