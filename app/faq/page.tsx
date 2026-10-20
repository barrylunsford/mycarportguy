import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Metal Building FAQs",
  description: "My Carport Guy answers common questions about carport ordering, deposits, permits, site preparation, installation, financing, and warranties.",
  alternates: { canonical: "/faq" },
  openGraph: {
    url: "/faq",
    title: "Metal Building FAQs | My Carport Guy",
    description: "Straightforward carport and metal-building ordering answers from My Carport Guy.",
  },
};

const faqs = [
  {
    question: "What does My Carport Guy do?",
    answer: "My Carport Guy is an independent online metal-building dealer. We help you compare building types, sizes, colors, options, and payment choices, then identify the available product and manufacturer that fit your project.",
  },
  {
    question: "How does the ordering process work?",
    answer: "We begin with your intended use, dimensions, location, colors, and options. After we confirm availability and you approve the written quote, the applicable manufacturer reviews the order, confirms site requirements, and provides delivery and installation details.",
  },
  {
    question: "Do I need a permit?",
    answer: "Permit and zoning requirements are determined locally and vary by address, building size, and intended use. The property owner is responsible for checking with the local building and zoning departments before the order is finalized. Ask early if engineered drawings, wind-load documentation, setbacks, or inspections may be required.",
  },
  {
    question: "How should I prepare the installation site?",
    answer: "The site generally must be cleared, accessible, and level before the crew arrives. Mark underground water, gas, electric, and other utility lines; 811 can help locate public utilities. Remove vehicles, debris, branches, and overhead obstructions, and follow the clearance requirements in your final order.",
  },
  {
    question: "What should I know about a concrete pad?",
    answer: "Foundation and footer requirements vary by building, manufacturer, and local code. Do not pour concrete from a preliminary estimate. Confirm the final frame dimensions, engineered requirements, and written foundation instructions first.",
  },
  {
    question: "Does the price include site preparation or concrete?",
    answer: "No. Site clearing, grading, concrete, retaining walls, utility work, permits, and similar preparation are generally the property owner's responsibility unless your written quote specifically says otherwise. An unprepared or inaccessible site may lead to additional labor or return-trip charges.",
  },
  {
    question: "How long does delivery take?",
    answer: "Lead times vary by manufacturer, location, order volume, weather, permitting, and site readiness. We will request the latest scheduling estimate for your ZIP code rather than promise a fixed date.",
  },
  {
    question: "How long does installation take?",
    answer: "Installation time depends on the building size and complexity, weather, access, and site conditions. The manufacturer or installer will provide the best estimate for your confirmed order.",
  },
  {
    question: "Is installation included?",
    answer: "Delivery and installation terms vary by product and manufacturer. Your written quote and order will identify what is included and any options, upgrades, travel charges, or site conditions that could add cost.",
  },
  {
    question: "When is payment due?",
    answer: "A down payment is collected when the order is placed. The remaining balance is generally due at installation. The exact deposit, accepted payment methods, financing terms, and final balance will be shown in your order documents and should be reviewed before signing.",
  },
  {
    question: "Are financing and rent-to-own available?",
    answer: "Options may be available depending on the product, manufacturer, provider, and state. We can share the current choices for your project, but any third-party provider makes the approval decision and controls the terms.",
  },
  {
    question: "What warranties are available?",
    answer: "Warranty coverage differs by building and manufacturer. We will provide the applicable written warranty before ordering; that warranty and your signed order control the coverage, maintenance requirements, and exclusions.",
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
            <p>Here&apos;s what to expect when choosing, ordering, preparing for, and installing a carport or metal building.</p>
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
          <div><strong>Still have a question?</strong><span>Tell us about your property and the building you have in mind.</span></div>
          <div>
            <a className="button" href="tel:+18284497158">Call (828) 449-7158</a>
            <Link className="button button-dark" href="/#quote">Request a quote</Link>
          </div>
        </section>
      </main>
    </>
  );
}
