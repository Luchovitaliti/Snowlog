"use client";

import { useActionState } from "react";
import { login, type AuthState } from "@/app/auth/actions";

const inputClase =
  "w-full rounded-xl border border-borde bg-fondo px-3.5 py-3 text-base text-texto outline-none focus:border-acento";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    login,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-[2px] text-tenue-2">
          Email
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          className={inputClase}
          placeholder="tu@email.com"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-[2px] text-tenue-2">
          Contraseña
        </span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          className={inputClase}
          placeholder="••••••••"
        />
      </label>

      {state.error && (
        <p className="rounded-xl border border-[#F87171]/35 bg-[#F87171]/10 px-3 py-2 text-sm text-[#F87171]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-xl bg-acento px-5 py-3.5 text-[15px] font-extrabold text-[#06141F] disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
