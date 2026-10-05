"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export async function loginAction(_previousState: { error: string }, formData: FormData) {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Email atau kata sandi tidak sesuai." };
    throw error;
  }
  return { error: "Email atau kata sandi tidak sesuai." };
}
