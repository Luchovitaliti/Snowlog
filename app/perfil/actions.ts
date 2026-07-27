"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { esNivelValido } from "@/lib/dominio";

export type PerfilState = {
  ok?: boolean;
  error?: string;
  nonce?: number; // cambia en cada guardado exitoso, para el "✓ Guardado"
};

/**
 * Guarda el perfil del profesor. La usan tanto el onboarding (con el campo
 * oculto `marcar_onboarding=1`, que además marca el flujo como completado y
 * redirige a la app) como la pantalla de Ajustes (edición normal, se queda).
 *
 * La foto ya se subió a Storage desde el cliente; acá solo llega su URL.
 */
export async function guardarPerfil(
  _prev: PerfilState,
  formData: FormData,
): Promise<PerfilState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Se venció la sesión. Volvé a entrar." };

  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  // Instagram: guardamos el handle sin la @ inicial.
  const instagram = String(formData.get("instagram") ?? "")
    .trim()
    .replace(/^@+/, "");
  const nivel = String(formData.get("nivel_instructor") ?? "").trim();
  const fotoUrl = String(formData.get("foto_url") ?? "").trim();
  const marcarOnboarding = formData.get("marcar_onboarding") === "1";

  if (!nombre) return { error: "Ingresá tu nombre." };
  if (!apellido) return { error: "Ingresá tu apellido." };
  if (!esNivelValido(nivel)) return { error: "Elegí tu nivel de instructor." };

  const cambios: Record<string, unknown> = {
    nombre,
    apellido,
    telefono,
    instagram,
    nivel_instructor: nivel,
  };
  // Solo pisamos la foto si vino una nueva (editar sin cambiarla la conserva).
  if (fotoUrl) cambios.foto_url = fotoUrl;
  if (marcarOnboarding) cambios.onboarding_completado = true;

  const { error } = await supabase
    .from("perfiles")
    .update(cambios)
    .eq("id", user.id);
  if (error) return { error: "No se pudo guardar el perfil. Probá de nuevo." };

  // El nombre aparece en el header (layout) → revalidamos todo.
  revalidatePath("/", "layout");

  if (marcarOnboarding) redirect("/registrar");
  return { ok: true, nonce: Date.now() };
}
