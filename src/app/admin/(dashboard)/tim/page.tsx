import { CmsManager, type AdminField } from "@/components/admin/cms-manager";
import { saveTeamMember } from "../actions";
import { prisma } from "@/lib/db/prisma";
import { toAdminRows } from "@/server/cms/admin-view";

export const dynamic = "force-dynamic";
const fields: AdminField[] = [
  { name: "name", label: "Nama", required: true }, { name: "role", label: "Peran", required: true },
  { name: "biography", label: "Biografi singkat", kind: "textarea", required: true }, { name: "photoUrl", label: "URL/path foto" },
  { name: "photoAlt", label: "Teks alternatif" }, { name: "sortOrder", label: "Urutan", kind: "number", required: true },
  { name: "status", label: "Status", kind: "select", options: ["DRAFT", "PUBLISHED", "ARCHIVED"] },
];
export default async function TeamAdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  let rows = [] as Awaited<ReturnType<typeof prisma.teamMember.findMany>>;
  let dbError = false;
  try { rows = await prisma.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] }); }
  catch { dbError = true; }
  return <CmsManager title="Tim" description="Kelola profil tim setelah identitas dan biografi disetujui anggota terkait." fields={fields} rows={toAdminRows(rows)} action={saveTeamMember} error={error || (dbError ? "Database belum tersedia. Atur DATABASE_URL dan jalankan migrasi." : undefined)} />;
}
