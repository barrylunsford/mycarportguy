import Link from "next/link";
import { buildingDesignerUrl } from "@/lib/building-designer";

const navigation = [
  { label: "Browse buildings", href: "/buildings" },
  { label: "Colors", href: "/colors" },
  { label: "How it works", href: "/#process" },
  { label: "Service area", href: "/service-areas" },
  { label: "Financing", href: "/financing" },
  { label: "About", href: "/about" },
  { label: "FAQs", href: "/faq" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="announcement">
        <p>Your local source for carports and metal buildings.</p>
        <a href="tel:+18284497158">Call (828) 449-7158</a>
      </div>

      <div className="nav-shell">
        <Link href="/" className="brand" aria-label="My Carport Guy home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>
            <strong>MY CARPORT</strong>
            <small>GUY</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href={buildingDesignerUrl} target="_blank" rel="noopener noreferrer">3D designer <span className="sr-only">(opens in a new tab)</span></a>
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/#quote" className="button button-small">
          Get a free quote
        </Link>

        <details className="mobile-menu">
          <summary aria-label="Open navigation">
            <span />
            <span />
            <span />
          </summary>
          <nav aria-label="Mobile navigation">
            <a href={buildingDesignerUrl} target="_blank" rel="noopener noreferrer">3D designer <span className="sr-only">(opens in a new tab)</span></a>
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <a href="tel:+18284497158">Call (828) 449-7158</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
