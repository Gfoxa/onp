import assert from "node:assert/strict";
import test from "node:test";
import { isAdminRole } from "./roles";

test("accepts only the administrator role", () => {
  assert.equal(isAdminRole("ADMIN"), true);
  assert.equal(isAdminRole("USER"), false);
  assert.equal(isAdminRole(undefined), false);
});
