import assert from "node:assert/strict";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import { resolveSqliteUrl } from "@/lib/db/sqlite-url";

test("resolves a project-relative SQLite path against the working directory", () => {
  const workingDirectory = "/mnt/e/Projects/outdoor-adventure";
  assert.equal(
    resolveSqliteUrl("file:./prisma/ruang-rimba.db", workingDirectory),
    pathToFileURL(resolve(workingDirectory, "prisma/ruang-rimba.db")).href,
  );
});

test("keeps remote database URLs unchanged for migration tooling", () => {
  assert.equal(resolveSqliteUrl("postgresql://user:password@localhost/db"), "postgresql://user:password@localhost/db");
});
