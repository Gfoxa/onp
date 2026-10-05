import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(
  (value) => !Number.isNaN(Date.parse(value)) && new Date(`${value}T00:00:00.000Z`).toISOString().startsWith(value),
  "Tanggal tidak valid.",
);

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(120, "Nama maksimal 120 karakter."),
  email: z.string().trim().email("Masukkan alamat email yang valid.").max(254).transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(8, "Nomor WhatsApp minimal 8 karakter.").max(32, "Nomor WhatsApp terlalu panjang.")
    .regex(/^\+?[0-9][0-9\s().-]*$/, "Gunakan angka dan format telepon yang valid.")
    .refine((value) => (value.match(/[0-9]/g)?.length ?? 0) >= 8 && (value.match(/[0-9]/g)?.length ?? 0) <= 15, "Nomor WhatsApp harus berisi 8–15 angka."),
  organization: optionalText(160),
  programType: optionalText(160),
  participantCount: z.preprocess(
    (value) => value === "" || value === undefined || value === null ? null : value,
    z.coerce.number().int("Jumlah peserta harus berupa bilangan bulat.").min(1, "Jumlah peserta minimal 1.").max(10000, "Jumlah peserta terlalu besar.").nullable(),
  ),
  plannedDate: z.preprocess(
    (value) => value === "" || value === undefined || value === null ? null : value,
    dateOnly.nullable(),
  ),
  message: z.string().trim().min(10, "Pesan minimal 10 karakter.").max(3000, "Pesan maksimal 3.000 karakter."),
});

export const contactSubmissionStatusSchema = z.enum(["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]);

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
export type ContactSubmissionStatus = z.infer<typeof contactSubmissionStatusSchema>;

export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function isContactRateLimited(recentSubmissions: number, limit = 3): boolean {
  return recentSubmissions >= limit;
}
