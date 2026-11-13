import type { MetadataRoute } from "next";
import { fieldGuides } from "@/lib/field-guides";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://eatdaypack.com";
export default function sitemap(): MetadataRoute.Sitemap {
 const base=SITE.replace(/\/$/, "");
 const routes=["", "/picks", "/media", "/plan-your-day", "/product-status", "/partnerships", "/story", ...fieldGuides.map(guide=>`/guides/${guide.slug}`)];
 return routes.map(route=>({url:`${base}${route || "/"}`,lastModified:new Date("2026-11-13T12:00:00Z"),changeFrequency:"weekly",priority:route ? 0.7 : 1}));
}
