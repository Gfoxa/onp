import { CmsManager, type AdminField } from "@/components/admin/cms-manager";
import { saveSettings } from "../actions";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
const fields: AdminField[] = [
  { name: "organizationName", label: "Nama organisasi", required: true }, { name: "description", label: "Deskripsi", kind: "textarea", required: true },
  { name: "logoUrl", label: "URL/path logo" }, { name: "email", label: "Email", kind: "text" }, { name: "phone", label: "Telepon" },
  { name: "whatsapp", label: "WhatsApp (format internasional, tanpa +)" }, { name: "address", label: "Alamat", kind: "textarea" },
  { name: "operationalArea", label: "Area operasional" }, { name: "instagramUrl", label: "Instagram" },
  { name: "facebookUrl", label: "Facebook" }, { name: "youtubeUrl", label: "YouTube" },
  { name: "seoTitle", label: "Judul SEO", required: true }, { name: "seoDescription", label: "Deskripsi SEO", kind: "textarea", required: true },
];

export default async function SettingsAdminPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { error, saved } = await searchParams;
  let values: Record<string, string> = {};
  let dbError = false;
  try { values = Object.fromEntries((await prisma.siteSetting.findMany()).map(({ key, value }) => [key, value])); }
  catch { dbError = true; }
  const rows = [{ id: "settings", status: "Aktif", ...Object.fromEntries(fields.map(({ name }) => [name, values[name] ?? (name === "organizationName" ? "[Nama Organisasi]" : name === "seoTitle" ? "Outbound & Konservasi Alam | Ruang Rimba" : "")])) }];
  return <CmsManager title="Pengaturan situs" description="Informasi ini digunakan pada konten publik dan metadata situs." fields={fields} rows={rows} action={saveSettings} allowArchive={false} error={error || (dbError ? "Database belum tersedia. Pengaturan belum dapat dimuat." : saved ? "Pengaturan berhasil disimpan." : undefined)} />;
}
