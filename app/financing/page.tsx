import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import RentToOwnEstimator from "@/components/RentToOwnEstimator";

export const metadata: Metadata = {
  title: "Rent-to-Own Metal Buildings",
  description:
    "Explore Eagle Carports rent-to-own options for eligible metal buildings with help from your local My Carport Guy dealer.",
  alternates: { canonical: "/financing" },
};

export default function FinancingPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="financing-page">
        <section className="financing-hero">
          <div>
            <p className="eyebrow"><span />Flexible path to ownership</p>
            <h1>Get the building you need with rent-to-own.</h1>
            <p>
              Eagle Carports offers a no-credit-check rent-to-own option on
              qualifying metal buildings. We&apos;ll help you choose a building,
              confirm eligibility, and understand the next steps before you commit.
            </p>
            <div className="financing-actions">
              <a className="button" href="#payment-estimator">
                Estimate a payment <span aria-hidden="true">↓</span>
              </a>
              <Link className="text-link" href="/#quote">
                Ask Barry about rent-to-own <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <aside className="financing-hero-card">
            <span className="financing-card-label">Program highlights</span>
            <strong>No credit check</strong>
            <ul>
              <li>Starting at $3,000</li>
              <li>Terms of 24, 36, 48, or 60 months</li>
              <li>Up to $25,000 through the program</li>
              <li>Monthly or bi-weekly payment options</li>
              <li>No penalty for early purchase</li>
            </ul>
            <small>Eligibility and final terms are determined by Eagle Carports and Heartland.</small>
          </aside>
        </section>

        <RentToOwnEstimator />

        <section className="financing-benefits">
          <div className="financing-section-heading">
            <p className="eyebrow"><span />Straightforward options</p>
            <h2>A practical choice when traditional financing is not the right fit.</h2>
          </div>
          <div className="financing-benefit-grid">
            <article><span>01</span><h3>No credit check</h3><p>Qualification does not depend on a traditional credit inquiry.</p></article>
            <article><span>02</span><h3>Flexible terms</h3><p>Available term lengths let you compare payment schedules for your budget.</p></article>
            <article><span>03</span><h3>Early purchase</h3><p>You can purchase the building early without an early-purchase penalty.</p></article>
            <article><span>04</span><h3>Local help</h3><p>My Carport Guy helps coordinate the building selection and order details.</p></article>
          </div>
        </section>

        <section className="financing-details">
          <div>
            <p className="eyebrow"><span />Before you apply</p>
            <h2>What qualifies?</h2>
            <p>
              The building must be certified and cannot be used as occupied living
              space. Rent-to-own is not available for barndominiums, tiny houses,
              container homes, or other lived-in outbuildings.
            </p>
            <ul className="financing-checklist">
              <li>Customers may own or rent the installation property.</li>
              <li>Renters must submit a landlord waiver.</li>
              <li>Orders of $10,000 or more may require proof of property ownership.</li>
              <li>At least a 10% security deposit is required.</li>
              <li>Some terms may include a non-refundable origination fee.</li>
            </ul>
          </div>
          <aside>
            <span>Good to know</span>
            <h3>Final pricing comes after the building is configured.</h3>
            <p>
              Taxes, installation-related labor, optional loss-damage coverage,
              deposits, and program fees can affect the amount due. We&apos;ll help
              you get a current estimate for your exact structure and location.
            </p>
            <a href="tel:+18288391730">Call (828) 839-1730</a>
            <a href="mailto:barry@mycarportguy.com">barry@mycarportguy.com</a>
          </aside>
        </section>

        <section className="financing-steps">
          <div className="financing-section-heading">
            <p className="eyebrow"><span />How to get started</p>
            <h2>From building idea to payment estimate.</h2>
          </div>
          <ol>
            <li><span>1</span><div><h3>Choose your building</h3><p>Browse the catalog or tell us the size, style, and features you need.</p></div></li>
            <li><span>2</span><div><h3>Get current pricing</h3><p>We&apos;ll prepare the building details and confirm availability for your ZIP code.</p></div></li>
            <li><span>3</span><div><h3>Review rent-to-own</h3><p>Use Eagle&apos;s estimator and review the current qualification requirements and documents.</p></div></li>
          </ol>
          <div className="financing-final-cta">
            <div><strong>Ready to compare your options?</strong><span>Start with a free, no-pressure building quote.</span></div>
            <Link href="/#quote" className="button">Request my quote <span aria-hidden="true">→</span></Link>
          </div>
        </section>

        <p className="financing-disclaimer">
          Rent-to-own is provided by Eagle Carports and Heartland Capital Investments,
          not My Carport Guy. Program availability, approval, pricing, rates, fees, and
          terms are subject to change. Confirm current terms before ordering.
        </p>
      </main>
    </>
  );
}
