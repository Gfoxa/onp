import type { Metadata } from "next";

export function canonicalUrl(siteUrl: string, pathname: string): string {
  const url = new URL(siteUrl);
  const path = pathname.split(/[?#]/, 1)[0] || "/";
  url.pathname = path.startsWith("/") ? path : `/${path}`;
  url.search = "";
  url.hash = "";
  if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, "");
  return url.toString();
}

export function robotsForDemoContent(isDemo: boolean): Metadata["robots"] {
  return isDemo ? { index: false, follow: false } : undefined;
}

export function pageMetadata(title: string, description: string, pathname: string): Metadata {
  const socialTitle = `${title} | Ruang Rimba`;
  const image = "/images/hero-rimba.png";
  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: { title: socialTitle, description, url: pathname, images: [{ url: image, alt: "Ilustrasi alam Ruang Rimba" }] },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [image] },
  };
}
