import type { Metadata } from "next";
import Header from "@/components/Header";
import BuildingCatalog from "@/components/BuildingCatalog";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Browse Metal Buildings",
  description: "Browse and filter Eagle Carports metal garages, carports, barns, RV covers, and other steel buildings by size, roof style, and capacity.",
  alternates: { canonical: "/buildings" },
};

export const dynamic = "force-dynamic";

export default async function BuildingsPage() {
  const products = await getProducts();
  return (
    <>
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
