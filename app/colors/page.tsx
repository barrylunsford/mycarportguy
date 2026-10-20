import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Metal Building Colors",
  description: "Explore popular metal-building color families and request current roof, trim, and wall color options from My Carport Guy.",
  alternates: { canonical: "/colors" },
};

const colors = [
  ["Evergreen", "#244f3b"], ["Bright White", "#f1f0e8"], ["Barn Red", "#87352e"],
  ["Clay", "#9b856a"], ["Black", "#202224"], ["Tan", "#c7b698"],
  ["Pewter Gray", "#7c8588"], ["Gallery Blue", "#315c74"],
];

export default function ColorsPage() {
  return (
    <><Header /><main id="main-content" className="colors-page">
      <section className="colors-hero">
        <div><p className="eyebrow"><span />Make it yours</p><h1>Choose colors that feel at home on your property.</h1><p>Explore popular color families for the roof, trim, and walls. Available names and finishes vary by manufacturer, so we&apos;ll confirm the current palette for your selected building.</p><Link className="button" href="/#quote">Request current colors <span aria-hidden="true">→</span></Link></div>
        <div className="colors-hero-palette" aria-hidden="true">{colors.slice(0, 6).map(([name, hex]) => <span key={name} style={{ background: hex }} />)}<div><small>ROOF</small><strong>TRIM</strong><em>WALLS</em></div></div>
      </section>
      <section className="colors-guide" id="color-options">
        <div><p className="eyebrow"><span />Popular color families</p><h2>Find a direction you like.</h2><p>These swatches are planning references. Your final quote will show the colors available for your building.</p></div>
        <div className="color-swatch-grid">{colors.map(([name, hex]) => <div className="color-swatch" key={name}><span style={{ background: hex }} aria-hidden="true" /><strong>{name}</strong></div>)}</div>
      </section>
      <aside className="colors-note"><strong>Color note</strong><p>On-screen colors are approximate and can vary by display. Final colors, finishes, and availability should be confirmed before ordering. Ask for a physical sample when an exact match matters.</p></aside>
      <section className="colors-cta"><div><strong>Ready to choose your building?</strong><span>Browse structures or tell us what you have in mind.</span></div><div><Link href="/buildings" className="text-link">Browse buildings <span aria-hidden="true">→</span></Link><Link href="/#quote" className="button">Request a quote <span aria-hidden="true">→</span></Link></div></section>
    </main></>
  );
}
