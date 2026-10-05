import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export default async function AdminDashboard() {
  let counts: [string, number][] = [];
  let dbError = false;
  try {
    const values = await Promise.all([prisma.program.count(), prisma.article.count(), prisma.galleryImage.count(), prisma.teamMember.count(), prisma.conservationProject.count(), prisma.contactSubmission.count({ where: { status: "NEW" } })]);
    counts = ["Program", "Artikel", "Foto galeri", "Anggota tim", "Proyek konservasi", "Permintaan baru"].map((label, index) => [label, values[index]]);
  } catch { dbError = true; }
  return <div className="admin-content"><header className="admin-page-header"><div><p className="eyebrow">Ruang pengelolaan</p><h1>Ringkasan situs</h1><p>Kelola konten yang tampil di situs Ruang Rimba.</p></div></header>
    {dbError && <div className="admin-alert">Database belum siap. Atur DATABASE_URL, jalankan migrasi, lalu muat ulang halaman.</div>}
    <div className="admin-stats">{counts.map(([label, count]) => <article key={label}><span>{label}</span><strong>{count}</strong></article>)}</div>
    <section className="admin-panel"><h2>Mulai mengelola</h2><div className="admin-shortcuts">{[["Program", "/admin/program"], ["Artikel", "/admin/artikel"], ["Galeri", "/admin/galeri"], ["Tim", "/admin/tim"], ["Konservasi", "/admin/konservasi"], ["Permintaan", "/admin/permintaan"], ["Pengaturan situs", "/admin/settings"]].map(([title, href]) => <Link key={href} href={href}>{title} <span aria-hidden="true">↗</span></Link>)}</div></section>
  </div>;
}
