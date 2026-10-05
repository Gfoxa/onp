import assert from "node:assert/strict";
import test from "node:test";
import { canonicalUrl, pageMetadata, robotsForDemoContent } from "@/lib/seo";

test("canonical URLs retain the requested route under a configured site origin", () => {
  assert.equal(canonicalUrl("https://ruangrimba.example/", "/program/kelas-alam"), "https://ruangrimba.example/program/kelas-alam");
});

test("canonical URLs normalize trailing slashes and ignore query strings", () => {
  assert.equal(canonicalUrl("https://ruangrimba.example///", "/kontak/?program=camp"), "https://ruangrimba.example/kontak");
});

test("demo content is excluded from search indexing", () => {
  assert.deepEqual(robotsForDemoContent(true), { index: false, follow: false });
  assert.equal(robotsForDemoContent(false), undefined);
});

test("page metadata uses route-specific Open Graph and X card content", () => {
  const metadata = pageMetadata("Program Outdoor", "Jelajahi kegiatan alam.", "/program");
  assert.deepEqual(metadata.alternates, { canonical: "/program" });
  assert.deepEqual(metadata.openGraph, {
    title: "Program Outdoor | Ruang Rimba",
    description: "Jelajahi kegiatan alam.",
    url: "/program",
    images: [{ url: "/images/hero-rimba.png", alt: "Ilustrasi alam Ruang Rimba" }],
  });
  assert.deepEqual(metadata.twitter, {
    card: "summary_large_image",
    title: "Program Outdoor | Ruang Rimba",
    description: "Jelajahi kegiatan alam.",
    images: ["/images/hero-rimba.png"],
  });
});
