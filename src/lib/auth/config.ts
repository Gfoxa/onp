import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import { authenticateAdmin } from "@/server/auth/credentials";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [Credentials({
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Kata sandi", type: "password" } },
    async authorize(rawCredentials) {
      return authenticateAdmin(rawCredentials, (email) => prisma.user.findUnique({ where: { email } }));
    },
  })],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = "role" in user ? user.role : undefined;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
