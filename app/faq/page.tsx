import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Metal Building FAQs",
  description: "Answers about Eagle Carports ordering, deposits, permits, site preparation, delivery, installation, financing, and warranties from My Carport Guy.",
  alternates: { canonical: "/faq" },
  openGraph: {
    url: "/faq",
    title: "Metal Building FAQs | My Carport Guy",
    description: "Straightforward answers about ordering and installing an Eagle Carports metal building.",
  },
};

const faqs = [
  {
    question: "What does My Carport Guy do?",
    answer: "My Carport Guy is an independent Eagle Carports dealer. Barry helps you compare building types, sizes, colors, options, and payment choices, then assists with preparing and submitting the order. Eagle Carports manufactures the building and coordinates delivery and installation.",
  },
  {
    question: "How does the ordering process work?",
    answer: "We begin with your intended use, dimensions, location, colors, and options. After you approve the building and place the required down payment, the order is submitted to Eagle Carports for review. Eagle then confirms the order, discusses site requirements, schedules the route, manufactures the components, and sends an installation crew.",
  },
  {
    question: "Do I need a permit?",
    answer: "Permit and zoning requirements are determined locally and vary by address, building size, and intended use. The property owner is responsible for checking with the local building and zoning departments before the order is finalized. Ask early if engineered drawings, wind-load documentation, setbacks, or inspections may be required.",
  },
  {
    question: "How should I prepare the installation site?",
    answer: "The site must be cleared, accessible, and level before the crew arrives. Mark underground water, gas, electric, and other utility lines; 811 can help locate public utilities. Remove vehicles, debris, branches, and overhead obstructions, and allow working room around the building. Eagle currently requests at least 36 inches of clearance around enclosed structures.",
  },
  {
    question: "What should I know about a concrete pad?",
    answer: "Eagle's current guidance says a concrete pad should extend at least two inches beyond the frame on every side. For example, a 20-by-30-foot frame would need a 20-foot-4-inch by 30-foot-4-inch pad. Foundation and footer requirements can vary by building and local code, so confirm the final dimensions before concrete is poured.",
  },
  {
    question: "Does the price include site preparation or concrete?",
    answer: "No. Site clearing, grading, concrete, retaining walls, utility work, permits, and similar preparation are generally the property owner's responsibility unless your written quote specifically says otherwise. An unprepared or inaccessible site may lead to additional labor or return-trip charges.",
  },
  {
    question: "How long does delivery take?",
    answer: "Lead times vary by state, manufacturing facility, order volume, weather, permitting, and site readiness. The estimate begins once the order is complete and the site is ready. We will check the latest Eagle scheduling information for your ZIP code rather than promise a fixed date.",
  },
  {
    question: "How long does installation take?",
    answer: "Eagle says installation can range from about an hour for a small structure to as long as two days for a larger or more complex building. Weather, access, site conditions, and the final configuration can affect the schedule.",
  },
  {
    question: "Is installation included?",
    answer: "Standard delivery and installation are included with many Eagle buildings on a properly prepared, level, and accessible site, subject to the terms and restrictions in the final order. Your quote will identify any options, upgrades, or site conditions that could add cost.",
  },
  {
    question: "When is payment due?",
    answer: "A down payment is collected when the order is placed. The remaining balance is generally due at installation. The exact deposit, accepted payment methods, financing terms, and final balance will be shown in your order documents and should be reviewed before signing.",
  },
  {
    question: "Are financing and rent-to-own available?",
    answer: "Yes. Eagle offers traditional financing and rent-to-own programs in addition to payment on delivery. Approval, terms, limits, and state availability vary. We can help you compare the options, but the finance or rent-to-own provider makes the approval decision.",
  },
  {
    question: "What warranties are available?",
    answer: "Eagle currently lists a 90-day workmanship warranty and a 20-year limited warranty on qualifying painted sheet-metal panels, subject to maintenance requirements, roof style, building length, alterations, and other exclusions. Warranty coverage can differ by building, so the written warranty and signed order control.",
  },
  {
    question: "Can I customize the building?",
    answer: "Yes. Available choices may include width, length, height, roof style, colors, garage doors, walk-in doors, windows, gauges, anchors, panels, and other options. Availability and pricing depend on the building and delivery area.",
  },
  {
    question: "Are the colors on the website exact?",
    answer: "No. Screen settings and lighting can change how colors appear. Use the online visualizer for comparison, then confirm current availability and request a physical sample when an exact match is important.",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main id="main-content" className="faq-main">
        <section className="faq-hero">
          <div>
            <p className="eyebrow"><span />Straight answers</p>
            <h1>Questions before you build?</h1>
            <p>Here&apos;s what to expect when choosing, ordering, preparing for, and installing an Eagle Carports metal building.</p>
          </div>
          <Link className="button" href="/#quote">Ask about your project <span aria-hidden="true">→</span></Link>
        </section>

        <section className="faq-content" aria-label="Frequently asked questions">
          <div className="faq-intro">
            <p className="eyebrow"><span />Good to know</p>
            <h2>Plan with confidence.</h2>
            <p>Open any question below. Final pricing, specifications, scheduling, and warranty coverage are confirmed in your written order.</p>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="faq-cta">
          <div><strong>Still have a question?</strong><span>Tell Barry about your property and the building you have in mind.</span></div>
          <div>
            <a className="button" href="tel:+18288391730">Call (828) 839-1730</a>
            <Link className="button button-dark" href="/#quote">Request a quote</Link>
          </div>
        </section>
      </main>
    </>
  );
}
