import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Metal Building Payment Options",
  description: "Ask My Carport Guy about current payment and financing options for metal carports, garages, barns, RV covers, and other buildings.",
  alternates: { canonical: "/financing" },
};

export default function FinancingPage() {
  return (
    <><Header /><main id="main-content" className="financing-page">
      <section className="financing-hero">
        <div>
          <p className="eyebrow"><span />Plan with confidence</p>
          <h1>Clear payment information for your building.</h1>
          <p>Payment and financing choices can vary by building, manufacturer, location, and provider. We&apos;ll confirm the current options and written terms for your exact project before you make a decision.</p>
          <div className="financing-actions"><Link className="button" href="/#quote">Request a quote <span aria-hidden="true">→</span></Link><a className="text-link" href="tel:+18284497158">Call (828) 449-7158 <span aria-hidden="true">→</span></a></div>
        </div>
        <aside className="financing-hero-card">
          <span className="financing-card-label">What to expect</span><strong>Current terms, in writing</strong>
          <ul><li>A quote based on your building and ZIP code</li><li>Any required deposit shown before ordering</li><li>Available payment methods clearly explained</li><li>Financing details provided by the applicable lender</li></ul>
          <small>Availability and approval are determined by the applicable provider.</small>
        </aside>
      </section>
      <section className="financing-benefits">
        <div className="financing-section-heading"><p className="eyebrow"><span />No surprises</p><h2>Know the important numbers before you order.</h2></div>
        <div className="financing-benefit-grid">
          <article><span>01</span><h3>Building price</h3><p>Your quote reflects the selected size, style, colors, and options.</p></article>
          <article><span>02</span><h3>Deposit</h3><p>Any required deposit and remaining balance are shown in your order documents.</p></article>
          <article><span>03</span><h3>Site costs</h3><p>Permits, grading, concrete, utilities, and other site work are identified separately.</p></article>
          <article><span>04</span><h3>Available options</h3><p>We&apos;ll explain any current financing choices that apply to your project.</p></article>
        </div>
      </section>
      <section className="financing-steps">
        <div className="financing-section-heading"><p className="eyebrow"><span />How to get started</p><h2>Start with the building, then review the numbers.</h2></div>
        <ol><li><span>1</span><div><h3>Describe your project</h3><p>Tell us the size, style, features, colors, and location you have in mind.</p></div></li><li><span>2</span><div><h3>Get current pricing</h3><p>We&apos;ll confirm available products and prepare a quote for your ZIP code.</p></div></li><li><span>3</span><div><h3>Review payment choices</h3><p>Compare the applicable deposit, balance, and any financing options before ordering.</p></div></li></ol>
        <div className="financing-final-cta"><div><strong>Ready to price your project?</strong><span>Start with a free, no-pressure building quote.</span></div><Link href="/#quote" className="button">Request my quote <span aria-hidden="true">→</span></Link></div>
      </section>
      <p className="financing-disclaimer">Financing, if offered, is provided by third parties and not by My Carport Guy. Availability, approval, rates, fees, and terms are subject to the provider&apos;s current requirements. Review all written terms before signing.</p>
    </main></>
  );
}
