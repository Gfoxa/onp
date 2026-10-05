import type { Metadata } from "next";
import { PublicPageHeader } from "@/components/ui/public-page-header";
import { faqs } from "@/lib/faqs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Pertanyaan Umum", "Jawaban awal untuk pertanyaan seputar program outdoor, persiapan, konservasi, dan pemesanan.", "/faq");

export default function FAQPage() {
  const categories = [...new Set(faqs.map((item) => item.category))];
  return (
    <main id="konten">
      <PublicPageHeader eyebrow="Pertanyaan umum" title="Sebelum merencanakan kegiatan." description="Informasi operasional organisasi belum tersedia. Jawaban berikut menandai hal-hal yang perlu dikonfirmasi sebelum kegiatan." breadcrumbs={[{ label: "FAQ" }]} />
      <section className="faq-page-section section-pad"><div className="container faq-page-grid">{categories.map((category) => <section className="faq-category" key={category}><h2>{category}</h2><div className="faq-list">{faqs.filter((item) => item.category === category).map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>)}</div></section>
    </main>
  );
}
