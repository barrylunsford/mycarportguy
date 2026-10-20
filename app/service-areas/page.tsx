import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Metal Building Service Availability",
  description: "Send My Carport Guy your ZIP code to check current metal-building product, delivery, and installation availability.",
  alternates: { canonical: "/service-areas" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "My Carport Guy metal building availability check",
  serviceType: "Metal carport and building sales",
  provider: { "@id": "https://www.mycarportguy.com/#organization" },
  url: "https://www.mycarportguy.com/service-areas",
};

export default function ServiceAreasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Header />
      <main id="main-content" className="service-area-page">
        <section className="service-area-hero">
          <div>
            <p className="eyebrow"><span />Check your location</p>
            <h1>Find metal-building options for your ZIP code.</h1>
            <p>Availability, delivery, installation, engineering requirements, and lead times vary by product and manufacturer. Send your ZIP code and project details so we can confirm current options for your property.</p>
            <Link href="/#quote" className="button">Check my ZIP code <span aria-hidden="true">→</span></Link>
          </div>
          <div className="service-availability-card">
            <strong>We&apos;ll verify</strong>
            <ul><li>Building styles and sizes available near you</li><li>Current delivery and installation terms</li><li>Wind, snow, permit, and site requirements</li><li>Estimated lead time for the selected product</li></ul>
          </div>
        </section>

        <section className="service-area-guidance">
          <div><p className="eyebrow"><span />Before ordering</p><h2>Your ZIP code affects more than delivery.</h2><p>Local codes, weather-rating requirements, permitting, product availability, and installation lead times may differ by address.</p></div>
          <ul><li><strong>Availability</strong><span>Confirm the building and options offered in your area.</span></li><li><strong>Requirements</strong><span>Check local permits, setbacks, and engineering needs.</span></li><li><strong>Timing</strong><span>Get the current estimated installation window for your ZIP code.</span></li></ul>
        </section>

        <section className="faq-cta service-area-cta">
          <div><strong>Want us to check your property?</strong><span>Send your ZIP code and we&apos;ll research current availability.</span></div>
          <div><a className="button" href="tel:+18284497158">Call (828) 449-7158</a><Link className="button button-dark" href="/#quote">Check my ZIP code</Link></div>
        </section>
      </main>
    </>
  );
}
