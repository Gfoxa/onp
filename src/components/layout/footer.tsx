import Link from "next/link";
import Image from "next/image";
import { navigation, organization } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getPublicSettings } from "@/server/cms/public-content";

export async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getPublicSettings();
  const socialLinks = [
    { label: "Instagram", href: settings.instagramUrl },
    { label: "Facebook", href: settings.facebookUrl },
    { label: "YouTube", href: settings.youtubeUrl },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href));
  const address = settings.address || settings.operationalArea;
  const email = settings.email;
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp, "Halo, saya ingin berdiskusi tentang program outdoor.");

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link className="brand brand--footer" href="/">
              <span className="brand__mark" aria-hidden="true">{settings.logoUrl ? <Image src={settings.logoUrl} alt="" fill sizes="34px" /> : "R"}</span>
              <span className="brand__text"><strong>{settings.organizationName || organization.name}</strong><small>{settings.organizationName === "Ruang Rimba" ? "Nama identitas demo" : ""}</small></span>
            </Link>
            <p>{settings.description}</p>
          </div>
          <div className="footer-links">
            <h2>Jelajahi</h2>
            {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </div>
          <div className="footer-contact">
            <h2>Kontak organisasi</h2>
            <p>{address || "[Tambahkan alamat dan area layanan]"}</p>
            {email ? <a href={`mailto:${email}`}>{email}</a> : <p>[Tambahkan email resmi]</p>}
            {settings.phone ? <a href={`tel:${settings.phone}`}>{settings.phone}</a> : null}
            {whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp resmi ↗</a> : <p>[Tambahkan WhatsApp resmi]</p>}
            <div className="footer-social">
              <h2>Media sosial</h2>
              {socialLinks.length ? socialLinks.map((item) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label} ↗</a>) : <p>[Tambahkan tautan resmi]</p>}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {year} {settings.organizationName || organization.name}. Bertualang bersama.</p>
          <p>Bertualang dengan bijak. Menjaga alam bersama.</p>
        </div>
      </div>
    </footer>
  );
}
