import type { Metadata } from "next";
import { PublicPageHeader } from "@/components/ui/public-page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/forms/contact-form";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getPublicPrograms, getPublicSettings } from "@/server/cms/public-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Kontak dan Konsultasi Program", "Informasi kontak Ruang Rimba. Lengkapi alamat, email, WhatsApp, dan area layanan resmi sebelum situs dipublikasikan.", "/kontak");

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ program?: string }> }) {
  const [query, { items: programs }, settings] = await Promise.all([searchParams, getPublicPrograms(), getPublicSettings()]);
  const whatsapp = settings.whatsapp;
  const email = settings.email;
  const address = settings.address || settings.operationalArea;
  const whatsappUrl = buildWhatsAppUrl(whatsapp, "Halo, saya ingin berdiskusi tentang program outdoor.");
  const programOptions = [...new Set(["Outbound", "Team Building", "Adventure", "Edukasi Alam", "Konservasi", ...programs.map(({ title }) => title)])];
  const selectedProgram = programs.find(({ slug }) => slug === query.program)?.title ?? (query.program === "konservasi" ? "Konservasi" : undefined);
  const socialLinks = [
    { label: "Instagram", href: settings.instagramUrl },
    { label: "Facebook", href: settings.facebookUrl },
    { label: "YouTube", href: settings.youtubeUrl },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href));

  return (
    <main id="konten">
      <PublicPageHeader eyebrow="Kontak" title="Mari bicarakan pengalaman yang ingin dibuat." description="Ceritakan kebutuhan kelompok atau minat untuk ikut kegiatan. Permintaan akan tersimpan agar dapat ditinjau administrator." breadcrumbs={[{ label: "Kontak" }]} />
      <section className="contact-page-section section-pad"><div className="container contact-page-grid">
        <div>
          <SectionHeading eyebrow="Hubungi organisasi" title="Kami siap mendengar rencanamu." description="Bagikan beberapa detail agar permintaan programmu lebih mudah dipahami." />
          <div className="contact-details">
            <div><span>Alamat / area layanan</span>{address ? <p>{address}</p> : <p>[Tambahkan alamat serta area layanan resmi]</p>}</div>
            <div><span>Email</span>{email ? <a href={`mailto:${email}`}>{email}</a> : <p>[Tambahkan email resmi]</p>}</div>
            {settings.phone && <div><span>Telepon</span><a href={`tel:${settings.phone}`}>{settings.phone}</a></div>}
            <div><span>WhatsApp</span>{whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noreferrer">Mulai percakapan ↗</a> : <p>[Tambahkan nomor WhatsApp resmi]</p>}</div>
            <div><span>Media sosial</span>{socialLinks.length ? <p>{socialLinks.map((item, index) => <span key={item.label}>{index > 0 ? " · " : ""}<a href={item.href} target="_blank" rel="noreferrer">{item.label}</a></span>)}</p> : <p>[Tambahkan tautan akun resmi]</p>}</div>
          </div>
          {whatsappUrl && <a className="contact-whatsapp-link" href={whatsappUrl} target="_blank" rel="noreferrer">Lebih nyaman lewat WhatsApp? <span>Mulai percakapan ↗</span></a>}
        </div>
        <div className="contact-form-panel"><p className="eyebrow">Formulir permintaan</p><h2>Kirim rencana kegiatan.</h2><ContactForm programs={programOptions} selectedProgram={selectedProgram} /></div>
      </div></section>
    </main>
  );
}
