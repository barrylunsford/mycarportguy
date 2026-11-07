import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Metal Building Financing & Rent-to-Own",
  description: "Explore financing and rent-to-own options with My Carport Guy, including Upgrade, GreenSky, RTO National, and Heartland. Request terms for your building.",
  alternates: { canonical: "/financing" },
};

export default function FinancingPage() {
  return (
    <><Header /><main id="main-content" className="financing-page">
      <section className="financing-hero">
        <div>
          <p className="eyebrow"><span />Plan with confidence</p>
          <h1>Explore ways to pay for your new building.</h1>
          <p>Compare financing and rent-to-own programs for your metal building. Start with a project quote, then we&apos;ll help you confirm which provider options apply to your building, location, and budget.</p>
          <div className="financing-actions"><Link className="button" href="/#quote">Request a quote <span aria-hidden="true">→</span></Link><a className="text-link" href="tel:+18284497158">Call (828) 449-7158 <span aria-hidden="true">→</span></a></div>
        </div>
        <aside className="financing-hero-card">
          <span className="financing-card-label">What to expect</span><strong>Current terms, in writing</strong>
          <ul><li>A quote based on your building and ZIP code</li><li>Any required deposit shown before ordering</li><li>Available payment methods clearly explained</li><li>Financing details provided by the applicable lender</li></ul>
          <small>Availability and approval are determined by the applicable provider.</small>
        </aside>
      </section>
      <section className="financing-benefits" aria-labelledby="payment-programs-heading">
        <div className="financing-section-heading"><p className="eyebrow"><span />Explore the options</p><h2 id="payment-programs-heading">Four programs to ask about.</h2><p>Program overview reviewed November 7, 2026. Availability and final terms must be confirmed for your project before applying.</p></div>
        <div className="financing-benefit-grid">
          <article><span>PERSONAL FINANCING</span><h3>Upgrade</h3><p>A financing option to discuss when planning your building purchase. Request the current rate, repayment term, fees, and eligibility requirements for your application.</p><Link className="text-link" href="/#quote">Ask about Upgrade →</Link></article>
          <article><span>LENDER FINANCING</span><h3>GreenSky</h3><p>GreenSky services loans provided by participating program lenders. Those lenders determine credit decisions and loan terms. Ask which plans are available for your project.</p><Link className="text-link" href="/#quote">Ask about GreenSky →</Link></article>
          <article><span>FINANCE &amp; LEASE PURCHASE</span><h3>RTO National</h3><p>Published program information lists building amounts from $1,200 to $20,000 and terms from 24 to 72 months. Homeownership and installation timing requirements apply; ask us to confirm eligibility.</p><Link className="text-link" href="/#quote">Ask about RTO National →</Link></article>
          <article><span>RENT-TO-OWN</span><h3>Heartland</h3><p>Published program information lists building prices from $1,200 to $25,000 before tax, with 24-, 36-, 48-, or 72-month options. Ask about upfront costs, property documentation, and early purchase terms.</p><Link className="text-link" href="/#quote">Ask about Heartland →</Link></article>
        </div>
      </section>
      <section className="financing-details" aria-labelledby="financing-compare-heading">
        <div><p className="eyebrow"><span />Before you apply</p><h2 id="financing-compare-heading">Compare the full cost, not just the monthly payment.</h2><p>Financing and rent-to-own use different agreements. Review when ownership transfers, the total amount you would pay, and what happens if you pay early or miss a payment.</p><ul className="financing-checklist"><li>Confirm the building price, taxes, and any costs outside the program.</li><li>Request the APR where applicable, fees, payment schedule, and total cost in writing.</li><li>Check credit, income, homeownership, and installation requirements for the selected provider.</li><li>Confirm what is due upfront and when delivery scheduling can begin.</li></ul></div>
        <aside><span>Plan ahead</span><h3>Rent-to-own needs its own cost review.</h3><p>Heartland&apos;s published requirements include a security deposit, origination fee, and first month&apos;s rent upfront, plus identification and references. Property ownership or landlord documentation may be required.</p><p>Ask which site costs and anchors must be paid separately. Final eligibility and costs come from your agreement.</p><a href="tel:+18284497158">Talk through your options →</a></aside>
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
      <p className="financing-disclaimer">Financing, if offered, is provided by third parties and not by My Carport Guy. Program summaries are informational and are not an offer of credit or a guarantee of approval. Availability, approval, rates, fees, amounts, and terms are subject to the provider&apos;s current requirements. Review all written terms before signing.</p>
    </main></>
  );
}
