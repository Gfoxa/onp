import { updateContactStatus } from "./actions";
import { prisma } from "@/lib/db/prisma";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  NEW: "Baru",
  CONTACTED: "Sudah dihubungi",
  IN_PROGRESS: "Dalam proses",
  COMPLETED: "Selesai",
  ARCHIVED: "Diarsipkan",
};

export default async function ContactRequestsAdminPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { error, saved } = await searchParams;
  let submissions = [] as Awaited<ReturnType<typeof prisma.contactSubmission.findMany>>;
  let dbError = false;
  try {
    submissions = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  } catch {
    dbError = true;
  }

  return <div className="admin-content">
    <header className="admin-page-header"><div><p className="eyebrow">Kontak dan konversi</p><h1>Permintaan program</h1><p>Pesan pengunjung yang tersimpan secara privat untuk ditinjau administrator.</p></div><span className="admin-count">{submissions.length} permintaan</span></header>
    {(error || (dbError ? "Database belum tersedia. Permintaan belum dapat dimuat." : saved ? "Status permintaan berhasil diperbarui." : "")) && <p className="admin-alert" role="status">{error || (dbError ? "Database belum tersedia. Permintaan belum dapat dimuat." : "Status permintaan berhasil diperbarui.")}</p>}
    <section className="admin-panel"><h2>Kotak masuk</h2>
      {submissions.length === 0 ? <p>{dbError ? "Periksa konfigurasi database dan migrasi." : "Belum ada permintaan program."}</p> : <div className="admin-contact-list">{submissions.map((submission) => {
        const whatsappNumber = submission.phone.replace(/\D/g, "");
        const whatsappUrl = buildWhatsAppUrl(whatsappNumber, `Halo ${submission.name}, kami menindaklanjuti permintaan program yang Anda kirim melalui Ruang Rimba.`);
        return <article className="admin-contact-record" key={submission.id}>
          <header><div><p className="eyebrow">{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(submission.createdAt)}</p><h3>{submission.name}</h3></div><span className={`admin-contact-status admin-contact-status--${submission.status.toLowerCase()}`}>{statusLabels[submission.status]}</span></header>
          <dl className="admin-contact-details">
            <div><dt>Email</dt><dd><a href={`mailto:${submission.email}`}>{submission.email}</a></dd></div>
            <div><dt>WhatsApp</dt><dd>{whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noreferrer">{submission.phone} · Buka WhatsApp ↗</a> : <a href={`tel:${submission.phone}`}>{submission.phone}</a>}</dd></div>
            {submission.organization && <div><dt>Organisasi</dt><dd>{submission.organization}</dd></div>}
            {submission.programType && <div><dt>Program</dt><dd>{submission.programType}</dd></div>}
            {submission.participantCount && <div><dt>Jumlah peserta</dt><dd>{submission.participantCount}</dd></div>}
            {submission.plannedDate && <div><dt>Tanggal rencana</dt><dd>{new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(submission.plannedDate)}</dd></div>}
          </dl>
          <p className="admin-contact-message">{submission.message}</p>
          <form action={updateContactStatus} className="admin-contact-status-form">
            <input type="hidden" name="id" value={submission.id} />
            <label htmlFor={`status-${submission.id}`}>Status permintaan</label>
            <select id={`status-${submission.id}`} name="status" defaultValue={submission.status}>
              {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <button className="admin-button">Simpan status</button>
          </form>
        </article>;
      })}</div>}
    </section>
  </div>;
}
