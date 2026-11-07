import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buildingDesignerUrl } from "@/lib/building-designer";
import Header from "@/components/Header";
import { getProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} | Metal Building`,
    description: `${product.summary} View details and request current pricing from My Carport Guy.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      url: `/products/${product.slug}`,
      title: `${product.name} | My Carport Guy`,
      description: `${product.summary} Request current pricing from My Carport Guy.`,
      images: product.imageUrl ? [{ url: product.imageUrl, alt: product.name }] : undefined,
    },
    twitter: {
      card: product.imageUrl ? "summary_large_image" : "summary",
      title: `${product.name} | My Carport Guy`,
      description: `${product.summary} Request current pricing from My Carport Guy.`,
      images: product.imageUrl ? [product.imageUrl] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const category = product.category.toLowerCase();
  const structureType = category.includes("barn")
    ? "Barn"
    : category.includes("rv")
      ? "RV cover"
      : category.includes("carport")
        ? "Carport"
        : category.includes("commercial")
          ? "Commercial building"
          : "Garage";
  const quoteUrl = `/?structure=${encodeURIComponent(structureType)}&product=${encodeURIComponent(product.name)}#quote`;

  return (
    <>
      <Header />
      <main id="main-content" className="product-page">
        <section className="product-hero">
          <div>
            <p className="eyebrow"><span />{product.category}</p>
            <h1>{product.name}</h1>
            <p>{product.summary}</p>
            <div className="product-hero-actions">
              <a className="button button-builder" href={buildingDesignerUrl} target="_blank" rel="noopener noreferrer">Design your building <span className="sr-only">(opens in a new tab)</span><span aria-hidden="true">↗</span></a>
              <Link className="text-link" href="/colors">Explore colors</Link>
              <a className="text-link" href="tel:+18284497158">Call (828) 449-7158</a>
            </div>
          </div>
          <div className={`product-visual${product.imageUrl ? " has-photo" : ""}`} aria-label={product.imageUrl ? `${product.name} image` : undefined}>
            {product.imageUrl ? (
              // Product images may come from the hosted media library once connected.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={`${product.name} example building`} />
            ) : (
              <div className="product-building" aria-hidden="true"><span /></div>
            )}
          </div>
        </section>
        <section className="product-details">
          <div>
            <p className="eyebrow"><span />Built around your needs</p>
            <h2>Let&apos;s plan the right building for your property.</h2>
            <p>{product.description}</p>
            {product.imageUrl && <p>Photo shows an example building. Your quote will confirm dimensions, colors, features, and availability for your property.</p>}
          </div>
          <aside>
            <div><span>Options</span><strong>{product.sizeNote || "Ask about available configurations"}</strong></div>
            <div><span>Pricing</span><strong>{product.priceLabel}</strong></div>
            <div><span>Next step</span><strong>Use this as inspiration, then tell us how you want yours configured</strong></div>
          </aside>
        </section>
        <section className="product-details" aria-labelledby="building-options-heading">
          <div>
            <p className="eyebrow"><span />Compare your options</p>
            <h2 id="building-options-heading">Details that make the building yours.</h2>
            <h3>Roof styles</h3>
            <p>Compare a standard roof with rounded corners, an A-frame horizontal roof with panels running front to back, and an A-frame vertical roof with panels running from the peak to the eaves. We&apos;ll confirm the options suitable for your location and building size.</p>
            <h3>Steel panels</h3>
            <p>Ask about 29-gauge Ag panels, upgraded 26-gauge Ag panels, and 26-gauge PBR panels. Panel gauge describes the sheet metal, separately from the frame gauge. PBR availability depends on your region and requires vertical sheeting.</p>
            <h3>Doors, windows, and finishing touches</h3>
            <p>Depending on your layout, you can request walk-in doors, roll-up doors, windows, insulation, and brush seals for roll-up openings. We&apos;ll check opening sizes, placement, compatibility, and current availability with your quote.</p>
            <Link className="text-link" href="/colors">Explore roof, wall, and trim colors →</Link>
          </div>
          <aside>
            <div><span>Bring your measurements</span><strong>Share the overall width, length, and height you need, including clearance for vehicles and doors.</strong></div>
            <div><span>Plan the installation site</span><strong>Tell us your ZIP code, installation surface, access conditions, and whether you need a permit. Confirm foundation requirements before pouring concrete.</strong></div>
            <div><span>Confirm before ordering</span><strong>Your written quote should confirm options, anchoring, site requirements, delivery terms, and applicable warranties.</strong></div>
            <Link className="button" href={quoteUrl}>Plan my building <span aria-hidden="true">→</span></Link>
          </aside>
        </section>
      </main>
    </>
  );
}
