import type { MetadataRoute } from "next";
import { canonicalUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: canonicalUrl(siteUrl, "/sitemap.xml"),
  };
}
