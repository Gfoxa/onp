import { CmsManager, type AdminField } from "@/components/admin/cms-manager";
import { saveArticle } from "../actions";
import { prisma } from "@/lib/db/prisma";
import { toAdminRows } from "@/server/cms/admin-view";

export const dynamic = "force-dynamic";
const fields: AdminField[] = [
  { name: "title", label: "Judul artikel", required: true }, { name: "slug", label: "Slug URL", required: true },
  { name: "excerpt", label: "Ringkasan", kind: "textarea", required: true }, { name: "content", label: "Isi artikel", kind: "textarea", required: true },
  { name: "coverImage", label: "Path gambar lokal (/images/...)" }, { name: "coverImageAlt", label: "Teks alternatif gambar" },
  { name: "category", label: "Kategori", required: true }, { name: "authorName", label: "Nama penulis" },
  { name: "status", label: "Status", kind: "select", options: ["DRAFT", "PUBLISHED", "ARCHIVED"] },
];
export default async function ArticlesAdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  let rows = [] as Awaited<ReturnType<typeof prisma.article.findMany<{ include: { category: true } }>>>;
  let dbError = false;
  try { rows = await prisma.article.findMany({ include: { category: true }, orderBy: { updatedAt: "desc" } }); }
  catch { dbError = true; }
  return <CmsManager title="Artikel" description="Tulis dan terbitkan artikel edukasi, konservasi, dan cerita komunitas." fields={fields} rows={toAdminRows(rows)} action={saveArticle} error={error || (dbError ? "Database belum tersedia. Atur DATABASE_URL dan jalankan migrasi." : undefined)} />;
}
