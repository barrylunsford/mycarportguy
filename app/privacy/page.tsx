import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How My Carport Guy handles information submitted through this website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="legal-main">
        <div className="legal-hero">
          <p className="eyebrow"><span />Your information</p>
          <h1>Privacy Policy</h1>
          <p>Last updated October 15, 2026</p>
        </div>
        <article className="legal-content">
          <p className="legal-note">
            This policy explains what information My Carport Guy collects through
            this website and how we use it to help with your building inquiry.
          </p>

          <h2>Information we collect</h2>
          <p>
            When you request a quote, we collect the information you provide,
            including your name, phone number, email address, ZIP code, structure
            type, and project details. Our hosting and email providers may also
            process basic technical information needed to operate and secure the
            website.
          </p>

          <h2>How we use information</h2>
          <ul>
            <li>Respond to your quote request and questions.</li>
            <li>Confirm service availability and discuss suitable building options.</li>
            <li>Prepare and support an order if you choose to move forward.</li>
            <li>Maintain, secure, and improve the website and inquiry process.</li>
          </ul>

          <h2>Website analytics</h2>
          <p>
            We use Vercel Web Analytics to understand aggregate website traffic
            and interactions, such as which pages are visited and when a quote
            request is completed. This analytics service does not use cookies or
            collect personal identifiers for this purpose.
          </p>

          <h2>How information is shared</h2>
          <p>
            We do not sell your personal information. We may share information
            with service providers that help operate the website and deliver
            email. If you proceed with a purchase, relevant project information
            may be shared with Eagle Carports and other providers involved in
            quoting, financing, scheduling, delivery, or installation.
          </p>

          <h2>Retention and security</h2>
          <p>
            We retain inquiry information for as long as reasonably needed to
            respond, provide service, maintain business records, and meet legal
            obligations. We use reasonable safeguards, but no internet service
            can guarantee absolute security.
          </p>

          <h2>Your choices</h2>
          <p>
            You may ask us to update or delete information you submitted, subject
            to any records we must keep for legitimate business or legal reasons.
            Contact us using the information below.
          </p>

          <h2>Children&apos;s privacy</h2>
          <p>
            This website is intended for adults seeking information about metal
            buildings and is not directed to children under 13.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy as our services or practices change. The
            date at the top shows the latest revision.
          </p>

          <h2>Contact us</h2>
          <p>
            Email <a href="mailto:barry@mycarportguy.com">barry@mycarportguy.com</a>
            {" "}or call <a href="tel:+18288391730">(828) 839-1730</a>.
          </p>
        </article>
      </main>
    </>
  );
}
