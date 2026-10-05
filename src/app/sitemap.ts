import type { MetadataRoute } from "next";
import { getPublicArticles, getPublicPrograms } from "@/server/cms/public-content";
import { canonicalUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticRoutes = ["", "/tentang-kami", "/program", "/konservasi", "/galeri", "/artikel", "/faq", "/kontak"];
  const [programResult, articleResult] = await Promise.all([getPublicPrograms(), getPublicArticles()]);
  return [
    ...staticRoutes.map((route) => ({ url: canonicalUrl(siteUrl, route || "/"), changeFrequency: "monthly" as const, priority: route ? 0.7 : 1 })),
    ...(programResult.isDemo ? [] : programResult.items.map((program) => ({ url: canonicalUrl(siteUrl, `/program/${program.slug}`), changeFrequency: "monthly" as const, priority: 0.6 }))),
    ...(articleResult.isDemo ? [] : articleResult.items.map((article) => ({ url: canonicalUrl(siteUrl, `/artikel/${article.slug}`), changeFrequency: "monthly" as const, priority: 0.6 }))),
  ];
}
