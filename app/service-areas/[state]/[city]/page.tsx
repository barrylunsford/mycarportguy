import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { getServiceAreaCity, serviceAreaCities } from "@/lib/service-area-cities";

type PageProps = { params: Promise<{ state: string; city: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceAreaCities.map(({ stateSlug, slug }) => ({ state: stateSlug, city: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, city } = await params;
  const location = getServiceAreaCity(state, city);
  if (!location) return {};
  const path = `/service-areas/${location.stateSlug}/${location.slug}`;
  return {
    title: `Metal Carports & Garages in ${location.city}, ${location.stateAbbreviation}`,
    description: location.description,
    alternates: { canonical: path },
    openGraph: { url: path, title: `Metal Buildings in ${location.city}, ${location.stateAbbreviation} | My Carport Guy`, description: location.description },
  };
}

export default async function CityServiceAreaPage({ params }: PageProps) {
  const { state, city } = await params;
  const location = getServiceAreaCity(state, city);
  if (!location) notFound();
  const canonical = `https://www.mycarportguy.com/service-areas/${location.stateSlug}/${location.slug}`;
  const faqs = [
    { question: `Are metal buildings available in ${location.city}?`, answer: `Delivery and professional installation are available in qualifying ${location.city}-area ZIP codes. Send your ZIP code and building details so availability can be confirmed.` },
    { question: `Do I need a permit in ${location.city}?`, answer: "Requirements depend on the property, building design, and local jurisdiction. Check with the city or county office responsible for the installation address before ordering." },
    { question: "Can I customize the building?", answer: "Available buildings can be configured with different sizes, roof styles, colors, doors, windows, and enclosure options. Availability varies by design and ZIP code." },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", name: `Metal carports and buildings in ${location.city}, ${location.stateName}`, serviceType: "Metal carport and building sales", provider: { "@id": "https://www.mycarportguy.com/#organization" }, areaServed: { "@type": "City", name: `${location.city}, ${location.stateName}` }, url: canonical },
      { "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Service areas", item: "https://www.mycarportguy.com/service-areas" },
        { "@type": "ListItem", position: 2, name: location.stateName, item: `https://www.mycarportguy.com/service-areas/${location.stateSlug}` },
        { "@type": "ListItem", position: 3, name: location.city, item: canonical },
      ] },
    ],
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <Header />
    <main id="main-content" className="local-area-page">
      <section className="local-area-hero">
        <div className="local-breadcrumbs" aria-label="Breadcrumb"><Link href="/service-areas">Service areas</Link><span>/</span><Link href={`/service-areas/${location.stateSlug}`}>{location.stateName}</Link><span>/</span><strong>{location.city}</strong></div>
        <p className="eyebrow"><span />Serving {location.city}, {location.stateAbbreviation}</p>
        <h1>Metal carports, garages, and buildings for {location.city}.</h1>
        <p>{location.description} We’ll help you compare the practical options for your property and plans.</p>
        <div className="local-area-actions"><Link className="button" href="/#quote">Check my ZIP code <span aria-hidden="true">→</span></Link><a className="text-link" href="tel:+18288391730">Call (828) 839-1730</a></div>
        <p className="local-online-note">Online dealer serving {location.region}. No public showroom or customer pickup location.</p>
      </section>
      <section className="local-area-intro"><div><p className="eyebrow"><span />Plan around your property</p><h2>Start with the site, access, and local requirements.</h2></div><p>{location.planningNote}</p></section>
      <section className="local-projects">
        <div className="local-section-heading"><p className="eyebrow"><span />Popular project types</p><h2>Protection and storage designed around real life.</h2></div>
        <div className="local-project-grid"><article><span>01</span><h3>Vehicle coverage</h3><p>Carports and garages for cars, trucks, boats, trailers, and daily parking.</p></article><article><span>02</span><h3>RV protection</h3><p>Taller covers and garages planned around campers and recreational vehicles.</p></article><article><span>03</span><h3>Work and storage</h3><p>Enclosed garages and barns for tools, equipment, workshops, and property storage.</p></article></div>
        <div className="local-building-links"><Link href="/products/carports">Carports</Link><Link href="/products/garages">Garages</Link><Link href="/products/rv-covers">RV covers</Link><Link href="/products/barns-buildings">Barns &amp; buildings</Link></div>
      </section>
      <section className="local-checklist"><div><p className="eyebrow"><span />Before you order</p><h2>Prepare for a smooth installation.</h2></div><ol><li><strong>Measure carefully</strong><span>Allow space for the building, roof overhang, doors, access, and installation.</span></li><li><strong>Check local rules</strong><span>Confirm permits, setbacks, foundations, anchors, and engineering requirements.</span></li><li><strong>Prepare the pad</strong><span>The site should be level, accessible, and free of overhead or underground obstacles.</span></li><li><strong>Confirm the ZIP code</strong><span>We’ll check availability, current pricing, and estimated installation timing.</span></li></ol></section>
      <section className="local-nearby"><div><p className="eyebrow"><span />Nearby communities</p><h2>Helping customers throughout the {location.city} area.</h2></div><ul>{location.nearbyAreas.map((area) => <li key={area}>{area}</li>)}</ul></section>
      <section className="local-faq"><div className="local-section-heading"><p className="eyebrow"><span />Local ordering questions</p><h2>What to know before requesting a quote.</h2></div><div className="faq-list">{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>
      <section className="faq-cta local-area-cta"><div><strong>Ready to plan your {location.city} project?</strong><span>Send your ZIP code and building ideas for a free, no-pressure quote.</span></div><div><Link className="button" href="/buildings">Browse buildings</Link><Link className="button button-dark" href="/#quote">Request a quote</Link></div></section>
    </main>
  </>;
}
