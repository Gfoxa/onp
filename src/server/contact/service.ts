import { prisma } from "@/lib/db/prisma";
import { type ContactSubmissionInput, type ContactSubmissionStatus } from "./validation";

const submissionsPerEmailPerHour = 3;
const contactWindowMs = 60 * 60 * 1000;

export async function createContactSubmission(input: ContactSubmissionInput) {
  return prisma.$transaction(async (transaction) => {
    const now = Date.now();
    const cutoff = BigInt(now - contactWindowMs);
    const result = await transaction.$queryRaw<Array<{ count: number }>>`
      INSERT INTO "ContactRateLimit" ("email", "windowStartedAt", "count")
      VALUES (${input.email}, ${BigInt(now)}, 1)
      ON CONFLICT ("email") DO UPDATE SET
        "count" = CASE WHEN "ContactRateLimit"."windowStartedAt" <= ${cutoff} THEN 1 ELSE "ContactRateLimit"."count" + 1 END,
        "windowStartedAt" = CASE WHEN "ContactRateLimit"."windowStartedAt" <= ${cutoff} THEN ${BigInt(now)} ELSE "ContactRateLimit"."windowStartedAt" END
      WHERE "ContactRateLimit"."windowStartedAt" <= ${cutoff} OR "ContactRateLimit"."count" < ${submissionsPerEmailPerHour}
      RETURNING "count"
    `;
    if (result.length === 0) return "RATE_LIMITED" as const;

    await transaction.contactRateLimit.deleteMany({ where: { windowStartedAt: { lte: cutoff } } });

    await transaction.contactSubmission.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        organization: input.organization || null,
        programType: input.programType || null,
        participantCount: input.participantCount,
        plannedDate: input.plannedDate ? new Date(`${input.plannedDate}T00:00:00.000Z`) : null,
        message: input.message,
      },
    });
    return "CREATED" as const;
  });
}

export async function updateContactSubmissionStatus(id: string, status: ContactSubmissionStatus, actorId: string) {
  return prisma.$transaction(async (transaction) => {
    const existing = await transaction.contactSubmission.findUnique({ where: { id }, select: { id: true, status: true } });
    if (!existing) return false;
    if (existing.status === status) return true;

    await transaction.contactSubmission.update({ where: { id }, data: { status } });
    await transaction.auditLog.create({
      data: {
        actorId,
        operation: "UPDATE_STATUS",
        entity: "ContactSubmission",
        entityId: id,
        details: { from: existing.status, to: status },
      },
    });
    return true;
  });
}
