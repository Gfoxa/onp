import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isAdminRole } from "./roles";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || !isAdminRole(session.user.role)) redirect("/admin/login");
  return session;
}
