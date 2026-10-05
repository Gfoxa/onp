import assert from "node:assert/strict";
import test from "node:test";
import { resolveSlug, slugify } from "./slug";

test("slugifies Indonesian text and accents", () => {
  assert.equal(slugify("Petualangan di Hutan & Sungai!"), "petualangan-di-hutan-sungai");
  assert.equal(slugify("Konservasi Pohon: Aksi Bersama"), "konservasi-pohon-aksi-bersama");
});

test("returns an empty slug for blank input", () => {
  assert.equal(slugify("   "), "");
});

test("generates a missing content slug from its title", () => {
  assert.equal(resolveSlug("Jelajah Hutan Bersama", ""), "jelajah-hutan-bersama");
  assert.equal(resolveSlug("Judul baru", "custom-slug"), "custom-slug");
});
