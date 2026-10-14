import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
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
  metadataBase: new URL("https://mycarportguy.com"),
  title: {
    default: "My Carport Guy | Eagle Carports Dealer",
    template: "%s | My Carport Guy",
  },
  description:
    "Friendly help designing and ordering Eagle Carports carports, garages, RV covers, barns, and custom metal buildings across 21 states.",
  applicationName: "My Carport Guy",
  keywords: [
    "carports",
    "metal garages",
    "RV covers",
    "metal barns",
    "metal buildings",
    "Eagle Carports dealer",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "My Carport Guy",
    title: "My Carport Guy | Eagle Carports Dealer",
    description:
      "Friendly help choosing and ordering an Eagle Carports structure that fits your property, needs, and budget.",
  },
  twitter: {
    card: "summary",
    title: "My Carport Guy | Eagle Carports Dealer",
    description:
      "Friendly help choosing and ordering carports, garages, RV covers, barns, and metal buildings.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
