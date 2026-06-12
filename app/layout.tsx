import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import { SKUS, SKU_ORDER } from "@/lib/skus";
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
  title: "Daypack — Pick Your Protein Target. Eat the Pouch.",
  description:
    "Daily protein packs sized by grams. Five sizes, from 110 to 230. Built for any adult who wants the number handled. Shelf stable. Microwave ready. No tracking.",
  openGraph: {
    title: "Daypack — Pick Your Protein Target. Eat the Pouch.",
    description:
      "Daily protein packs sized by grams. Five sizes, from 110 to 230. Built for any adult who wants the number handled. Shelf stable. Microwave ready. No tracking.",
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
    title: "Daypack — Pick Your Protein Target. Eat the Pouch.",
    description:
      "Daily protein packs sized by grams. Five sizes, from 110 to 230. Built for any adult who wants the number handled. Shelf stable. Microwave ready. No tracking.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              SKU_ORDER.map((id) => {
                const sku = SKUS[id];
                return {
                  "@context": "https://schema.org",
                  "@type": "Product",
                  name: `Daypack ${sku.protein} Protein Pack`,
                  description: sku.description,
                  brand: { "@type": "Brand", name: "Daypack" },
                  sku: `daypack-${sku.id}`,
                  url: `${siteUrl}/#sku-${sku.id}`,
                  offers: {
                    "@type": "Offer",
                    price: sku.pricePerDay.toFixed(2),
                    priceCurrency: "USD",
                    availability: "https://schema.org/PreOrder",
                    url: `${siteUrl}/#sku-${sku.id}`,
                  },
                };
              })
            ),
          }}
        />
      </body>
    </html>
  );
}
