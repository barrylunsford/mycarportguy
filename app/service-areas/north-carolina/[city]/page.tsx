import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import {
  getNorthCarolinaLocation,
  northCarolinaLocations,
} from "@/lib/north-carolina-locations";

type PageProps = { params: Promise<{ city: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return northCarolinaLocations.map(({ slug }) => ({ city: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: slug } = await params;
  const location = getNorthCarolinaLocation(slug);
  if (!location) return {};

  const path = `/service-areas/north-carolina/${location.slug}`;
  return {
    title: `Metal Carports & Garages in ${location.city}, NC`,
    description: location.description,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title: `Metal Buildings in ${location.city}, NC | My Carport Guy`,
      description: location.description,
    },
  };
}

export default async function NorthCarolinaCityPage({ params }: PageProps) {
  const { city: slug } = await params;
  const location = getNorthCarolinaLocation(slug);
  if (!location) notFound();

  const path = `https://www.mycarportguy.com/service-areas/north-carolina/${location.slug}`;
  const faqs = [
    {
      question: `Are metal buildings available in ${location.city}, NC?`,
      answer: `Delivery and professional installation are available throughout the ${location.city} area for qualifying addresses and building designs. Send your ZIP code so we can confirm current availability.`,
    },
    {
      question: `Do I need a permit for a metal building in ${location.city}?`,
      answer: `Requirements vary by property, building size, and local jurisdiction. Check with the city or county office responsible for your installation address before scheduling delivery.`,
    },
    {
      question: "Does My Carport Guy have a local showroom?",
      answer: `My Carport Guy is an online dealer serving ${location.city} and nearby communities. We help by phone, text, and email; there is no public showroom or customer pickup location.`,
    },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `Metal carports and buildings in ${location.city}, North Carolina`,
        serviceType: "Metal carport and building sales",
        provider: { "@id": "https://www.mycarportguy.com/#organization" },
        areaServed: { "@type": "City", name: `${location.city}, North Carolina` },
        url: path,
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
          { "@type": "ListItem", position: 2, name: "North Carolina", item: "https://www.mycarportguy.com/service-areas/north-carolina" },
          { "@type": "ListItem", position: 3, name: location.city, item: path },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main id="main-content" className="local-area-page">
        <section className="local-area-hero">
          <div className="local-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/service-areas">Service areas</Link><span>/</span>
            <Link href="/service-areas/north-carolina">North Carolina</Link><span>/</span>
            <strong>{location.city}</strong>
          </div>
          <p className="eyebrow"><span />Serving {location.city}, North Carolina</p>
          <h1>Metal carports, garages, and buildings for {location.city}.</h1>
          <p>{location.intro}</p>
          <div className="local-area-actions">
            <Link className="button" href="/#quote">Check my ZIP code <span aria-hidden="true">→</span></Link>
            <a className="text-link" href="tel:+18284497158">Call (828) 449-7158</a>
          </div>
          <p className="local-online-note">Online dealer serving {location.region}. No public showroom or customer pickup location.</p>
        </section>

        <section className="local-area-intro">
          <div>
            <p className="eyebrow"><span />Plan around your property</p>
            <h2>A useful building starts with the right questions.</h2>
          </div>
          <p>{location.localNote}</p>
        </section>

        <section className="local-projects">
          <div className="local-section-heading">
            <p className="eyebrow"><span />Popular project ideas</p>
            <h2>Flexible space for vehicles, equipment, and everyday life.</h2>
          </div>
          <div className="local-project-grid">
            {location.projectIdeas.map((idea, index) => (
              <article key={idea.title}>
                <span>0{index + 1}</span>
                <h3>{idea.title}</h3>
                <p>{idea.description}</p>
              </article>
            ))}
          </div>
          <div className="local-building-links">
            <Link href="/products/carports">Carports</Link>
            <Link href="/products/garages">Garages</Link>
            <Link href="/products/rv-covers">RV covers</Link>
            <Link href="/products/barns-buildings">Barns &amp; buildings</Link>
          </div>
        </section>

        <section className="local-checklist">
          <div>
            <p className="eyebrow"><span />Before you order</p>
            <h2>Confirm the details that affect your installation.</h2>
          </div>
          <ol>
            <li><strong>Measure the site</strong><span>Allow room for the building, roof overhang, doors, access, and safe installation.</span></li>
            <li><strong>Check local requirements</strong><span>Ask your city or county about permits, setbacks, anchors, and engineering needs.</span></li>
            <li><strong>Prepare a level pad</strong><span>The site must be level, accessible, and clear of overhead and underground obstructions.</span></li>
            <li><strong>Confirm your ZIP code</strong><span>We’ll verify availability, current pricing, and estimated installation timing.</span></li>
          </ol>
        </section>

        <section className="local-nearby">
          <div>
            <p className="eyebrow"><span />Nearby communities</p>
            <h2>Helping customers throughout the {location.city} area.</h2>
          </div>
          <ul>{location.nearbyAreas.map((area) => <li key={area}>{area}</li>)}</ul>
        </section>

        <section className="local-faq">
          <div className="local-section-heading">
            <p className="eyebrow"><span />Local ordering questions</p>
            <h2>What to know before requesting a quote.</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="faq-cta local-area-cta">
          <div><strong>Ready to plan your {location.city} project?</strong><span>Send your ZIP code and building ideas for a free, no-pressure quote.</span></div>
          <div>
            <Link className="button" href="/buildings">Browse buildings</Link>
            <Link className="button button-dark" href="/#quote">Request a quote</Link>
          </div>
        </section>
      </main>
    </>
  );
}
