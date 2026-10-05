"use server";

import { revalidatePath } from "next/cache";
import { contactSubmissionSchema, isHoneypotFilled } from "@/server/contact/validation";
import { createContactSubmission } from "@/server/contact/service";

export type ContactActionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitContact(_previousState: ContactActionState, formData: FormData): Promise<ContactActionState> {
  if (isHoneypotFilled(formData.get("website"))) {
    return { status: "success", message: "Terima kasih. Permintaanmu sudah kami terima." };
  }

  const input = Object.fromEntries(formData.entries());
  const parsed = contactSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang bertanda sebelum mengirim.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const result = await createContactSubmission(parsed.data);
    if (result === "RATE_LIMITED") {
      return { status: "error", message: "Permintaan dengan email ini baru saja dikirim. Coba lagi setelah beberapa saat." };
    }
  } catch {
    return { status: "error", message: "Permintaan belum dapat disimpan. Coba lagi nanti atau hubungi kami melalui WhatsApp jika tersedia." };
  }

  revalidatePath("/admin/permintaan");
  revalidatePath("/admin");
  return { status: "success", message: "Terima kasih. Permintaanmu sudah tersimpan dan siap ditinjau organisasi." };
}
