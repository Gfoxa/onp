import { LoginForm } from "@/components/admin/login-form";
import Link from "next/link";

export const metadata = { title: "Masuk Admin | Ruang Rimba" };

export default function AdminLoginPage() {
  return <main className="admin-login"><section className="admin-login__card"><Link href="/" className="eyebrow">Ruang Rimba ↗</Link><p className="eyebrow">Area administrator</p><h1>Selamat datang kembali.</h1><p>Masuk untuk mengelola konten situs.</p><LoginForm /></section></main>;
}
