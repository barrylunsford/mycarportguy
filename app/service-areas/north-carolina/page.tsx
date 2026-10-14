import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Metal Carports & Garages in North Carolina",
  description:
    "Shop Eagle Carports metal carports, garages, barns, and RV covers in North Carolina with friendly dealer guidance, delivery, and professional installation.",
  alternates: { canonical: "/service-areas/north-carolina" },
  openGraph: {
    url: "/service-areas/north-carolina",
    title: "Metal Carports & Garages in North Carolina",
    description:
      "Get help choosing and ordering an Eagle Carports metal building for your North Carolina property.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Eagle Carports metal buildings in North Carolina",
  serviceType: "Metal carport and building sales",
  provider: { "@id": "https://www.mycarportguy.com/#organization" },
  areaServed: {
    "@type": "State",
    name: "North Carolina",
  },
  url: "https://www.mycarportguy.com/service-areas/north-carolina",
};

export default function NorthCarolinaServiceAreaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main id="main-content" className="financing-page">
        <section className="catalog-hero">
          <p className="eyebrow"><span />Serving North Carolina</p>
          <h1>Metal carports and buildings made for North Carolina properties.</h1>
          <p>
            My Carport Guy helps North Carolina customers compare, customize,
            and order Eagle Carports structures. Eagle Carports handles delivery
            and professional installation at your prepared site.
          </p>
        </section>

        <section className="financing-benefits">
          <div className="financing-section-heading">
            <p className="eyebrow"><span />Choose the right structure</p>
            <h2>Protection and storage built around your plans.</h2>
          </div>
          <div className="financing-benefit-grid">
            <article><span>01</span><h3>Carports</h3><p>Everyday coverage for cars, trucks, boats, and equipment.</p></article>
            <article><span>02</span><h3>Garages</h3><p>Enclosed space for vehicles, tools, workshops, and storage.</p></article>
            <article><span>03</span><h3>RV covers</h3><p>Taller, wider protection designed for campers and recreational vehicles.</p></article>
            <article><span>04</span><h3>Barns</h3><p>Flexible layouts for farm equipment, storage, animals, and work space.</p></article>
          </div>
        </section>

        <section className="financing-details">
          <div>
            <p className="eyebrow"><span />Local project guidance</p>
            <h2>Start with your ZIP code and what you need to protect.</h2>
            <p>
              Building availability, engineering requirements, permitting, and
              installation timing can vary by location. We&apos;ll help you confirm
              the right options for your North Carolina property before you order.
            </p>
            <ul className="financing-checklist">
              <li>Compare roof styles, sizes, colors, and enclosure options.</li>
              <li>Confirm current pricing and availability for your ZIP code.</li>
              <li>Review site preparation and installation requirements.</li>
              <li>Get personal help without a high-pressure sales process.</li>
            </ul>
          </div>
          <aside>
            <span>Talk with Barry</span>
            <h3>Get straightforward help choosing your building.</h3>
            <p>Tell us what you want to cover, your preferred size, and where the building will be installed.</p>
            <a href="tel:+18288391730">Call (828) 839-1730</a>
            <a href="mailto:barry@mycarportguy.com">barry@mycarportguy.com</a>
          </aside>
        </section>

        <section className="financing-steps">
          <div className="financing-section-heading">
            <p className="eyebrow"><span />Ready to get started?</p>
            <h2>Find a building, then request current pricing.</h2>
          </div>
          <div className="financing-final-cta">
            <div><strong>See available metal buildings</strong><span>Filter by type, roof style, size, and vehicle capacity.</span></div>
            <Link href="/buildings" className="button">Browse buildings <span aria-hidden="true">→</span></Link>
          </div>
          <div className="financing-final-cta">
            <div><strong>Have a project in mind?</strong><span>Share the details for a free, no-pressure quote.</span></div>
            <Link href="/#quote" className="button">Request my quote <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </main>
    </>
  );
}
