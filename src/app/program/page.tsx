import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PublicPageHeader } from "@/components/ui/public-page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { getPublicPrograms } from "@/server/cms/public-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Program Outdoor dan Konservasi", "Jelajahi contoh program outbound, team building, adventure, edukasi alam, dan konservasi Ruang Rimba.", "/program");

export default async function ProgramsPage() {
  const { items: programs, isDemo } = await getPublicPrograms();
  return (
    <main id="konten">
      <PublicPageHeader eyebrow="Program" title="Pilih pengalaman yang ingin dibangun bersama." description="Jelajahi program yang dirancang untuk belajar, bergerak, dan berkegiatan di alam." breadcrumbs={[{ label: "Program" }]} />
      <section className="program-listing section-pad"><div className="container">{isDemo && <p className="demo-note">Konten berikut adalah contoh. Program final perlu dikonfirmasi bersama organisasi.</p>}<div className="listing-grid">{programs.map((program, index) => <article className="listing-card" key={program.slug}><Link href={`/program/${program.slug}`} className="listing-card__link"><span className="listing-card__image"><Image src={program.image} alt={program.imageAlt} fill sizes="(max-width: 680px) 90vw, (max-width: 1000px) 44vw, 31vw" /></span><span className="listing-card__body"><span className="listing-card__eyebrow">{String(index + 1).padStart(2, "0")} / {program.category}</span><strong>{program.title}</strong><span className="listing-card__description">{program.excerpt}</span><span className="text-link">Lihat detail <span aria-hidden="true">↗</span></span></span></Link></article>)}</div><div className="listing-cta"><div><p className="eyebrow">Punya kebutuhan khusus?</p><h2>Rancang kegiatan bersama tim.</h2></div><ButtonLink href="/kontak" variant="solid">Diskusikan program <span aria-hidden="true">↗</span></ButtonLink></div></div></section>
    </main>
  );
}
