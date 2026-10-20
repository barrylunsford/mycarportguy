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
          <p>Last updated October 17, 2026</p>
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
            We use Vercel Web Analytics and Google Analytics to understand how
            visitors use the website, including pages viewed, traffic sources,
            general device and browser information, and interactions such as a
            completed quote request, phone call, or email link. Vercel Web
            Analytics provides aggregate, cookie-free measurements. Google
            Analytics may set first-party cookies, including cookies named
            <code> _ga</code> and <code> _ga_&lt;container-id&gt;</code>, to
            distinguish visits and sessions.
          </p>
          <p>
            Google processes analytics information under its own privacy terms.
            You can learn more in the{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
              Google Privacy Policy
            </a>
            . You can also limit analytics by blocking or deleting cookies in
            your browser or by using Google&apos;s{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">
              Analytics opt-out browser add-on
            </a>
            . Blocking analytics does not prevent you from using this website.
          </p>

          <h2>How information is shared</h2>
          <p>
            We do not sell your personal information. We may share information
            with service providers that help operate the website and deliver
            email. If you proceed with a purchase, relevant project information
            may be shared with manufacturers and other providers involved in
            quoting, financing, scheduling, delivery, or installation.
          </p>

          <h2>Retention and security</h2>
          <p>
            We retain inquiry information for as long as reasonably needed to
            respond, provide service, maintain business records, and meet legal
            obligations. Analytics information is retained according to our
            provider and account settings. We use reasonable safeguards, but no
            internet service can guarantee absolute security.
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
            Email <a href="mailto:sales@mycarportguy.com">sales@mycarportguy.com</a>
            {" "}or call <a href="tel:+18284497158">(828) 449-7158</a>.
          </p>
        </article>
      </main>
    </>
  );
}
