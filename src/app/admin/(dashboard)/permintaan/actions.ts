"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/server/auth/require-admin";
import { updateContactSubmissionStatus } from "@/server/contact/service";
import { contactSubmissionStatusSchema } from "@/server/contact/validation";

const statusUpdateSchema = z.object({
  id: z.uuid(),
  status: contactSubmissionStatusSchema,
});

export async function updateContactStatus(formData: FormData) {
  const session = await requireAdmin();
  const parsed = statusUpdateSchema.safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) redirect("/admin/permintaan?error=Data+status+tidak+valid");

  let updated: boolean;
  try {
    updated = await updateContactSubmissionStatus(parsed.data.id, parsed.data.status, session.user.id);
  } catch {
    redirect("/admin/permintaan?error=Status+permintaan+gagal+diperbarui");
  }
  if (!updated) redirect("/admin/permintaan?error=Permintaan+tidak+ditemukan");

  revalidatePath("/admin/permintaan");
  revalidatePath("/admin");
  redirect("/admin/permintaan?saved=1");
}
