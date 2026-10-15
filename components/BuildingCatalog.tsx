"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";

type Props = { products: Product[] };

const buildingTypeCards = [
  { id: "carports", label: "Carports", category: "Metal Carports", structure: "Carport", description: "Open-sided coverage for cars, trucks, and everyday equipment." },
  { id: "garages", label: "Garages", category: "Metal Garages", structure: "Garage", description: "Fully enclosed protection for vehicles, storage, or workspace." },
  { id: "rv-covers", label: "RV Covers", category: "Metal RV Covers", structure: "RV cover", description: "High-clearance coverage for RVs, campers, and tall vehicles." },
  { id: "barns-buildings", label: "Barns", category: "Metal Barns", structure: "Barn", description: "Versatile layouts for equipment, agriculture, and extra storage." },
] as const;

const buildingTypeIds = new Set<string>(buildingTypeCards.map((item) => item.id));

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

function categoryToStructure(category: string) {
  const value = category.toLowerCase();
  if (value.includes("barn")) return "Barn";
  if (value.includes("rv")) return "RV cover";
  if (value.includes("carport")) return "Carport";
  if (value.includes("commercial")) return "Commercial building";
  return "Garage";
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

  const actualProducts = useMemo(
    () => products.filter((product) => !buildingTypeIds.has(product.id)),
    [products],
  );

  const enriched = useMemo(() => actualProducts.map((product) => ({
    product,
    ...inferredDimensions(product),
    roofStyle: inferredRoofStyle(product),
  })), [actualProducts]);

  const categories = uniqueSorted(actualProducts.map((product) => product.category));
  const capacities = uniqueSorted(actualProducts.map((product) => product.carCapacity));
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

  const chooseBuildingType = (selectedCategory: string) => {
    reset();
    setCategory(selectedCategory);
    document.getElementById("building-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="building-type-section" aria-labelledby="building-type-heading">
        <div className="building-type-heading">
          <p className="eyebrow"><span />Choose a starting point</p>
          <h2 id="building-type-heading">What kind of building do you need?</h2>
          <p>Select a type to explore examples, or start your own design right away.</p>
        </div>
        <div className="building-type-grid">
          {buildingTypeCards.map((item) => {
            const count = actualProducts.filter((product) => product.category === item.category).length;
            return (
              <article
                className={category === item.category ? "building-type-card active" : "building-type-card"}
                key={item.id}
              >
                <span className="building-type-count">{count} inspiration {count === 1 ? "example" : "examples"}</span>
                <strong>{item.label}</strong>
                <span>{item.description}</span>
                <div className="building-type-actions">
                  <button type="button" onClick={() => chooseBuildingType(item.category)} aria-pressed={category === item.category}>
                    Explore examples
                  </button>
                  <Link href={`/?structure=${encodeURIComponent(item.structure)}#quote`}>
                    Design yours <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="catalog-shell" id="building-results">
      <aside className="catalog-filters" aria-label="Filter buildings">
        <div className="catalog-filter-heading">
          <div><span>Filter inspiration</span><strong>{filtered.length} examples</strong></div>
          <button type="button" onClick={reset}>Reset</button>
        </div>
        <label className="catalog-search">
          <span>Search examples</span>
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
          <p><strong>{filtered.length}</strong> design examples match your filters</p>
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
                    <Link href={`/products/${product.slug}`}>View details</Link>
                    <Link className="catalog-design-link" href={`/?structure=${encodeURIComponent(categoryToStructure(product.category))}&product=${encodeURIComponent(product.name)}#quote`}>Start with this design <span aria-hidden="true">→</span></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <h2>No exact matches yet.</h2>
            <p>Clear a filter or start a custom request—we can help configure a building around your needs.</p>
            <button className="button button-dark" type="button" onClick={reset}>Clear all filters</button>
          </div>
        )}
      </section>
      </div>
    </>
  );
}
