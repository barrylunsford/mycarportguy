import Link from "next/link";

const navigation = [
  { label: "Browse buildings", href: "/buildings" },
  { label: "Colors", href: "/colors" },
  { label: "How it works", href: "/#process" },
  { label: "Why us", href: "/#why-us" },
  { label: "Service area", href: "/service-areas" },
  { label: "Financing", href: "/financing" },
  { label: "FAQs", href: "/faq" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="announcement">
        <p>Your local dealer for Eagle Carports metal buildings.</p>
        <a href="tel:+18288391730">Call (828) 839-1730</a>
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
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <a href="tel:+18288391730">Call (828) 839-1730</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
