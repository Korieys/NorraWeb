import type { MetadataRoute } from "next";
import { SKU_ORDER } from "@/lib/skus";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://eatdaypack.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = SITE.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/find-your-pack`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/story`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const skuRoutes: MetadataRoute.Sitemap = SKU_ORDER.map((id) => ({
    url: `${base}/#sku-${id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...skuRoutes];
}
