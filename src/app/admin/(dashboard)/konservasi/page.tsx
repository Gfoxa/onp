import { CmsManager, type AdminField } from "@/components/admin/cms-manager";
import { saveConservationProject } from "../actions";
import { prisma } from "@/lib/db/prisma";
import { toAdminRows } from "@/server/cms/admin-view";

export const dynamic = "force-dynamic";
const fields: AdminField[] = [
  { name: "title", label: "Nama proyek", required: true }, { name: "slug", label: "Slug URL", required: true },
  { name: "summary", label: "Ringkasan", kind: "textarea", required: true }, { name: "description", label: "Deskripsi", kind: "textarea", required: true },
  { name: "imageUrl", label: "URL/path gambar" }, { name: "imageAlt", label: "Teks alternatif" },
  { name: "location", label: "Lokasi" }, { name: "startedAt", label: "Tanggal mulai", kind: "date" },
  { name: "status", label: "Status", kind: "select", options: ["DRAFT", "PUBLISHED", "ARCHIVED"] },
];
export default async function ConservationAdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  let rows = [] as Awaited<ReturnType<typeof prisma.conservationProject.findMany>>;
  let dbError = false;
  try { rows = await prisma.conservationProject.findMany({ orderBy: { updatedAt: "desc" } }); }
  catch { dbError = true; }
  return <CmsManager title="Konservasi" description="Dokumentasikan proyek yang telah diverifikasi sebelum ditampilkan ke publik." fields={fields} rows={toAdminRows(rows)} action={saveConservationProject} error={error || (dbError ? "Database belum tersedia. Atur DATABASE_URL dan jalankan migrasi." : undefined)} />;
}
