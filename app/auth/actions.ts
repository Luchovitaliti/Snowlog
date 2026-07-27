"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  message?: string;
};

/** Traduce los errores más comunes de Supabase Auth a español. */
function traducirError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Email o contraseña incorrectos.";
  if (m.includes("email not confirmed"))
    return "Tenés que confirmar tu email antes de entrar. Revisá tu casilla.";
  if (m.includes("user already registered") || m.includes("already been registered"))
    return "Ese email ya está registrado. Probá iniciar sesión.";
  if (m.includes("password should be at least"))
    return "La contraseña es demasiado corta (mínimo 6 caracteres).";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "El email no es válido.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Demasiados intentos. Esperá un momento y probá de nuevo.";
  return "No se pudo completar la acción. Probá de nuevo.";
}

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Completá email y contraseña." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: traducirError(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function registro(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const password2 = String(formData.get("password2") ?? "");

  if (!email || !password) {
    return { error: "Completá email y contraseña." };
  }
  if (password.length < 6) {
    return { error: "La contraseña tiene que tener al menos 6 caracteres." };
  }
  if (password !== password2) {
    return { error: "Las contraseñas no coinciden." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: traducirError(error.message) };
  }

  // Si el proyecto tiene confirmación de email activada, no hay sesión todavía.
  if (!data.session) {
    return {
      message:
        "Te enviamos un email para confirmar tu cuenta. Confirmalo y después iniciá sesión.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
