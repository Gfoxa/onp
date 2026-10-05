import test from "node:test";
import assert from "node:assert/strict";
import { config } from "dotenv";
import { contactSubmissionSchema } from "./validation";

test("contact storage throttles concurrent repeats and audits admin status changes", async () => {
  config({ path: ".env.local" });
  const [{ prisma }, { createContactSubmission, updateContactSubmissionStatus }] = await Promise.all([
    import("@/lib/db/prisma"),
    import("./service"),
  ]);
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const email = `phase4-${suffix}@example.com`;
  const adminEmail = `phase4-admin-${suffix}@example.com`;
  let testUserId: string | undefined;
  let submissionIds: string[] = [];

  try {
    const admin = await prisma.user.create({ data: { email: adminEmail, role: "ADMIN" } });
    testUserId = admin.id;
    const input = contactSubmissionSchema.parse({
      name: "Tes Integrasi",
      email,
      phone: "+62 812 3456 7890",
      organization: "Ruang Uji",
      programType: "Team Building",
      participantCount: "12",
      plannedDate: "2026-11-14",
      message: "Permintaan sementara untuk menguji alur kontak.",
    });

    const concurrentResults = await Promise.all(Array.from({ length: 4 }, () => createContactSubmission(input)));
    assert.equal(concurrentResults.filter((result) => result === "CREATED").length, 3);
    assert.equal(concurrentResults.filter((result) => result === "RATE_LIMITED").length, 1);

    const submissions = await prisma.contactSubmission.findMany({ where: { email }, orderBy: { createdAt: "asc" } });
    submissionIds = submissions.map(({ id }) => id);
    assert.equal(submissions.length, 3);
    assert.equal(submissions[0]?.plannedDate?.toISOString().slice(0, 10), "2026-11-14");
    const rateLimit = await prisma.contactRateLimit.findUnique({ where: { email } });
    assert.equal(rateLimit?.count, 3);

    assert.equal(await updateContactSubmissionStatus(submissions[0]!.id, "CONTACTED", admin.id), true);
    const [updated, audit] = await Promise.all([
      prisma.contactSubmission.findUnique({ where: { id: submissions[0]!.id } }),
      prisma.auditLog.findFirst({ where: { entity: "ContactSubmission", entityId: submissions[0]!.id } }),
    ]);
    assert.equal(updated?.status, "CONTACTED");
    assert.equal(audit?.actorId, admin.id);
    assert.equal(audit?.operation, "UPDATE_STATUS");
  } finally {
    const created = await prisma.contactSubmission.findMany({ where: { email }, select: { id: true } });
    submissionIds = created.map(({ id }) => id);
    if (submissionIds.length) await prisma.auditLog.deleteMany({ where: { entity: "ContactSubmission", entityId: { in: submissionIds } } });
    await prisma.contactSubmission.deleteMany({ where: { email } });
    await prisma.contactRateLimit.deleteMany({ where: { email } });
    if (testUserId) await prisma.user.delete({ where: { id: testUserId } });
    await prisma.$disconnect();
  }
});
