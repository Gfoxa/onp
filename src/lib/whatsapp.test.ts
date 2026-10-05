import test from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppUrl } from "./whatsapp";

test("builds an encoded WhatsApp link from the configured organization number", () => {
  const url = buildWhatsAppUrl("6281234567890", "Halo, saya ingin konsultasi program.");
  assert.equal(url, "https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20konsultasi%20program.");
});

test("does not create a WhatsApp link when the organization number is missing or malformed", () => {
  assert.equal(buildWhatsAppUrl("", "Halo"), null);
  assert.equal(buildWhatsAppUrl("+62 (812) 123", "Halo"), null);
  assert.equal(buildWhatsAppUrl("6281234567890", ""), null);
});
