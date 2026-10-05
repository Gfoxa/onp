"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/login/actions";

const initialState = { error: "" };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);
  return <form action={action} className="admin-form">
    <label>Email<input name="email" type="email" autoComplete="username" required /></label>
    <label>Kata sandi<input name="password" type="password" autoComplete="current-password" required /></label>
    {state.error && <p className="form-error" role="alert">{state.error}</p>}
    <button className="admin-button" disabled={pending}>{pending ? "Memeriksa…" : "Masuk"}</button>
  </form>;
}
