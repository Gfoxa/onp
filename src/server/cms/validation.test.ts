import assert from "node:assert/strict";
import test from "node:test";
import { articleSchema, conservationProjectSchema, galleryImageSchema, programSchema, siteSettingsSchema } from "./validation";

test("program requires a valid title, slug, category and description", () => {
  assert.equal(programSchema.safeParse({
    title: "Team Building di Alam",
    slug: "team-building-di-alam",
    category: "Team Building",
    shortDescription: "Belajar bersama di ruang terbuka.",
    description: "Program contoh untuk kelompok.",
    status: "DRAFT",
  }).success, true);
  assert.equal(programSchema.safeParse({ title: "" }).success, false);
});

test("article rejects invalid slugs and accepts draft content", () => {
  assert.equal(articleSchema.safeParse({
    title: "Belajar dari Sungai",
    slug: "belajar-dari-sungai",
    excerpt: "Cerita edukasi lingkungan.",
    content: "Konten contoh yang dapat diperbarui.",
    category: "Edukasi",
    status: "DRAFT",
  }).success, true);
  assert.equal(articleSchema.safeParse({
    title: "Belajar",
    slug: "Invalid Slug",
    excerpt: "Ringkasan",
    content: "Isi",
    category: "Edukasi",
    status: "DRAFT",
  }).success, false);
});

test("gallery content requires a local image path and descriptive alt text", () => {
  const image = { title: "Kegiatan demo", imageUrl: "/images/example.svg", alt: "Ilustrasi kegiatan kelompok", category: "Edukasi", status: "DRAFT" };
  assert.equal(galleryImageSchema.safeParse(image).success, true);
  assert.equal(galleryImageSchema.safeParse({ ...image, imageUrl: "https://external.example/image.jpg" }).success, false);
  assert.equal(galleryImageSchema.safeParse({ ...image, alt: "" }).success, false);
});

test("site settings reject unsafe social links and malformed WhatsApp numbers", () => {
  const settings = { organizationName: "[Nama Organisasi]", description: "Deskripsi demo.", email: "", whatsapp: "628123456789", address: "", operationalArea: "", instagramUrl: "https://instagram.com/example", facebookUrl: "", youtubeUrl: "", seoTitle: "Judul SEO demo", seoDescription: "Deskripsi SEO demo" };
  assert.equal(siteSettingsSchema.safeParse(settings).success, true);
  assert.equal(siteSettingsSchema.safeParse({ ...settings, instagramUrl: "javascript:alert(1)" }).success, false);
  assert.equal(siteSettingsSchema.safeParse({ ...settings, whatsapp: "62812abc" }).success, false);
});

test("conservation projects reject impossible calendar dates", () => {
  const project = { title: "Demo proyek", slug: "demo-proyek", summary: "Ringkasan demo", description: "Deskripsi demo", status: "DRAFT" };
  assert.equal(conservationProjectSchema.safeParse({ ...project, startedAt: "2026-10-02" }).success, true);
  assert.equal(conservationProjectSchema.safeParse({ ...project, startedAt: "2026-02-31" }).success, false);
});
