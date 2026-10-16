import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { getServiceAreaState, serviceAreaStates } from "@/lib/service-area-states";

type PageProps = { params: Promise<{ state: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceAreaStates
    .filter(({ slug }) => slug !== "north-carolina")
    .map(({ slug }) => ({ state: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getServiceAreaState(slug);
  if (!state || state.slug === "north-carolina") return {};

  const path = `/service-areas/${state.slug}`;
  return {
    title: `Metal Carports & Garages in ${state.name}`,
    description: `${state.summary} Get friendly online dealer guidance, delivery, and professional installation.` ,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title: `Metal Buildings in ${state.name} | My Carport Guy`,
      description: state.summary,
    },
  };
}

export default async function StateServiceAreaPage({ params }: PageProps) {
  const { state: slug } = await params;
  const state = getServiceAreaState(slug);
  if (!state || state.slug === "north-carolina") notFound();

  const canonical = `https://www.mycarportguy.com/service-areas/${state.slug}`;
  const faqs = [
    {
      question: `Are metal buildings available in ${state.name}?`,
      answer: `Delivery and professional installation are available in qualifying ${state.name} ZIP codes. Send the installation ZIP code and building details so current availability can be confirmed.`,
    },
    {
      question: `Do I need a permit for a metal building in ${state.name}?`,
      answer: "Permit, setback, foundation, and engineering requirements vary by city and county. Check with the authority responsible for your property before placing an order.",
    },
    {
      question: "How do I get an accurate price?",
      answer: "Share your ZIP code, preferred building type, approximate dimensions, colors, and enclosure options. We’ll use those details to help prepare a current quote.",
    },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `Metal carports and buildings in ${state.name}`,
        serviceType: "Metal carport and building sales",
        provider: { "@id": "https://www.mycarportguy.com/#organization" },
        areaServed: { "@type": "State", name: state.name },
        url: canonical,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Service areas", item: "https://www.mycarportguy.com/service-areas" },
          { "@type": "ListItem", position: 2, name: state.name, item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Header />
      <main id="main-content" className="local-area-page">
        <section className="local-area-hero">
          <div className="local-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/service-areas">Service areas</Link><span>/</span><strong>{state.name}</strong>
          </div>
          <p className="eyebrow"><span />Serving {state.name}</p>
          <h1>Metal carports, garages, and buildings for {state.name}.</h1>
          <p>{state.summary} We help you compare sizes, roof styles, colors, and options from home.</p>
          <div className="local-area-actions">
            <Link className="button" href="/#quote">Check my ZIP code <span aria-hidden="true">→</span></Link>
            <a className="text-link" href="tel:+18288391730">Call (828) 839-1730</a>
          </div>
          <p className="local-online-note">Online dealer serving {state.name} and {state.region}. No public showroom or customer pickup location.</p>
        </section>

        <section className="local-area-intro">
          <div><p className="eyebrow"><span />Plan around your property</p><h2>Get the important details right before ordering.</h2></div>
          <p>{state.planningNote}</p>
        </section>

        <section className="local-projects">
          <div className="local-section-heading"><p className="eyebrow"><span />Buildings for your plans</p><h2>Choose the space and protection your property needs.</h2></div>
          <div className="local-project-grid">
            <article><span>01</span><h3>Carports &amp; RV covers</h3><p>Open-sided protection sized for cars, trucks, boats, campers, and recreational vehicles.</p></article>
            <article><span>02</span><h3>Garages &amp; workshops</h3><p>Enclosed buildings with customizable doors, windows, colors, and storage space.</p></article>
            <article><span>03</span><h3>Barns &amp; larger buildings</h3><p>Flexible layouts for equipment, agricultural use, business needs, and general storage.</p></article>
          </div>
          <div className="local-building-links">
            <Link href="/products/carports">Carports</Link><Link href="/products/garages">Garages</Link><Link href="/products/rv-covers">RV covers</Link><Link href="/products/barns-buildings">Barns &amp; buildings</Link>
          </div>
        </section>

        <section className="local-checklist">
          <div><p className="eyebrow"><span />Before you order</p><h2>Four steps toward an installation-ready site.</h2></div>
          <ol>
            <li><strong>Measure the area</strong><span>Allow room for the building, roof overhang, doors, access, and installation.</span></li>
            <li><strong>Check local rules</strong><span>Confirm permits, setbacks, anchors, foundations, and engineering requirements.</span></li>
            <li><strong>Prepare a level site</strong><span>Keep the pad accessible and clear of overhead and underground obstructions.</span></li>
            <li><strong>Share your ZIP code</strong><span>We’ll confirm product availability, current pricing, and estimated timing.</span></li>
          </ol>
        </section>

        <section className="local-nearby">
          <div><p className="eyebrow"><span />Areas we help serve</p><h2>Building guidance across {state.name}.</h2></div>
          <ul>{state.popularAreas.map((area) => <li key={area}>{area}</li>)}</ul>
        </section>

        <section className="local-faq">
          <div className="local-section-heading"><p className="eyebrow"><span />Ordering questions</p><h2>What to know about a {state.name} project.</h2></div>
          <div className="faq-list">{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div>
        </section>

        <section className="faq-cta local-area-cta">
          <div><strong>Ready to plan your {state.name} building?</strong><span>Send your ZIP code and ideas for a free, no-pressure quote.</span></div>
          <div><Link className="button" href="/buildings">Browse buildings</Link><Link className="button button-dark" href="/#quote">Request a quote</Link></div>
        </section>
      </main>
    </>
  );
}
