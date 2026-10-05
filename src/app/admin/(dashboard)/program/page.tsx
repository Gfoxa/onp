import { CmsManager, type AdminField } from "@/components/admin/cms-manager";
import { saveProgram } from "../actions";
import { prisma } from "@/lib/db/prisma";
import { toAdminRows } from "@/server/cms/admin-view";

export const dynamic = "force-dynamic";
const fields: AdminField[] = [
  { name: "title", label: "Nama program", required: true }, { name: "slug", label: "Slug URL", required: true, hint: "huruf kecil dan tanda hubung" },
  { name: "category", label: "Kategori", required: true }, { name: "shortDescription", label: "Deskripsi singkat", kind: "textarea", required: true },
  { name: "description", label: "Deskripsi lengkap", kind: "textarea", required: true }, { name: "heroImage", label: "Path gambar lokal (/images/...)" },
  { name: "heroImageAlt", label: "Teks alternatif gambar" }, { name: "duration", label: "Durasi" }, { name: "location", label: "Lokasi" },
  { name: "participantCount", label: "Jumlah peserta" }, { name: "difficulty", label: "Tingkat kesulitan" },
  { name: "activities", label: "Aktivitas (satu per baris)", kind: "textarea" }, { name: "included", label: "Termasuk (satu per baris)", kind: "textarea" },
  { name: "excluded", label: "Tidak termasuk (satu per baris)", kind: "textarea" }, { name: "safety", label: "Informasi keselamatan", kind: "textarea" },
  { name: "status", label: "Status", kind: "select", options: ["DRAFT", "PUBLISHED", "ARCHIVED"] },
];

export default async function ProgramAdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  let rows = [] as Awaited<ReturnType<typeof prisma.program.findMany<{ include: { category: true } }>>>;
  let dbError = false;
  try { rows = await prisma.program.findMany({ include: { category: true }, orderBy: { updatedAt: "desc" } }); }
  catch { dbError = true; }
  return <CmsManager title="Program" description="Kelola deskripsi, spesifikasi, kategori, dan status publikasi program." fields={fields} rows={toAdminRows(rows)} action={saveProgram} error={error || (dbError ? "Database belum tersedia. Atur DATABASE_URL dan jalankan migrasi." : undefined)} />;
}
