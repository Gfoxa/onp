import Link from "next/link";
import { signOut } from "@/lib/auth";

const links = [
  ["Ringkasan", "/admin"], ["Program", "/admin/program"], ["Artikel", "/admin/artikel"],
  ["Galeri", "/admin/galeri"], ["Tim", "/admin/tim"], ["Konservasi", "/admin/konservasi"],
  ["Permintaan", "/admin/permintaan"], ["Pengaturan situs", "/admin/settings"],
];

export function AdminNavigation() {
  return <aside className="admin-sidebar"><Link className="admin-brand" href="/admin">Ruang Rimba <span>CMS</span></Link><nav aria-label="Menu admin">{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav><form action={async () => { "use server"; await signOut({ redirectTo: "/admin/login" }); }}><button className="admin-signout">Keluar</button></form></aside>;
}
