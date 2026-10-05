import test from "node:test";
import assert from "node:assert/strict";
import {
  contactSubmissionSchema,
  contactSubmissionStatusSchema,
  isContactRateLimited,
  isHoneypotFilled,
} from "./validation";

const validInput = {
  name: "  Dwi Pertiwi  ",
  email: "DWI.PERTIWI@example.id",
  phone: "+62 812-3456-7890",
  organization: "Komunitas Rimba",
  programType: "Team Building",
  participantCount: "24",
  plannedDate: "2026-11-14",
  message: "Kami ingin berdiskusi tentang kegiatan sehari bersama tim.",
};

test("normalizes a valid Indonesian program inquiry", () => {
  const result = contactSubmissionSchema.safeParse(validInput);
  assert.equal(result.success, true);
  if (!result.success) return;
  assert.equal(result.data.name, "Dwi Pertiwi");
  assert.equal(result.data.email, "dwi.pertiwi@example.id");
  assert.equal(result.data.participantCount, 24);
  assert.equal(result.data.plannedDate, "2026-11-14");
});

test("rejects malformed email, unsafe phone characters, invalid date and impossible participant count", () => {
  const result = contactSubmissionSchema.safeParse({
    ...validInput,
    email: "bukan-email",
    phone: "0812<script>",
    participantCount: "0",
    plannedDate: "2026-02-30",
  });
  assert.equal(result.success, false);
});

test("requires a useful message and limits submitted text", () => {
  assert.equal(contactSubmissionSchema.safeParse({ ...validInput, message: "Hai" }).success, false);
  assert.equal(contactSubmissionSchema.safeParse({ ...validInput, message: "x".repeat(3001) }).success, false);
});

test("accepts blank optional inquiry fields and strips unrecognized input", () => {
  const result = contactSubmissionSchema.safeParse({
    ...validInput,
    organization: "",
    programType: "",
    participantCount: "",
    plannedDate: "",
    role: "ADMIN",
    status: "COMPLETED",
  });
  assert.equal(result.success, true);
  if (!result.success) return;
  assert.equal(result.data.participantCount, null);
  assert.equal(result.data.plannedDate, null);
  assert.equal("status" in result.data, false);
});

test("identifies the honeypot and throttles repeat email submissions", () => {
  assert.equal(isHoneypotFilled(""), false);
  assert.equal(isHoneypotFilled("https://spam.example"), true);
  assert.equal(isContactRateLimited(2), false);
  assert.equal(isContactRateLimited(3), true);
});

test("allows only known admin inquiry statuses", () => {
  assert.equal(contactSubmissionStatusSchema.safeParse("CONTACTED").success, true);
  assert.equal(contactSubmissionStatusSchema.safeParse("DELETED").success, false);
});
