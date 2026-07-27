import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPerfil } from "@/lib/datos";
import { PerfilForm } from "@/components/perfil/perfil-form";

// Onboarding: se muestra UNA sola vez, la primera vez que el profe entra
// después de registrarse. Al completarlo, `guardarPerfil` marca
// onboarding_completado = true y redirige a la app. Si ya lo completó,
// esta pantalla no se vuelve a mostrar (lo edita normal desde Ajustes).
export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const perfil = await getPerfil();
  if (perfil?.onboarding_completado) redirect("/registrar");

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col justify-center px-6 py-10">
      <div className="mb-6 text-center">
        <div className="text-[10px] font-bold tracking-[3px] text-tenue-2">
          LAS LEÑAS · TEMPORADA {new Date().getFullYear()}
        </div>
        <h1 className="mt-1 text-4xl font-black leading-none tracking-wide">
          SNOW<span className="text-acento">LOG</span>
        </h1>
        <p className="mt-3 text-[15px] font-semibold text-texto">
          ¡Bienvenido! Completá tu perfil
        </p>
        <p className="mt-1 text-sm text-tenue">
          Lo hacés una sola vez. Después lo podés editar desde Ajustes.
        </p>
      </div>

      <div className="rounded-2xl border border-borde bg-superficie p-5">
        <PerfilForm perfil={perfil} userId={user.id} modo="onboarding" />
      </div>
    </main>
  );
}
