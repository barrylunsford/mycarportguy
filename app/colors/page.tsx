import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Metal Building Colors & Popular Combinations",
  description:
    "Explore popular Eagle Carports roof, trim, and wall color combinations, then use the official color picker to plan your metal building.",
  alternates: { canonical: "/colors" },
  openGraph: {
    url: "/colors",
    title: "Metal Building Colors & Popular Combinations",
    description:
      "Compare popular Eagle Carports color combinations and start planning your carport, garage, barn, or RV cover.",
  },
};

const colorCombinations = [
  { name: "Evergreen & Clay", primary: "#244f3b", secondary: "#a28d70" },
  { name: "Evergreen & White", primary: "#244f3b", secondary: "#f3f2eb" },
  { name: "Black & White", primary: "#202224", secondary: "#f3f2eb" },
  { name: "Black & Gray", primary: "#202224", secondary: "#858a8b" },
  { name: "Red & White", primary: "#a92e2b", secondary: "#f3f2eb" },
  { name: "Red & Rawhide", primary: "#8f3028", secondary: "#d0b58d" },
  { name: "Gray & White", primary: "#6f7779", secondary: "#f3f2eb" },
  { name: "Brown & Beige", primary: "#5a4031", secondary: "#d6c4a5" },
];

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
            <a className="button" href="#popular-colors">
              Browse color combinations <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="colors-building" aria-hidden="true">
            <div className="colors-building-roof" />
            <div className="colors-building-wall"><span /></div>
          </div>
        </section>

        <section className="colors-section" id="popular-colors">
          <div className="colors-heading">
            <p className="eyebrow"><span />Popular combinations</p>
            <h2>A good place to start.</h2>
            <p>
              These combinations are featured by Eagle Carports. The first
              color is commonly used for the roof and trim, with the second as
              the coordinating wall color.
            </p>
          </div>
          <div className="color-combo-grid">
            {colorCombinations.map((combo) => (
              <article className="color-combo-card" key={combo.name}>
                <div className="color-combo-swatch" aria-hidden="true">
                  <span style={{ backgroundColor: combo.primary }} />
                  <span style={{ backgroundColor: combo.secondary }} />
                </div>
                <h3>{combo.name}</h3>
              </article>
            ))}
          </div>
        </section>

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
