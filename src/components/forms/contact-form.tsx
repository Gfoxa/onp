"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactActionState } from "@/app/kontak/actions";

type ContactFormProps = { programs: string[]; selectedProgram?: string };
type ContactField = "name" | "email" | "phone" | "organization" | "programType" | "participantCount" | "plannedDate" | "message";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button className="button button--solid contact-form__submit" type="submit" disabled={pending}>{pending ? "Mengirim permintaan…" : "Kirim permintaan"}<span aria-hidden="true">↗</span></button>;
}

export function ContactForm({ programs, selectedProgram = "" }: ContactFormProps) {
  const [state, formAction] = useActionState(submitContact, { status: "idle", message: "" } satisfies ContactActionState);
  const errors = state.fieldErrors ?? {};
  const fieldProps = (name: ContactField) => ({
    "aria-invalid": Boolean(errors[name]?.length),
    "aria-describedby": errors[name]?.length ? `${name}-error` : undefined,
  });
  const errorMessage = (name: ContactField) => errors[name]?.[0]
    ? <span className="contact-form__field-error" id={`${name}-error`}>{errors[name][0]}</span>
    : null;

  return <form action={formAction} className="contact-form" noValidate>
    {state.message && <p className={`contact-form__notice contact-form__notice--${state.status}`} role={state.status === "error" ? "alert" : "status"}>{state.message}</p>}
    <div className="contact-form__grid">
      <label>Nama lengkap <span aria-hidden="true">*</span><input name="name" type="text" required minLength={2} maxLength={120} autoComplete="name" {...fieldProps("name")} />{errorMessage("name")}</label>
      <label>Email <span aria-hidden="true">*</span><input name="email" type="email" required maxLength={254} autoComplete="email" {...fieldProps("email")} />{errorMessage("email")}</label>
      <label>Nomor WhatsApp <span aria-hidden="true">*</span><input name="phone" type="tel" required maxLength={32} autoComplete="tel" placeholder="Contoh: +62 812 3456 7890" {...fieldProps("phone")} />{errorMessage("phone")}</label>
      <label>Nama organisasi <span className="contact-form__optional">Opsional</span><input name="organization" type="text" maxLength={160} autoComplete="organization" {...fieldProps("organization")} />{errorMessage("organization")}</label>
      <label>Jenis program <span className="contact-form__optional">Opsional</span><select name="programType" defaultValue={selectedProgram} {...fieldProps("programType")}><option value="">Pilih program</option>{programs.map((program) => <option key={program} value={program}>{program}</option>)}<option value="Konsultasi umum">Konsultasi umum</option><option value="Program lainnya">Program lainnya</option></select>{errorMessage("programType")}</label>
      <label>Perkiraan jumlah peserta <span className="contact-form__optional">Opsional</span><input name="participantCount" type="number" min={1} max={10000} inputMode="numeric" {...fieldProps("participantCount")} />{errorMessage("participantCount")}</label>
      <label>Tanggal rencana <span className="contact-form__optional">Opsional</span><input name="plannedDate" type="date" {...fieldProps("plannedDate")} />{errorMessage("plannedDate")}</label>
      <label className="contact-form__message">Ceritakan kebutuhanmu <span aria-hidden="true">*</span><textarea name="message" required minLength={10} maxLength={3000} rows={6} placeholder="Tujuan kegiatan, kebutuhan kelompok, atau hal lain yang ingin didiskusikan." {...fieldProps("message")} />{errorMessage("message")}</label>
    </div>
    <div className="contact-form__honeypot" aria-hidden="true"><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
    <div className="contact-form__footer"><p>Informasi ini digunakan untuk meninjau permintaanmu oleh administrator Ruang Rimba.</p><SubmitButton /></div>
  </form>;
}
