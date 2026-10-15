import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import ColorVisualizer from "@/components/ColorVisualizer";

export const metadata: Metadata = {
  title: "Metal Building Color Visualizer",
  description:
    "Use My Carport Guy's interactive visualizer to compare roof, trim, and wall colors for Eagle Carports metal buildings.",
  alternates: { canonical: "/colors" },
  openGraph: {
    url: "/colors",
    title: "Metal Building Color Visualizer | My Carport Guy",
    description:
      "Compare Eagle Carports color combinations with My Carport Guy and start planning your carport, garage, barn, or RV cover.",
  },
};

export default function ColorsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="colors-page">
        <section className="colors-hero">
          <div>
            <p className="eyebrow"><span />Make it yours</p>
            <h1>Choose colors that feel at home on your property.</h1>
            <p>
              Coordinate the roof, trim, and walls of your Eagle Carports
              building. Start with one of these popular combinations, then
              share your choices when you request a quote.
            </p>
            <a className="button" href="#color-visualizer">
              Try the color visualizer <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="colors-hero-palette" aria-hidden="true">
            <span style={{ background: "#244f3b" }} />
            <span style={{ background: "#f1f0e8" }} />
            <span style={{ background: "#87352e" }} />
            <span style={{ background: "#9b856a" }} />
            <span style={{ background: "#202224" }} />
            <span style={{ background: "#c7b698" }} />
            <div>
              <small>ROOF</small><strong>TRIM</strong><em>WALLS</em>
            </div>
          </div>
        </section>

        <ColorVisualizer />

        <section className="colors-guide">
          <div>
            <p className="eyebrow"><span />Before you decide</p>
            <h2>See the colors in context.</h2>
          </div>
          <ol>
            <li><span>1</span><div><strong>Compare combinations</strong><p>Choose a starting point for the roof, trim, and walls.</p></div></li>
            <li><span>2</span><div><strong>Design your building</strong><p>Use Eagle&apos;s 3D Builder to see colors on the structure you want.</p></div></li>
            <li><span>3</span><div><strong>Confirm before ordering</strong><p>Ask for current availability or a physical color sample when an exact match matters.</p></div></li>
          </ol>
        </section>

        <aside className="colors-note">
          <strong>Color note</strong>
          <p>
            On-screen colors are approximate and can vary by display. Two-tone
            matching may be an upgraded option. Final colors and availability
            should be confirmed before ordering.
          </p>
        </aside>

        <section className="colors-cta">
          <div><strong>Ready to build your combination?</strong><span>Browse structures or tell Barry what you have in mind.</span></div>
          <div>
            <Link href="/buildings" className="text-link">Browse buildings <span aria-hidden="true">→</span></Link>
            <Link href="/#quote" className="button">Request a quote <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </main>
    </>
  );
}
