import assert from "node:assert/strict";
import test from "node:test";
import bcrypt from "bcryptjs";
import { authenticateAdmin, type AdminCredentialUser } from "./credentials";

const password = "OutdoorLearning-Dev-2026";
async function sampleAdmin(): Promise<AdminCredentialUser> {
  return { id: "admin-id", email: "admin@example.test", name: "Admin Demo", role: "ADMIN", passwordHash: await bcrypt.hash(password, 4) };
}

test("authenticates a matching admin email and password", async () => {
  const admin = await sampleAdmin();
  const user = await authenticateAdmin({ email: " ADMIN@example.test ", password }, async () => admin);
  assert.equal(user?.id, admin.id);
  assert.equal(user?.role, "ADMIN");
});

test("rejects invalid passwords, non-admin users and malformed credentials", async () => {
  const admin = await sampleAdmin();
  assert.equal(await authenticateAdmin({ email: admin.email, password: "wrong" }, async () => admin), null);
  assert.equal(await authenticateAdmin({ email: admin.email, password }, async () => ({ ...admin, role: "EDITOR" })), null);
  assert.equal(await authenticateAdmin({ email: "invalid", password }, async () => admin), null);
  assert.equal(await authenticateAdmin({ email: admin.email, password }, async () => null), null);
});
