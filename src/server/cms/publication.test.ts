import assert from "node:assert/strict";
import test from "node:test";
import { nextPublishedAt } from "./publication";

test("publication date is retained while content remains published", () => {
  const original = new Date("2026-01-01T00:00:00.000Z");
  assert.equal(nextPublishedAt("PUBLISHED", original), original);
});

test("draft/archived content has no public date; new publication gets one", () => {
  const now = new Date("2026-10-02T00:00:00.000Z");
  assert.equal(nextPublishedAt("DRAFT", now), null);
  assert.equal(nextPublishedAt("ARCHIVED", now), null);
  assert.equal(nextPublishedAt("PUBLISHED", null, now), now);
});
