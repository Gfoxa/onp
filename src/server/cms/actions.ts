"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/server/auth/require-admin";
import { adminPath, CmsValidationError, saveCmsEntity, saveSiteSettings, type CmsEntity } from "./service";

function safeError(error: unknown) {
  if (error instanceof CmsValidationError) return error.message;
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return "Slug atau data serupa sudah digunakan. Periksa kembali sebelum menyimpan.";
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return "Konten tidak ditemukan. Muat ulang halaman dan coba lagi.";
  return "Konten gagal disimpan. Periksa data dan koneksi database.";
}

export async function saveCmsAction(entity: CmsEntity, formData: FormData) {
  if (!["program", "artikel", "galeri", "tim", "konservasi"].includes(entity)) redirect("/admin");
  const session = await requireAdmin();
  try {
    await saveCmsEntity(entity, session.user.id, formData);
  } catch (error) {
    redirect(`${adminPath(entity)}?error=${encodeURIComponent(safeError(error))}`);
  }
  revalidatePath(adminPath(entity));
  if (entity === "program") { revalidatePath("/program"); revalidatePath("/program/[slug]", "page"); revalidatePath("/sitemap.xml"); revalidatePath("/", "page"); }
  if (entity === "artikel") { revalidatePath("/artikel"); revalidatePath("/artikel/[slug]", "page"); revalidatePath("/sitemap.xml"); revalidatePath("/", "page"); }
  if (entity === "galeri") revalidatePath("/galeri");
  if (entity === "konservasi") revalidatePath("/konservasi");
  if (entity === "tim") revalidatePath("/tentang-kami");
  redirect(adminPath(entity));
}

export async function saveSettingsAction(formData: FormData) {
  const session = await requireAdmin();
  try { await saveSiteSettings(session.user.id, formData); }
  catch (error) {
    redirect(`/admin/settings?error=${encodeURIComponent(safeError(error))}`);
  }
  revalidatePath("/", "layout");
  revalidatePath("/kontak");
  revalidatePath("/sitemap.xml");
  redirect("/admin/settings?saved=1");
}
