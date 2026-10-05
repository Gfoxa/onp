import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicProgram, getPublicPrograms } from "@/server/cms/public-content";
import { robotsForDemoContent } from "@/lib/seo";

export async function generateStaticParams() {
  const { items } = await getPublicPrograms();
  return items.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { item: program, isDemo } = await getPublicProgram(slug);
  if (!program) return { title: "Program tidak ditemukan" };
  return {
    title: program.title,
    description: program.excerpt,
    alternates: { canonical: `/program/${program.slug}` },
    robots: robotsForDemoContent(isDemo),
    openGraph: { title: `${program.title} | Ruang Rimba`, description: program.excerpt, url: `/program/${program.slug}`, images: [{ url: program.image, alt: program.imageAlt }] },
    twitter: { card: "summary_large_image", title: `${program.title} | Ruang Rimba`, description: program.excerpt, images: [program.image] },
  };
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return <section className="detail-list-section"><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { item: program, isDemo } = await getPublicProgram(slug);
  if (!program) notFound();

  return (
    <main id="konten">
      <section className="detail-hero"><div className="container"><Breadcrumbs items={[{ label: "Program", href: "/program" }, { label: program.title }]} /><div className="detail-hero__grid"><div className="detail-hero__copy"><p className="eyebrow">{program.category}{isDemo ? " · Konten demo" : ""}</p><h1>{program.title}</h1><p>{program.excerpt}</p><ButtonLink href={`/kontak?program=${encodeURIComponent(program.slug)}`} variant="solid">Diskusikan program ini <span aria-hidden="true">↗</span></ButtonLink></div><div className="detail-hero__image"><Image src={program.image} alt={program.imageAlt} fill priority sizes="(max-width: 800px) 90vw, 50vw" />{isDemo && <span>Ilustrasi demo</span>}</div></div></div></section>
      <section className="detail-overview section-pad"><div className="container detail-overview__grid"><div><p className="eyebrow">Gambaran umum</p><h2>Pengalaman dirancang sesuai tujuan kelompok.</h2>{program.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><dl className="program-facts"><div><dt>Durasi</dt><dd>{program.duration}</dd></div><div><dt>Peserta</dt><dd>{program.participants}</dd></div><div><dt>Lokasi</dt><dd>{program.location}</dd></div><div><dt>Tingkat</dt><dd>{program.difficulty}</dd></div></dl></div></section>
      {program.highlights.length > 0 && <section className="detail-highlights section-pad"><div className="container"><SectionHeading eyebrow="Yang bisa dipelajari" title="Pengalaman yang punya arah." description="Sorotan berikut merupakan gambaran awal dan dapat diubah sesuai kebutuhan peserta." /><div className="highlight-grid">{program.highlights.map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3></article>)}</div></div></section>}
      <section className="detail-content section-pad"><div className="container detail-content__grid"><div><ListSection title="Contoh aktivitas" items={program.activities} /><ListSection title="Alur kegiatan" items={program.schedule} /></div><div><ListSection title="Termasuk dalam rancangan" items={program.included} /><ListSection title="Belum termasuk" items={program.excluded} /><ListSection title="Keselamatan" items={program.safety} /></div></div></section>
      <section className="detail-gallery section-pad"><div className="container"><SectionHeading eyebrow="Gambaran visual" title="Contoh suasana kegiatan." description="Ilustrasi demo ini akan diganti dengan dokumentasi organisasi yang telah mendapat izin penggunaan." /><div className="detail-gallery__grid">{program.gallery.map((item) => <div className="detail-gallery__item" key={item.src}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 700px) 90vw, 45vw" /></div>)}</div></div></section>
      <section className="detail-faq section-pad"><div className="container detail-faq__grid"><div><p className="eyebrow">Sebelum berdiskusi</p><h2>Beberapa hal yang perlu dipersiapkan.</h2><p>Spesifikasi final bergantung pada kebutuhan kelompok dan asesmen lokasi.</p></div><div className="faq-list"><details><summary>Apakah program bisa disesuaikan?</summary><p>Ya, rancangan dapat dibahas berdasarkan tujuan, peserta, waktu, dan lokasi. Detail final belum ditetapkan dalam konten demo ini.</p></details><details><summary>Apakah lokasi sudah termasuk?</summary><p>Belum. Lokasi dan biaya terkait perlu disepakati setelah kebutuhan serta kondisi lapangan dipahami.</p></details><details><summary>Bagaimana cara memulai?</summary><p>Hubungi organisasi melalui informasi kontak yang telah dikonfigurasi.</p></details></div></div></section>
      <section className="detail-bottom-cta"><div className="container"><div><p className="eyebrow eyebrow--light">Lanjutkan percakapan</p><h2>Susun kegiatan sesuai kebutuhanmu.</h2></div><ButtonLink href={`/kontak?program=${encodeURIComponent(program.slug)}`} variant="light">Hubungi kami <span aria-hidden="true">↗</span></ButtonLink></div></section>
    </main>
  );
}
