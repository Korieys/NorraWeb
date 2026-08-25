import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Stand-in serif for the comparison section's display numerals + headline.
// TODO: swap for the brand serif once it is in the repo.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600"],
});

// Mono for the data-sheet line items, grams, and prices.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eatdaypack.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Daypack by Daysworth - Pilot Updates",
  description:
    "Daypack is a planned curated assortment of unopened, shelf-stable foods organized into one day. Paid pilot ordering is not currently open.",
  openGraph: {
    title: "Daypack by Daysworth - Pilot Updates",
    description:
      "A full day of food, in one pack. Join the list for verified pilot details before paid ordering opens.",
    url: siteUrl,
    siteName: "Daypack",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Daypack protein packs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daypack by Daysworth - Pilot Updates",
    description:
      "A full day of food, in one pack. Paid pilot ordering is not currently open.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/daypackNewfavicon.png", type: "image/png" },
    ],
    shortcut: ["/daypackNewfavicon.png"],
    apple: [
      { url: "/daypackNewfavicon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bricolage.variable} ${fraunces.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-paper text-ink antialiased">
        {children}
        <AnalyticsScripts />
        <Analytics />
      </body>
    </html>
  );
}
