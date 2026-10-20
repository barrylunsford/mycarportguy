import type { Metadata, Viewport } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import AnalyticsEvents from "@/components/AnalyticsEvents";
import GoogleAnalytics from "@/components/GoogleAnalytics";
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
  title: {
    default: "My Carport Guy | Metal Carports, Garages & Buildings",
    template: "%s | My Carport Guy",
  },
  description:
    "My Carport Guy provides friendly help designing and ordering carports, garages, RV covers, barns, and custom metal buildings across 21 states.",
  applicationName: "My Carport Guy",
  creator: "My Carport Guy LLC",
  publisher: "My Carport Guy LLC",
  category: "Metal buildings",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    url: "/",
    locale: "en_US",
    siteName: "My Carport Guy",
    title: "My Carport Guy | Metal Carports, Garages & Buildings",
    description:
      "My Carport Guy helps you choose and order a carport or metal building that fits your property, needs, and budget.",
  },
  twitter: {
    card: "summary",
    title: "My Carport Guy | Metal Carports, Garages & Buildings",
    description:
      "Friendly help choosing and ordering carports, garages, RV covers, barns, and metal buildings.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.mycarportguy.com/#website",
      url: "https://www.mycarportguy.com/",
      name: "My Carport Guy",
      description: "Friendly help choosing and ordering carports and metal buildings.",
      inLanguage: "en-US",
      publisher: { "@id": "https://www.mycarportguy.com/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://www.mycarportguy.com/#organization",
      name: "My Carport Guy",
      legalName: "My Carport Guy LLC",
      url: "https://www.mycarportguy.com/",
      telephone: "+1-828-449-7158",
      email: "sales@mycarportguy.com",
      description: "Independent metal-building dealer helping customers choose, customize, and order metal carports, garages, RV covers, barns, and other steel buildings.",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-828-449-7158",
        email: "sales@mycarportguy.com",
        contactType: "sales",
        availableLanguage: "English",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteStructuredData).replace(/</g, "\\u003c"),
          }}
        />
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
        <AnalyticsEvents />
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
