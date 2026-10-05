import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import "./globals.css";
import { getPublicSettings } from "@/server/cms/public-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  const organizationName = settings.organizationName || "Ruang Rimba";
  const title = settings.seoTitle || `${organizationName} | Petualangan, Pembelajaran, dan Alam`;
  const description = settings.seoDescription || settings.description;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${organizationName}` },
    description,
    applicationName: organizationName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website", locale: "id_ID", url: "/", siteName: organizationName, title, description,
      images: [{ url: "/images/hero-rimba.png", width: 1536, height: 1024, alt: "Perjalanan bersama menyusuri hutan dan pegunungan" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/images/hero-rimba.png"] },
  };
}

export const viewport: Viewport = {
  themeColor: "#f4f3ec",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <a className="skip-link" href="#konten">Lewati ke konten</a>
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
