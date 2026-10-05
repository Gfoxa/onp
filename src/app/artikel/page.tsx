import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PublicPageHeader } from "@/components/ui/public-page-header";
import { getPublicArticles } from "@/server/cms/public-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Artikel dan Jurnal Alam", "Baca contoh catatan tentang outdoor learning, konservasi, komunitas, dan tips beraktivitas di alam.", "/artikel");

export default async function ArticlesPage() {
  const { items: articles, isDemo } = await getPublicArticles();
  return (
    <main id="konten">
      <PublicPageHeader eyebrow="Jurnal alam" title="Cerita dan pengetahuan untuk dibawa pulang." description="Baca catatan tentang outdoor learning, konservasi, komunitas, dan tips beraktivitas di alam." breadcrumbs={[{ label: "Artikel" }]} />
      <section className="article-list-section section-pad"><div className="container">{isDemo && <p className="demo-note">Semua artikel di halaman ini adalah konten demo.</p>}<div className="article-list">{articles.map((article, index) => <article className="article-card" key={article.slug}><Link href={`/artikel/${article.slug}`} className="article-card__link"><span className="article-card__image"><Image src={article.coverImage} alt={article.coverAlt} fill sizes="(max-width: 700px) 90vw, 35vw" /></span><span className="article-card__meta"><span className="article-card__category">{article.category}</span><span className="article-card__number">Catatan {String(index + 1).padStart(2, "0")}</span></span><strong>{article.title}</strong><span className="article-card__excerpt">{article.excerpt}</span><span className="text-link">Baca artikel <span aria-hidden="true">↗</span></span></Link></article>)}</div></div></section>
    </main>
  );
}
