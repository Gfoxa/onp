import { z } from "zod";

const slug = z.string().min(1, "Slug wajib diisi.").max(120, "Slug maksimal 120 karakter.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Gunakan huruf kecil, angka, dan tanda hubung.");
const requiredText = (max = 5000) => z.string().trim().min(1, "Kolom ini wajib diisi.").max(max, "Teks terlalu panjang.");
const optionalText = (max = 2000) => z.string().trim().max(max).optional().or(z.literal(""));
const localImagePath = optionalText(1000).refine((value) => !value || (value.startsWith("/") && !value.startsWith("//") && !value.includes("..")), "Gunakan path gambar lokal yang dimulai dengan /.");
const optionalUrl = z.union([z.string().url().refine((value) => value.startsWith("https://"), "Tautan harus menggunakan HTTPS."), z.literal("")]).optional();
const dateOnly = z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => !Number.isNaN(Date.parse(value)) && new Date(`${value}T00:00:00.000Z`).toISOString().startsWith(value), "Tanggal tidak valid."), z.literal("")]).optional();
const status = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const programSchema = z.object({
  title: requiredText(160), slug, category: requiredText(100),
  shortDescription: requiredText(400), description: requiredText(),
  heroImage: localImagePath, heroImageAlt: optionalText(300),
  duration: optionalText(100), location: optionalText(200), participantCount: optionalText(100),
  difficulty: optionalText(100), activities: optionalText(), included: optionalText(),
  excluded: optionalText(), safety: optionalText(), status,
});

export const articleSchema = z.object({
  title: requiredText(180), slug, excerpt: requiredText(500), content: requiredText(),
  coverImage: localImagePath, coverImageAlt: optionalText(300), category: requiredText(100),
  authorName: optionalText(160), status,
});

export const galleryImageSchema = z.object({
  title: requiredText(160), imageUrl: z.string().min(1).max(1000).refine((value) => value.startsWith("/") && !value.startsWith("//") && !value.includes(".."), "Gunakan path gambar lokal yang dimulai dengan /."), alt: requiredText(300),
  caption: optionalText(500), category: requiredText(100), status,
});

export const teamMemberSchema = z.object({
  name: requiredText(160), role: requiredText(160), biography: requiredText(1000),
  photoUrl: localImagePath, photoAlt: optionalText(300), sortOrder: z.coerce.number().int().min(0).max(9999),
  status,
});

export const conservationProjectSchema = z.object({
  title: requiredText(180), slug, summary: requiredText(500), description: requiredText(),
  imageUrl: localImagePath, imageAlt: optionalText(300), location: optionalText(200),
  startedAt: dateOnly, status,
});

export const siteSettingsSchema = z.object({
  organizationName: requiredText(160), description: requiredText(1000), logoUrl: localImagePath,
  email: z.union([z.string().email(), z.literal("")]), phone: optionalText(80), whatsapp: z.union([z.string().regex(/^\d{8,15}$/), z.literal("")]).optional(),
  address: optionalText(500), operationalArea: optionalText(300), instagramUrl: optionalUrl,
  facebookUrl: optionalUrl, youtubeUrl: optionalUrl, seoTitle: requiredText(180),
  seoDescription: requiredText(300),
});

export type ProgramInput = z.infer<typeof programSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
