import type { Metadata } from "next";
import Image from "next/image";
import { PublicPageHeader } from "@/components/ui/public-page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { organization, principles } from "@/lib/content";
import { getPublicTeam } from "@/server/cms/public-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Tentang Kami", "Kenali pendekatan demo Ruang Rimba dalam kegiatan outdoor, pembelajaran alam, dan konservasi.", "/tentang-kami");

const missions = [
  "Merancang pengalaman luar ruang yang aman, inklusif, dan sesuai kebutuhan kelompok.",
  "Menghubungkan pengalaman langsung dengan pembelajaran yang relevan.",
  "Mendorong kepedulian terhadap alam melalui kegiatan yang bertanggung jawab.",
  "Membuka ruang kolaborasi dan pembelajaran bersama komunitas setempat.",
];

export default async function AboutPage() {
  const team = await getPublicTeam();
  return (
    <main id="konten">
      <PublicPageHeader eyebrow="Tentang kami" title="Mengenal alam, mengenal cara kita bertumbuh." description="Ruang Rimba adalah identitas demo. Ganti narasi berikut dengan cerita, sejarah, dan konteks organisasi yang telah diverifikasi." breadcrumbs={[{ label: "Tentang Kami" }]} />
      <section className="about-story section-pad">
        <div className="container about-story__grid">
          <div className="about-story__image"><Image src="/images/intro-landscape.svg" alt="Ilustrasi demo perbukitan dan jalur setapak" fill sizes="(max-width: 800px) 90vw, 45vw" /><span>Ilustrasi demo, bukan foto organisasi</span></div>
          <div className="about-story__copy"><p className="eyebrow">Cerita organisasi</p><h2>Pengalaman langsung membuat alam terasa lebih dekat.</h2><p>{organization.description}</p><p>Bagian ini perlu dilengkapi dengan kisah pendirian organisasi, wilayah kerja, dan pengalaman yang dapat dibuktikan.</p><ButtonLink href="/program" variant="outline">Lihat program <span aria-hidden="true">↗</span></ButtonLink></div>
        </div>
      </section>
      <section className="vision-section">
        <div className="container vision-section__inner"><p className="eyebrow eyebrow--light">Visi organisasi</p><h2>[Tambahkan visi resmi organisasi]</h2><p>Visi pada halaman ini adalah placeholder dan perlu diganti sebelum publikasi.</p></div>
      </section>
      <section className="mission-section section-pad">
        <div className="container mission-section__grid"><SectionHeading eyebrow="Arah kerja" title="Misi yang bisa dijalani bersama." description="Contoh rumusan misi berikut bukan pernyataan resmi organisasi." /><ol className="mission-list">{missions.map((mission, index) => <li key={mission}><span>0{index + 1}</span><p>{mission}</p></li>)}</ol></div>
      </section>
      <section className="values section-pad">
        <div className="container"><SectionHeading eyebrow="Nilai yang dijaga" title="Cara kami ingin hadir di alam." description="Nilai berikut adalah titik awal untuk ditinjau bersama tim organisasi." /><div className="public-values-grid">{principles.map((item, index) => <article className="public-value" key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div>
      </section>
      <section className="team-section section-pad">
        <div className="container"><div className="team-section__inner"><div><p className="eyebrow">Tim kami</p><h2>Orang-orang di balik setiap pengalaman.</h2></div>{team.length === 0 && <div className="team-placeholder"><span aria-hidden="true">+</span><div><h3>Profil tim belum tersedia</h3><p>Tambahkan foto, nama, peran, dan biografi singkat setelah informasi tim disetujui organisasi.</p></div></div>}</div>{team.length > 0 && <div className="public-team-grid">{team.map((member) => <article key={member.id}><div className="public-team-grid__photo">{member.photoUrl ? <Image src={member.photoUrl} alt={member.photoAlt || `Foto ${member.name}`} fill sizes="(max-width: 650px) 80vw, 30vw" /> : <span aria-hidden="true">R</span>}</div><p className="eyebrow">{member.role}</p><h3>{member.name}</h3><p>{member.biography}</p></article>)}</div>}</div>
      </section>
    </main>
  );
}
