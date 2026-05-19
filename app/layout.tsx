import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://norra.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Norra — Hit Your Number. Fuel Your Day.",
  description:
    "Daily meal packs engineered around your protein target. Shelf stable. Microwave ready. No tracking.",
  openGraph: {
    title: "Norra — Hit Your Number. Fuel Your Day.",
    description:
      "Daily meal packs engineered around your protein target. Shelf stable. Microwave ready. No tracking.",
    url: siteUrl,
    siteName: "Norra",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Norra protein packs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Norra — Hit Your Number. Fuel Your Day.",
    description:
      "Daily meal packs engineered around your protein target. Shelf stable. Microwave ready. No tracking.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bricolage.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-paper text-ink antialiased">
        {children}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
