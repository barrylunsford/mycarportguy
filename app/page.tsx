import type { Metadata } from "next";
import Header from "@/components/Header";
import QuoteForm from "@/components/QuoteForm";
import Image from "next/image";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "My Carport Guy | Carports, Garages, Barns & RV Covers" },
  description: "Shop Eagle Carports metal carports, garages, barns, RV covers, and custom steel buildings with friendly dealer guidance, delivery, and installation across 21 states.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: "My Carport Guy | Carports, Garages, Barns & RV Covers",
    description: "Friendly dealer help choosing, customizing, and ordering an Eagle Carports metal building.",
  },
};

const benefits = [
  "Local dealer guidance",
  "Made-to-fit designs",
  "Eagle steel construction",
  "Delivery & installation",
];

const serviceStates = [
  "Alabama",
  "Arkansas",
  "Colorado",
  "Florida",
  "Georgia",
  "Illinois",
  "Indiana",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Mississippi",
  "Missouri",
  "New Mexico",
  "North Carolina",
  "Ohio",
  "Oklahoma",
  "South Carolina",
  "Tennessee",
  "Texas",
  "Virginia",
  "West Virginia",
];

export default async function Home() {
  const structures = (await getProducts()).filter((product) => product.featured);

  return (
    <>
      <Header />

      <main id="main-content">
        <section className="hero">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />
          <div className="hero-content">
            <p className="eyebrow light-eyebrow">
              <span />
              Your local Eagle Carports dealer
            </p>
            <h1>
              More than a building.
              <br />
              <em>Room for what matters.</em>
            </h1>
            <p className="hero-copy">
              From daily drivers to weekend adventures, we&apos;ll help you
              choose and customize an Eagle Carports structure that fits your
              life, your land, and your budget.
            </p>
            <div className="hero-actions">
              <a href="#quote" className="button button-light">
                Start your free quote <span aria-hidden="true">→</span>
              </a>
              <a href="#structures" className="text-link text-link-light">
                Explore our structures <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero-trust">
              <div className="avatar-stack" aria-hidden="true">
                <span>JD</span>
                <span>AM</span>
                <span>RK</span>
              </div>
              <div>
                <div className="stars" aria-label="Five out of five stars">
                  Local help, trusted manufacturer
                </div>
                <p>Personal guidance from selection through ordering</p>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="sun-disc" />
            <div className="land land-back" />
            <div className="land land-front" />
            <div className="building">
              <div className="building-roof" />
              <div className="building-side" />
              <div className="building-front">
                <div className="garage-door">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="building-shadow" />
            </div>
            <p className="visual-caption">Designed around your property</p>
          </div>
        </section>

        <section className="trust-strip" aria-label="Our service commitments">
          {benefits.map((benefit) => (
            <div key={benefit}>
              <span aria-hidden="true">✓</span>
              {benefit}
            </div>
          ))}
        </section>

        <section className="eagle-partner" aria-label="Eagle Carports dealer information">
          <div>
            <span className="eagle-wordmark">EAGLE CARPORTS</span>
            <p>
              My Carport Guy is your local dealer. Eagle Carports manufactures,
              delivers, and installs your selected metal structure.
            </p>
          </div>
          <a href="/colors" className="text-link">
            Explore building colors <span aria-hidden="true">→</span>
          </a>
        </section>

        <section className="section structures-section" id="structures">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">
                <span />
                Find your structure
              </p>
              <h2>Whatever you&apos;re protecting, we have you covered.</h2>
            </div>
            <p>
              Every property is different. We&apos;ll help you find the right
              Eagle Carports style, size, and options—without making it
              complicated.
            </p>
          </div>

          <div className="structure-grid">
            {structures.map((structure, index) => (
              <article
                className={`structure-card structure-${index % 4}`}
                key={structure.id}
              >
                <div className="card-art">
                  <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="mini-building">
                    <span />
                  </div>
                </div>
                <div className="card-body">
                  <h3>{structure.name}</h3>
                  <p>{structure.summary}</p>
                  <a href={`/products/${structure.slug}`} aria-label={`Learn more about ${structure.name}`}>
                    Learn more <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section process-section" id="process">
          <div className="process-intro">
            <p className="eyebrow">
              <span />
              Simple from start to finish
            </p>
            <h2>A better building process starts with a real conversation.</h2>
            <p>
              No pressure. No runaround. Just practical help from people who
              know the Eagle Carports product line and care about getting your
              order right.
            </p>
            <a href="#quote" className="text-link">
              Let&apos;s talk about your project <span aria-hidden="true">→</span>
            </a>
          </div>

          <ol className="process-list">
            <li>
              <span>1</span>
              <div>
                <h3>Tell us what you need</h3>
                <p>Share your ideas, dimensions, location, and how you plan to use the space.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <h3>Design it your way</h3>
                <p>We&apos;ll help tailor the roof, colors, openings, and options to your property.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <h3>Eagle delivers and installs</h3>
                <p>Once your site is ready and the order is scheduled, an Eagle Carports crew delivers and installs the structure.</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="section why-section" id="why-us">
          <div className="why-panel">
            <div className="why-art" aria-hidden="true">
              <div className="why-sun" />
              <div className="why-ground" />
              <div className="why-building">
                <i />
                <span />
              </div>
              <div className="experience-badge">
                <strong>Built right.</strong>
                <small>Made to last.</small>
              </div>
            </div>
            <div className="why-copy">
              <p className="eyebrow light-eyebrow">
                <span />
                Why My Carport Guy
              </p>
              <h2>We make big projects feel easy.</h2>
              <p>
                A metal building is a real investment. You deserve honest
                answers and thoughtful local guidance, backed by an established
                American metal-building manufacturer.
              </p>
              <div className="why-points">
                <div>
                  <strong>People first</strong>
                  <span>A local contact to help you compare options and place your order.</span>
                </div>
                <div>
                  <strong>Built for real life</strong>
                  <span>Customizable Eagle structures for vehicles, equipment, work, and storage.</span>
                </div>
                <div>
                  <strong>Clear and upfront</strong>
                  <span>Clear choices, site-preparation guidance, and no confusing sales talk.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section service-section" id="service-area">
          <div className="service-copy">
            <p className="eyebrow">
              <span />
              Eagle Carports service area
            </p>
            <h2>Delivery and installation across 21 states.</h2>
            <p>
              Eagle Carports serves communities across the South, Southeast,
              Midwest, and Southwest. Share your ZIP code and we&apos;ll confirm
              product availability, delivery details, and requirements for your
              exact location.
            </p>
            <a href="#quote" className="button">
              Check my ZIP code <span aria-hidden="true">→</span>
            </a>
            <a href="/service-areas/north-carolina" className="text-link">
              North Carolina service details <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="service-map">
            <Image
              src="/service-area-map-brand.png"
              alt="Eagle Carports service area covering 21 states from Colorado and New Mexico through the Midwest, South, and East Coast"
              width={1429}
              height={1101}
              sizes="(max-width: 900px) 100vw, 58vw"
            />
            <details>
              <summary>View all covered states</summary>
              <ul>
                {serviceStates.map((state) => (
                  <li key={state}>{state}</li>
                ))}
              </ul>
            </details>
          </div>
          <details className="lead-time-card">
            <summary>
              <span>
                <strong>Estimated installation lead times</strong>
                <small>Eagle Carports map · January 2026</small>
              </span>
              <span className="lead-time-action">View map</span>
            </summary>
            <div className="lead-time-content">
              <p>
                Estimates vary by location and may change. Lead time typically
                begins after the installation site is ready and all required
                permits have been obtained.
              </p>
              <div className="lead-time-scroll">
                <Image
                  src="/eagle-lead-time-map-jan-2026.png"
                  alt="Eagle Carports estimated installation lead-time map dated January 2026, with regional estimates ranging from 2 to 15 weeks"
                  width={2560}
                  height={1707}
                  sizes="(max-width: 900px) 1200px, 1200px"
                />
              </div>
              <p className="lead-time-note">
                For the latest estimate for your ZIP code, contact My Carport
                Guy before ordering.
              </p>
            </div>
          </details>
        </section>

        <section className="section financing-section" id="financing">
          <div>
            <p className="eyebrow">
              <span />
              Flexible financing
            </p>
            <h2>Build the space you need. Keep the payment comfortable.</h2>
          </div>
          <div>
            <p>
              Eagle Carports offers payment on delivery, traditional financing,
              and rent-to-own options. Eligibility, terms, and availability
              vary.
            </p>
            <a href="/financing" className="text-link">
              Explore rent-to-own <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className="quote-section" id="quote">
          <div className="quote-intro">
            <p className="eyebrow light-eyebrow">
              <span />
              Free, no-pressure quote
            </p>
            <h2>Your new space starts with a simple hello.</h2>
            <p>
              Tell us what you have in mind. We&apos;ll help you explore the
              Eagle Carports options and prepare the right order for your
              property.
            </p>
            <div className="quote-contact">
              <span>Prefer to talk?</span>
              <a href="tel:+18288391730">(828) 839-1730</a>
              <a className="quote-email" href="mailto:barry@mycarportguy.com">
                barry@mycarportguy.com
              </a>
              <small>Friendly help. No sales pressure.</small>
            </div>
          </div>
          <QuoteForm />
        </section>
      </main>

      <footer>
        <a href="#" className="brand footer-brand">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span><strong>MY CARPORT</strong><small>GUY</small></span>
        </a>
        <div className="footer-contact">
          <a href="tel:+18288391730">(828) 839-1730</a>
          <a href="mailto:barry@mycarportguy.com">barry@mycarportguy.com</a>
        </div>
        <div className="footer-legal">
          <div>
            <a href="/faq">FAQs</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
          <p>
            © {new Date().getFullYear()} My Carport Guy. Eagle Carports is a
            separate manufacturer.
          </p>
        </div>
      </footer>
    </>
  );
}
