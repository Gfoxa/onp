import "server-only";
import { prisma } from "@/lib/db/prisma";
import { organization } from "@/lib/content";
import { articles as demoArticles, getArticle as getDemoArticle, type Article } from "@/lib/articles";
import { getProgram as getDemoProgram, programs as demoPrograms, type Program } from "@/lib/programs";

function lines(value: string | null | undefined) { return value?.split("\n").map((line) => line.trim()).filter(Boolean) ?? []; }
function cmsProgram(row: Awaited<ReturnType<typeof prisma.program.findFirst>> & { category?: { name: string } | null }): Program | null {
  if (!row) return null;
  const activities = lines(row.activities);
  const fallbackImage = "/images/program-adventure.svg";
  return {
    slug: row.slug, title: row.title, category: row.category?.name ?? "Program",
    image: row.heroImage || fallbackImage, imageAlt: row.heroImageAlt || `Gambar ${row.title}`,
    excerpt: row.shortDescription, description: [row.description], duration: row.duration || "Informasi menyusul",
    participants: row.participantCount || "Informasi menyusul", location: row.location || "Informasi menyusul",
    difficulty: row.difficulty || "Informasi menyusul", highlights: activities.slice(0, 3), activities,
    schedule: [], included: lines(row.included), excluded: lines(row.excluded), safety: lines(row.safety), gallery: [],
  };
}
function cmsArticle(row: NonNullable<Awaited<ReturnType<typeof prisma.article.findFirst>>> & { category?: { name: string } | null }): Article {
  const body = row.content.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
  return {
    slug: row.slug, title: row.title, excerpt: row.excerpt, category: row.category?.name ?? "Artikel",
    coverImage: row.coverImage || "/images/story-nature.svg", coverAlt: row.coverImageAlt || `Gambar ${row.title}`,
    author: row.authorName || "Tim Ruang Rimba", publishedAt: row.publishedAt?.toLocaleDateString("id-ID") ?? "",
    sections: [{ heading: row.title, paragraphs: body }],
  };
}

export async function getPublicPrograms() {
  try {
    const rows = await prisma.program.findMany({ where: { status: "PUBLISHED" }, include: { category: true }, orderBy: { publishedAt: "desc" } });
    if (rows.length) return { items: rows.map((row) => cmsProgram(row)).filter((row): row is Program => row !== null), isDemo: false };
  } catch { /* Use the clearly labeled demo fixture when the local database is unavailable. */ }
  return { items: demoPrograms, isDemo: true };
}

export async function getPublicProgram(slug: string) {
  try {
    const [row, count] = await Promise.all([
      prisma.program.findFirst({ where: { slug, status: "PUBLISHED" }, include: { category: true } }),
      prisma.program.count({ where: { status: "PUBLISHED" } }),
    ]);
    if (row) return { item: cmsProgram(row), isDemo: false };
    if (count > 0) return { item: null, isDemo: false };
  } catch { /* Use fixtures when the CMS database has not been configured. */ }
  return { item: getDemoProgram(slug) ?? null, isDemo: true };
}

export async function getPublicArticles() {
  try {
    const rows = await prisma.article.findMany({ where: { status: "PUBLISHED" }, include: { category: true }, orderBy: { publishedAt: "desc" } });
    if (rows.length) return { items: rows.map(cmsArticle), isDemo: false };
  } catch { /* Use the clearly labeled demo fixture when the local database is unavailable. */ }
  return { items: demoArticles, isDemo: true };
}

export async function getPublicArticle(slug: string) {
  try {
    const [row, count] = await Promise.all([
      prisma.article.findFirst({ where: { slug, status: "PUBLISHED" }, include: { category: true } }),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
    ]);
    if (row) return { item: cmsArticle(row), isDemo: false };
    if (count > 0) return { item: null, isDemo: false };
  } catch { /* Use fixtures when the CMS database has not been configured. */ }
  return { item: getDemoArticle(slug) ?? null, isDemo: true };
}

export async function getPublicSettings() {
  const values: Record<string, string> = {
    organizationName: organization.name,
    description: organization.description,
    seoTitle: "Outbound & Konservasi Alam | Ruang Rimba",
    seoDescription: "Bertualang, belajar, dan menjaga alam bersama. Konten demo yang dapat disesuaikan organisasi.",
    email: process.env.NEXT_PUBLIC_ORGANIZATION_EMAIL ?? "",
    phone: "",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
    address: process.env.NEXT_PUBLIC_ORGANIZATION_ADDRESS ?? "",
    operationalArea: "",
    instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
    youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "",
  };
  try {
    const settings = await prisma.siteSetting.findMany();
    for (const { key, value } of settings) values[key] = value;
  } catch { /* Environment placeholders remain available before database setup. */ }
  return values;
}

export async function getPublicGallery() {
  try {
    const rows = await prisma.galleryImage.findMany({
      where: { status: "PUBLISHED" }, include: { category: true }, orderBy: { publishedAt: "desc" },
    });
    if (rows.length) return {
      items: rows.map((row) => ({
        id: row.id, title: row.title, category: row.category?.name ?? "Komunitas",
        image: row.imageUrl, alt: row.alt, caption: row.caption ?? "",
      })), isDemo: false,
    };
  } catch { /* Use the clearly labeled demo gallery when the local database is unavailable. */ }
  const { galleryItems } = await import("@/lib/gallery");
  return { items: galleryItems, isDemo: true };
}

export async function getPublicTeam() {
  try {
    return await prisma.teamMember.findMany({ where: { status: "PUBLISHED" }, orderBy: { sortOrder: "asc" } });
  } catch { return []; }
}

export async function getPublicConservationProjects() {
  try {
    return await prisma.conservationProject.findMany({ where: { status: "PUBLISHED" }, orderBy: { startedAt: "desc" } });
  } catch { return []; }
}
