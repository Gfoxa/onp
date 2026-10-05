import bcrypt from "bcryptjs";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(200),
});

export type AdminCredentialUser = { id: string; email: string; name: string | null; role: string; passwordHash: string | null };

export async function authenticateAdmin(
  rawCredentials: unknown,
  lookup: (email: string) => Promise<AdminCredentialUser | null>,
) {
  const parsed = credentialsSchema.safeParse(rawCredentials);
  if (!parsed.success) return null;
  const user = await lookup(parsed.data.email);
  if (!user || user.role !== "ADMIN" || !user.passwordHash) return null;
  if (!(await bcrypt.compare(parsed.data.password, user.passwordHash))) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}
