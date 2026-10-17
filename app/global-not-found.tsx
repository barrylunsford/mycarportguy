import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mycarportguy.com"),
  title: "Page Not Found | My Carport Guy",
  description: "The page you requested could not be found.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable}`}>
      <body>
        <main id="main-content" className="admin-login-page">
          <section className="admin-login-card" aria-labelledby="not-found-heading">
            <Link href="/" className="admin-login-brand">My Carport Guy</Link>
            <p className="eyebrow"><span />404 error</p>
            <h1 id="not-found-heading">That page isn&apos;t here.</h1>
            <p>
              The address may have changed, or the page may no longer exist. You can
              return home or browse the available carports and metal buildings.
            </p>
            <div className="not-found-actions">
              <Link className="button" href="/">Return home</Link>
              <Link className="admin-login-back" href="/buildings">Browse buildings →</Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
