import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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
    description: `${product.summary} View details and request current pricing from My Carport Guy, an Eagle Carports dealer.`,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl || undefined,
    sku: product.id.startsWith("sku-") ? product.id.slice(4).toUpperCase() : undefined,
    category: product.category,
    brand: { "@type": "Brand", name: "Eagle Carports" },
    url: `https://www.mycarportguy.com/products/${product.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main id="main-content" className="product-page">
        <section className="product-hero">
          <div>
            <p className="eyebrow"><span />{product.category}</p>
            <h1>{product.name}</h1>
            <p>{product.summary}</p>
            <div className="product-hero-actions">
              {product.designUrl && (
                <a
                  className="button button-builder"
                  href={product.designUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Customize this design <span aria-hidden="true">↗</span>
                </a>
              )}
              <Link className="button" href={quoteUrl}>Request a free quote <span aria-hidden="true">→</span></Link>
              <a className="text-link" href="tel:+18288391730">Call (828) 839-1730</a>
            </div>
          </div>
          <div className="product-visual" aria-label={product.imageUrl ? `${product.name} image` : undefined}>
            {product.imageUrl ? (
              // Product images may come from the hosted media library once connected.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={product.name} />
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
          </div>
          <aside>
            <div><span>Options</span><strong>{product.sizeNote || "Ask about available configurations"}</strong></div>
            <div><span>Pricing</span><strong>{product.priceLabel}</strong></div>
            <div><span>Next step</span><strong>{product.designUrl ? "Customize this design, then request your quote" : "Share your ZIP code and project details"}</strong></div>
          </aside>
        </section>
      </main>
    </>
  );
}
