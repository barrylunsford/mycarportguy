import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Website Terms",
  description: "Terms for using the My Carport Guy website and requesting a quote.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="legal-main">
        <div className="legal-hero">
          <p className="eyebrow"><span />Please review</p>
          <h1>Website Terms</h1>
          <p>Last updated October 13, 2026</p>
        </div>
        <article className="legal-content">
          <p className="legal-note">
            These terms apply to your use of mycarportguy.com. Submitting a quote
            request does not obligate you to purchase anything.
          </p>

          <h2>Website information</h2>
          <p>
            The website provides general information about metal-building options
            and dealer services. We try to keep information accurate, but product
            availability, specifications, colors, prices, promotions, financing,
            service areas, and lead times may change.
          </p>

          <h2>Quotes and orders</h2>
          <p>
            Website inquiries and preliminary estimates are not binding offers or
            final sales agreements. A final order may require confirmation of the
            configuration, location, site conditions, taxes, permits, pricing,
            payment terms, and manufacturer requirements. The documents accepted
            when an order is placed control if they differ from this website.
          </p>

          <h2>Dealer and manufacturer roles</h2>
          <p>
            My Carport Guy is an independent dealer. Eagle Carports is a separate
            manufacturer and is responsible for the products, delivery, and
            installation it agrees to provide under its applicable order terms.
          </p>

          <h2>Site preparation and permits</h2>
          <p>
            Customers are responsible for confirming property boundaries,
            utilities, access, site preparation, zoning, permits, and other local
            requirements unless a written agreement expressly says otherwise.
            Installation timing depends on site readiness and applicable approvals.
          </p>

          <h2>Financing and third-party services</h2>
          <p>
            Financing, rent-to-own, 3D design tools, and linked websites are
            provided by third parties under their own terms and privacy policies.
            My Carport Guy does not control their approval decisions, availability,
            content, or performance.
          </p>

          <h2>Acceptable use</h2>
          <p>
            Do not misuse the website, attempt unauthorized access, interfere with
            its operation, submit unlawful content, or use automated tools to send
            spam or fraudulent inquiries.
          </p>

          <h2>Trademarks and content</h2>
          <p>
            My Carport Guy website content may not be copied or reused without
            permission. Eagle Carports names and marks belong to their respective
            owner and are used to identify the manufacturer and its products.
          </p>

          <h2>Disclaimer and limitation</h2>
          <p>
            The website is provided on an “as available” basis. To the extent
            permitted by law, My Carport Guy is not liable for indirect or
            consequential losses arising from use of the website or reliance on
            preliminary website information. Nothing here limits rights that
            cannot legally be limited.
          </p>

          <h2>Changes and contact</h2>
          <p>
            We may update these terms, with the revision date shown above. Questions
            may be sent to <a href="mailto:barry@mycarportguy.com">barry@mycarportguy.com</a>
            {" "}or <a href="tel:+18288391730">(828) 839-1730</a>.
          </p>
        </article>
      </main>
    </>
  );
}
