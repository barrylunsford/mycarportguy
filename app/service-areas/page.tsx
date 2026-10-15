import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Metal Building Service Area",
  description: "Check My Carport Guy's 21-state service area for Eagle Carports metal building delivery and installation, then confirm availability for your ZIP code.",
  alternates: { canonical: "/service-areas" },
  openGraph: {
    url: "/service-areas",
    title: "My Carport Guy Metal Building Service Area",
    description: "My Carport Guy provides friendly Eagle Carports dealer guidance with metal building delivery and installation across 21 states.",
  },
};

const states = [
  "Alabama", "Arkansas", "Colorado", "Florida", "Georgia", "Illinois",
  "Indiana", "Kansas", "Kentucky", "Louisiana", "Mississippi", "Missouri",
  "New Mexico", "North Carolina", "Ohio", "Oklahoma", "South Carolina",
  "Tennessee", "Texas", "Virginia", "West Virginia",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "My Carport Guy metal building service area",
  serviceType: "Metal carport and building sales",
  provider: { "@id": "https://www.mycarportguy.com/#organization" },
  areaServed: states.map((name) => ({ "@type": "State", name })),
  url: "https://www.mycarportguy.com/service-areas",
};

export default function ServiceAreasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main id="main-content" className="service-area-page">
        <section className="service-area-hero">
          <div>
            <p className="eyebrow"><span />21-state service area</p>
            <h1>Building coverage from the Rockies to the East Coast.</h1>
            <p>
              My Carport Guy helps customers throughout Eagle Carports&apos; service
              region choose and order metal carports, garages, barns, RV covers,
              and commercial buildings.
            </p>
            <Link href="/#quote" className="button">Check my ZIP code <span aria-hidden="true">→</span></Link>
          </div>
          <div className="service-map service-area-map">
            <Image
              src="/service-area-map-brand.png"
              alt="Eagle Carports service area covering 21 states from Colorado and New Mexico through the Midwest, South, and East Coast"
              width={1429}
              height={1101}
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
            />
          </div>
        </section>

        <section className="service-state-section">
          <div className="service-state-heading">
            <p className="eyebrow"><span />Where we serve</p>
            <h2>Delivery and installation across 21 states.</h2>
            <p>Coverage can vary by ZIP code, building specifications, and the nearest manufacturing location. We&apos;ll confirm your address before you order.</p>
          </div>
          <ul className="service-state-grid">
            {states.map((state) => (
              <li key={state}>{state}</li>
            ))}
          </ul>
        </section>

        <section className="service-area-guidance">
          <div>
            <p className="eyebrow"><span />Before ordering</p>
            <h2>Your ZIP code affects more than delivery.</h2>
            <p>Local codes, wind and snow requirements, permitting, product availability, and installation lead times may differ by location.</p>
          </div>
          <ul>
            <li><strong>Availability</strong><span>Confirm the building and options offered in your area.</span></li>
            <li><strong>Requirements</strong><span>Check local permits, setbacks, and engineering needs.</span></li>
            <li><strong>Timing</strong><span>Get the current estimated installation window for your ZIP code.</span></li>
          </ul>
        </section>

        <section className="faq-cta service-area-cta">
          <div><strong>Is your property in the service area?</strong><span>Send your ZIP code and we&apos;ll confirm coverage and current timing.</span></div>
          <div>
            <a className="button" href="tel:+18288391730">Call (828) 839-1730</a>
            <Link className="button button-dark" href="/#quote">Check my ZIP code</Link>
          </div>
        </section>
      </main>
    </>
  );
}
