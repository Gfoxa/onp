import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import { resolveSqliteUrl } from "./sqlite-url";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const databaseUrl = process.env.DATABASE_URL ?? "file:./prisma/ruang-rimba.db";

function createPrismaClient() {
  return new PrismaClient({ adapter: new PrismaLibSql({ url: resolveSqliteUrl(databaseUrl) }) });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
