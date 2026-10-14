import type { Metadata } from "next";
import Header from "@/components/Header";
import BuildingCatalog from "@/components/BuildingCatalog";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Metal Carports, Garages, Barns & RV Covers",
  description: "Browse Eagle Carports metal carports, garages, barns, RV covers, combo units, and loafing sheds. Filter available buildings by size, roof style, and vehicle capacity.",
  alternates: { canonical: "/buildings" },
  openGraph: {
    url: "/buildings",
    title: "Metal Carports, Garages, Barns & RV Covers",
    description: "Compare Eagle Carports metal buildings by type, size, roof style, and capacity.",
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
          <h1>Built for your vehicles, your property, and your plans.</h1>
          <p>Compare available Eagle Carports structures, narrow the choices by features, and request current pricing from your local dealer.</p>
        </section>
        <BuildingCatalog products={products} />
      </main>
    </>
  );
}
