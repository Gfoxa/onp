import type { ReactNode } from "react";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { requireAdmin } from "@/server/auth/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  return <div className="admin-shell"><AdminNavigation /><main className="admin-main">{children}</main></div>;
}
