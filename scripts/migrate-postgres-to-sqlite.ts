import { config } from "dotenv";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { Prisma, PrismaClient } from "@prisma/client";
import { Client } from "pg";
import { resolveSqliteUrl } from "../src/lib/db/sqlite-url";

config({ path: ".env.local" });
config();

type Row = Record<string, unknown>;
type Target = Prisma.TransactionClient;
type CopyStep = {
  table: string;
  count: (target: Target) => Promise<number>;
  insert: (target: Target, rows: Row[]) => Promise<number>;
};

const steps: CopyStep[] = [
  { table: "User", count: (db) => db.user.count(), insert: async (db, rows) => (await db.user.createMany({ data: rows as unknown as Prisma.UserCreateManyInput[] })).count },
  { table: "ProgramCategory", count: (db) => db.programCategory.count(), insert: async (db, rows) => (await db.programCategory.createMany({ data: rows as unknown as Prisma.ProgramCategoryCreateManyInput[] })).count },
  { table: "ArticleCategory", count: (db) => db.articleCategory.count(), insert: async (db, rows) => (await db.articleCategory.createMany({ data: rows as unknown as Prisma.ArticleCategoryCreateManyInput[] })).count },
  { table: "GalleryCategory", count: (db) => db.galleryCategory.count(), insert: async (db, rows) => (await db.galleryCategory.createMany({ data: rows as unknown as Prisma.GalleryCategoryCreateManyInput[] })).count },
  { table: "Account", count: (db) => db.account.count(), insert: async (db, rows) => (await db.account.createMany({ data: rows as unknown as Prisma.AccountCreateManyInput[] })).count },
  { table: "Session", count: (db) => db.session.count(), insert: async (db, rows) => (await db.session.createMany({ data: rows as unknown as Prisma.SessionCreateManyInput[] })).count },
  { table: "VerificationToken", count: (db) => db.verificationToken.count(), insert: async (db, rows) => (await db.verificationToken.createMany({ data: rows as unknown as Prisma.VerificationTokenCreateManyInput[] })).count },
  { table: "Program", count: (db) => db.program.count(), insert: async (db, rows) => (await db.program.createMany({ data: rows as unknown as Prisma.ProgramCreateManyInput[] })).count },
  { table: "Article", count: (db) => db.article.count(), insert: async (db, rows) => (await db.article.createMany({ data: rows as unknown as Prisma.ArticleCreateManyInput[] })).count },
  { table: "GalleryImage", count: (db) => db.galleryImage.count(), insert: async (db, rows) => (await db.galleryImage.createMany({ data: rows as unknown as Prisma.GalleryImageCreateManyInput[] })).count },
  { table: "TeamMember", count: (db) => db.teamMember.count(), insert: async (db, rows) => (await db.teamMember.createMany({ data: rows as unknown as Prisma.TeamMemberCreateManyInput[] })).count },
  { table: "ConservationProject", count: (db) => db.conservationProject.count(), insert: async (db, rows) => (await db.conservationProject.createMany({ data: rows as unknown as Prisma.ConservationProjectCreateManyInput[] })).count },
  { table: "ContactSubmission", count: (db) => db.contactSubmission.count(), insert: async (db, rows) => (await db.contactSubmission.createMany({ data: rows as unknown as Prisma.ContactSubmissionCreateManyInput[] })).count },
  { table: "SiteSetting", count: (db) => db.siteSetting.count(), insert: async (db, rows) => (await db.siteSetting.createMany({ data: rows as unknown as Prisma.SiteSettingCreateManyInput[] })).count },
  { table: "FAQ", count: (db) => db.fAQ.count(), insert: async (db, rows) => (await db.fAQ.createMany({ data: rows as unknown as Prisma.FAQCreateManyInput[] })).count },
  { table: "AuditLog", count: (db) => db.auditLog.count(), insert: async (db, rows) => (await db.auditLog.createMany({ data: rows as unknown as Prisma.AuditLogCreateManyInput[] })).count },
];

async function main() {
  const sourceUrl = process.env.POSTGRES_SOURCE_URL;
  const targetUrl = process.env.DATABASE_URL;
  if (!sourceUrl?.startsWith("postgres")) throw new Error("POSTGRES_SOURCE_URL must point to the source PostgreSQL database.");
  if (!targetUrl?.startsWith("file:")) throw new Error("DATABASE_URL must point to the target SQLite file.");

  const source = new Client({ connectionString: sourceUrl });
  const target = new PrismaClient({ adapter: new PrismaLibSql({ url: resolveSqliteUrl(targetUrl) }) });
  try {
    await source.connect();
    const existingCounts = await Promise.all([
      ...steps.map((step) => step.count(target)),
      target.contactRateLimit.count(),
    ]);
    if (existingCounts.some((count) => count > 0)) {
      throw new Error("The SQLite target already contains application records. Use a fresh migrated database before copying.");
    }

    const sourceData: Array<{ table: string; rows: Row[] }> = [];
    for (const { table } of steps) {
      const result = await source.query<Row>(`SELECT * FROM "${table}"`);
      sourceData.push({ table, rows: result.rows });
    }

    const copiedCounts = await target.$transaction(async (transaction) => {
      const counts: number[] = [];
      for (let index = 0; index < steps.length; index += 1) {
        const step = steps[index]!;
        const data = sourceData[index]!;
        if (data.table !== step.table) throw new Error("Migration table order mismatch.");
        counts.push(data.rows.length ? await step.insert(transaction, data.rows) : 0);
      }
      return counts;
    }, { maxWait: 30_000, timeout: 300_000 });

    for (let index = 0; index < steps.length; index += 1) {
      console.log(`${steps[index]!.table}: ${sourceData[index]!.rows.length} → ${copiedCounts[index]}`);
    }
  } finally {
    await source.end().catch(() => undefined);
    await target.$disconnect();
  }
}

main().catch((error: unknown) => {
  const errorName = error instanceof Error ? error.name : "UnknownError";
  console.error(`PostgreSQL to SQLite copy failed (${errorName}). The PostgreSQL source was not changed.`);
  process.exitCode = 1;
});
