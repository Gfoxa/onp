import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PublicPageHeader } from "@/components/ui/public-page-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicConservationProjects } from "@/server/cms/public-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Konservasi Alam dan Komunitas", "Kenali contoh pendekatan edukasi lingkungan, pemulihan alam, dan kolaborasi komunitas Ruang Rimba.", "/konservasi");

const conservationPrograms = [
  { title: "Penanaman dan perawatan", text: "Kegiatan dirancang bersama pengelola untuk memahami jenis tanaman, kondisi lokasi, dan perawatan jangka panjang." },
  { title: "Belajar tentang sungai", text: "Pengamatan dan edukasi yang memperhatikan keselamatan serta pengetahuan masyarakat setempat." },
  { title: "Edukasi satwa dan habitat", text: "Materi pembelajaran perlu mengikuti informasi tepercaya dan tidak mengganggu kehidupan satwa." },
  { title: "Pemulihan kawasan", text: "Rencana pemulihan disusun berdasarkan kebutuhan lokasi dan masukan pihak yang memahami ekosistem setempat." },
  { title: "Pemberdayaan komunitas", text: "Kegiatan kolaboratif yang memberi ruang bagi prioritas dan pengalaman komunitas lokal." },
];

export default async function ConservationPage() {
  const projects = await getPublicConservationProjects();
  return (
    <main id="konten">
      <PublicPageHeader eyebrow="Konservasi" title="Menjaga alam dimulai dengan mau mengenalinya." description="Konservasi adalah bagian dari arah organisasi demo ini. Program, mitra, dan dampak aktual belum disediakan." breadcrumbs={[{ label: "Konservasi" }]} />
      <section className="conservation-philosophy section-pad"><div className="container conservation-philosophy__grid"><div className="conservation-philosophy__image"><Image src="/images/conservation.svg" alt="Ilustrasi demo hutan tropis dan sungai" fill sizes="(max-width: 800px) 90vw, 45vw" /><span>Ilustrasi demo</span></div><div><p className="eyebrow">Cara pandang</p><h2>Petualangan dan kepedulian dapat berjalan beriringan.</h2><p>Kegiatan konservasi sebaiknya berangkat dari konteks tempat, pengetahuan setempat, dan tujuan yang dapat dijelaskan. Pengalaman belajar tidak menggantikan kerja jangka panjang yang dibutuhkan alam.</p><p>Setiap rencana perlu dibangun bersama pengelola dan komunitas terkait, lalu dievaluasi secara terbuka.</p></div></div></section>
      <section className="conservation-programs section-pad"><div className="container"><SectionHeading eyebrow="Ruang kolaborasi" title="Contoh kegiatan yang dapat dikembangkan." description="Daftar berikut bukan program aktif atau komitmen organisasi. Ketersediaannya perlu dikonfirmasi." /><div className="conservation-program-grid">{conservationPrograms.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>
      {projects.length > 0 && <section className="conservation-programs section-pad"><div className="container"><SectionHeading eyebrow="Dokumentasi organisasi" title="Proyek konservasi terbit." description="Informasi pada bagian ini dikelola oleh organisasi." /><div className="conservation-program-grid">{projects.map((project) => <article key={project.id}><span>{project.location || "Proyek"}</span><h3>{project.title}</h3><p>{project.summary}</p></article>)}</div></div></section>}
      <section className="impact-note"><div className="container impact-note__inner"><span className="impact-note__symbol" aria-hidden="true">i</span><div><p className="eyebrow">Data dampak</p><h2>Angka dampak belum tersedia.</h2><p>Halaman ini tidak menampilkan statistik konservasi karena data terverifikasi dari organisasi belum diberikan.</p></div></div></section>
      <section className="conservation-stories section-pad"><div className="container"><SectionHeading eyebrow="Baca lebih lanjut" title="Belajar dari hubungan kita dengan alam." description="Artikel berikut juga merupakan konten demo." /><div className="conservation-story-links"><Link href="/artikel/belajar-konservasi-dari-sungai"><span>01</span><strong>Belajar Konservasi dari Sungai</strong><span aria-hidden="true">↗</span></Link><Link href="/artikel/5-prinsip-bertualang-tanpa-merusak-alam"><span>02</span><strong>5 Prinsip Bertualang Tanpa Merusak Alam</strong><span aria-hidden="true">↗</span></Link></div></div></section>
      <section className="detail-bottom-cta"><div className="container"><div><p className="eyebrow eyebrow--light">Berkegiatan bersama</p><h2>Ingin ikut kegiatan konservasi?</h2></div><ButtonLink href="/kontak?program=konservasi" variant="light">Hubungi kami <span aria-hidden="true">↗</span></ButtonLink></div></section>
    </main>
  );
}
