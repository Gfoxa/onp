import { CmsManager, type AdminField } from "@/components/admin/cms-manager";
import { saveGalleryImage } from "../actions";
import { prisma } from "@/lib/db/prisma";
import { toAdminRows } from "@/server/cms/admin-view";

export const dynamic = "force-dynamic";
const fields: AdminField[] = [
  { name: "title", label: "Nama kegiatan", required: true }, { name: "imageUrl", label: "Path gambar lokal (/images/...)", required: true },
  { name: "alt", label: "Teks alternatif", required: true }, { name: "caption", label: "Keterangan" },
  { name: "category", label: "Kategori", required: true }, { name: "status", label: "Status", kind: "select", options: ["DRAFT", "PUBLISHED", "ARCHIVED"] },
];
export default async function GalleryAdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  let rows = [] as Awaited<ReturnType<typeof prisma.galleryImage.findMany<{ include: { category: true } }>>>;
  let dbError = false;
  try { rows = await prisma.galleryImage.findMany({ include: { category: true }, orderBy: { updatedAt: "desc" } }); }
  catch { dbError = true; }
  return <CmsManager title="Galeri" description="Tambahkan dokumentasi berizin dengan caption dan kategori." fields={fields} rows={toAdminRows(rows)} action={saveGalleryImage} error={error || (dbError ? "Database belum tersedia. Atur DATABASE_URL dan jalankan migrasi." : undefined)} />;
}
