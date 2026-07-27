import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPerfil, getTarifas } from "@/lib/datos";
import { PerfilForm } from "@/components/perfil/perfil-form";
import { TarifasForm } from "@/components/ajustes/tarifas-form";
import { logout } from "@/app/auth/actions";

// Ajustes: edición normal del perfil (a diferencia del onboarding, no marca
// nada ni redirige; se queda acá y muestra "✓ Guardado"). El layout de la app
// ya garantiza que llegás con sesión y el onboarding completo.
export default async function AjustesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [perfil, tarifas] = await Promise.all([getPerfil(), getTarifas()]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-borde bg-superficie p-5">
        <PerfilForm perfil={perfil} userId={user.id} modo="ajustes" />
      </div>

      <TarifasForm tarifas={tarifas} />

      <form action={logout}>
        <button
          type="submit"
          className="w-full rounded-xl border border-borde bg-superficie px-5 py-3 text-sm font-semibold text-tenue"
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}
