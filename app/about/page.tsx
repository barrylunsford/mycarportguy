import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "About",
  description: "Learn how My Carport Guy provides straightforward, personal help choosing and ordering carports and metal buildings.",
  alternates: { canonical: "/about" },
  openGraph: {
    url: "/about",
    title: "About My Carport Guy",
    description: "Personal dealer guidance for carports, garages, barns, RV covers, and custom metal buildings.",
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="about-page">
        <section className="about-hero">
          <div>
            <p className="eyebrow"><span />Meet your dealer</p>
            <h1>A real person helping you make a confident choice.</h1>
            <p>
              My Carport Guy is an online metal-building dealership based in
              Rhodhiss, North Carolina. We provide personal guidance from
              the first question through a carefully prepared order.
            </p>
            <div className="about-actions">
              <Link href="/#quote" className="button">Tell us about your project <span aria-hidden="true">→</span></Link>
              <a href="tel:+18284497158" className="text-link">Call (828) 449-7158</a>
            </div>
          </div>
          <aside className="about-card">
            <span>MY CARPORT GUY LLC</span>
            <strong>Friendly guidance.<br />Clear choices.<br />No sales pressure.</strong>
            <p>Online service for customers throughout our 21-state delivery and installation region.</p>
          </aside>
        </section>

        <section className="about-story">
          <div>
            <p className="eyebrow"><span />Why My Carport Guy</p>
            <h2>A simpler way to buy a metal building.</h2>
          </div>
          <div className="about-story-copy">
            <p>
              A carport or metal building is a significant purchase. You should
              understand what you&apos;re ordering, what it will cost, and what your
              property needs before you commit.
            </p>
            <p>
              We help customers compare building types, dimensions, roof
              styles, colors, doors, windows, financing options, site requirements,
              and current lead times without turning the conversation into a
              high-pressure sales pitch.
            </p>
            <p>
              My Carport Guy is an independent online metal-building dealer. We
              help you compare available structures, choose the right configuration,
              and understand the manufacturer&apos;s written terms before you order.
            </p>
          </div>
        </section>

        <section className="about-values">
          <article><span>01</span><h3>Listen first</h3><p>Your property, priorities, and budget guide the recommendation.</p></article>
          <article><span>02</span><h3>Explain clearly</h3><p>Understand the options, preparation, timing, and next steps before ordering.</p></article>
          <article><span>03</span><h3>Stay accessible</h3><p>Call, text, or email us when you need help with your project.</p></article>
        </section>

        <section className="about-contact">
          <div>
            <p className="eyebrow light-eyebrow"><span />Let&apos;s get started</p>
            <h2>What do you need to protect?</h2>
            <p>Share your ZIP code, approximate size, and how you plan to use the building.</p>
          </div>
          <div>
            <Link href="/buildings" className="button button-light">Browse buildings</Link>
            <Link href="/#quote" className="button">Request a quote</Link>
          </div>
        </section>
      </main>
    </>
  );
}
