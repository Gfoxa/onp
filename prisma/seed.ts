import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import { resolveSqliteUrl } from "../src/lib/db/sqlite-url";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL harus diatur sebelum menjalankan seed.");
const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: resolveSqliteUrl(connectionString) }) });

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) {
    throw new Error("Atur ADMIN_EMAIL dan ADMIN_PASSWORD (minimal 12 karakter) untuk membuat admin.");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: { email, name: "Administrator", passwordHash, role: "ADMIN" },
  });

  if (process.env.SEED_DEMO_CONTENT !== "true") return;
  const programCategory = await prisma.programCategory.upsert({
    where: { slug: "team-building" }, update: {}, create: { name: "Team Building", slug: "team-building" },
  });
  await prisma.program.upsert({
    where: { slug: "contoh-outbound-team-building" }, update: {},
    create: {
      title: "[DEMO] Outbound & Team Building", slug: "contoh-outbound-team-building",
      categoryId: programCategory.id,
      shortDescription: "Contoh program yang perlu disesuaikan dengan kebutuhan organisasi.",
      description: "Konten demo. Ganti detail program, lokasi, durasi, dan informasi keselamatan sebelum publikasi.",
      status: "DRAFT",
    },
  });
  const articleCategory = await prisma.articleCategory.upsert({
    where: { slug: "edukasi" }, update: {}, create: { name: "Edukasi", slug: "edukasi" },
  });
  await prisma.article.upsert({
    where: { slug: "demo-belajar-di-alam" }, update: {},
    create: {
      title: "[DEMO] Belajar di Alam", slug: "demo-belajar-di-alam",
      excerpt: "Artikel contoh untuk diganti dengan cerita organisasi.",
      content: "Konten demo. Tambahkan informasi yang sudah diverifikasi sebelum menerbitkan artikel.",
      categoryId: articleCategory.id, status: "DRAFT",
    },
  });
}

main().finally(async () => prisma.$disconnect());
