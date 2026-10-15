import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import BuildingCatalog from "@/components/BuildingCatalog";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Metal Buildings for Sale",
  description: "My Carport Guy helps you compare metal carports, garages, barns, RV covers, combo units, and loafing sheds by size, roof style, and capacity.",
  alternates: { canonical: "/buildings" },
  openGraph: {
    url: "/buildings",
    title: "Metal Buildings for Sale | My Carport Guy",
    description: "Compare metal buildings by type, size, roof style, and capacity with help from My Carport Guy.",
  },
};

export const dynamic = "force-dynamic";

export default async function BuildingsPage() {
  const products = await getProducts();
  const catalogProducts = products.filter((product) => !["carports", "garages", "rv-covers", "barns-buildings"].includes(product.id));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Metal Buildings",
    url: "https://www.mycarportguy.com/buildings",
    description: metadata.description,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: catalogProducts.length,
      itemListElement: catalogProducts.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://www.mycarportguy.com/products/${product.slug}`,
        name: product.name,
      })),
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main id="main-content" className="catalog-page">
        <section className="catalog-hero">
          <p className="eyebrow"><span />Find your building</p>
          <h1>Start with an idea. Make the building your own.</h1>
          <p>Choose a structure type, explore examples by size and features, then tell us how you want yours configured. The buildings shown here are starting points—not your only choices.</p>
          <div className="catalog-hero-actions">
            <Link className="button" href="/#quote">Design your building <span aria-hidden="true">→</span></Link>
            <Link className="text-link" href="/colors">Explore available colors</Link>
          </div>
        </section>
        <section className="custom-building-note" aria-label="Custom building process">
          <strong>Every building is customizable.</strong>
          <span>Adjust the size, roof style, colors, doors, windows, and other options to fit your property and plans.</span>
        </section>
        <BuildingCatalog products={products} />
      </main>
    </>
  );
}
