import { redirect } from "next/navigation";
import { logout } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // El proxy ya protege esta ruta; esto es una defensa extra.
  if (!user) redirect("/login");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-xs font-bold tracking-[3px] text-tenue-2">
        LAS LEÑAS · TEMPORADA {new Date().getFullYear()}
      </div>
      <h1 className="text-5xl font-black leading-none tracking-wide">
        SNOW<span className="text-acento">LOG</span>
      </h1>
      <p className="text-sm text-tenue">
        Sesión iniciada como <span className="text-texto">{user.email}</span>
      </p>

      <p className="mt-2 rounded-xl border border-borde bg-superficie px-4 py-3 text-xs text-tenue">
        Paso 2 completo: auth con email + contraseña.
        <br />
        Las pantallas de la app (registrar, historial, ajustes) llegan en los
        próximos pasos.
      </p>

      <form action={logout}>
        <button
          type="submit"
          className="mt-2 rounded-xl border border-borde bg-superficie px-5 py-2.5 text-sm font-semibold text-tenue"
        >
          Cerrar sesión
        </button>
      </form>
    </main>
  );
}
