import type { ReactNode } from "react";

export type AdminField = { name: string; label: string; kind?: "text" | "email" | "url" | "textarea" | "select" | "number" | "date"; required?: boolean; options?: string[]; hint?: string };
export type AdminRow = Record<string, string>;

function AdminInput({ field, value = "" }: { field: AdminField; value?: string }) {
  if (field.kind === "textarea") return <textarea name={field.name} defaultValue={value} required={field.required} rows={4} />;
  if (field.kind === "select") return <select name={field.name} defaultValue={value || "DRAFT"}>{(field.options ?? []).map((option) => <option key={option}>{option}</option>)}</select>;
  return <input name={field.name} type={field.kind ?? "text"} defaultValue={value} required={field.required} />;
}

export function CmsManager({ title, description, fields, rows, action, error, children, allowArchive = true }: {
  title: string; description: string; fields: AdminField[]; rows: AdminRow[];
  action: (formData: FormData) => Promise<void>; error?: string; children?: ReactNode; allowArchive?: boolean;
}) {
  return <div className="admin-content"><header className="admin-page-header"><div><p className="eyebrow">Pengelolaan konten</p><h1>{title}</h1><p>{description}</p></div><span className="admin-count">{rows.length} item</span></header>
    {error && <p className="admin-alert" role="alert">{error}</p>}{children}
    <section className="admin-panel"><h2>Tambah konten</h2><form action={action} className="admin-grid-form">{fields.map((field) => <label key={field.name}>{field.label}{field.hint && <small>{field.hint}</small>}<AdminInput field={field} /></label>)}<button className="admin-button">Simpan konten</button></form></section>
    <section className="admin-panel"><h2>Konten tersimpan</h2>{rows.length === 0 ? <p>Belum ada konten CMS. Konten demo publik tetap tersedia sampai ada konten terbit.</p> : <div className="admin-records">{rows.map((row) => <details className="admin-record" key={row.id}><summary><strong>{row.title || row.name || row.question}</strong><span>{row.status}</span></summary><form action={action} className="admin-grid-form"><input type="hidden" name="id" value={row.id} />{fields.map((field) => <label key={field.name}>{field.label}<AdminInput field={field} value={row[field.name]} /></label>)}<button className="admin-button">Simpan perubahan</button></form>{allowArchive && <form action={action}><input type="hidden" name="id" value={row.id} /><input type="hidden" name="_intent" value="archive" /><button className="admin-archive">Arsipkan</button></form>}</details>)}</div>}</section>
  </div>;
}
