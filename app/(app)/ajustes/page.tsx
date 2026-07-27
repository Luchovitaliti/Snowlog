import { logout } from "@/app/auth/actions";

export default function AjustesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-borde bg-superficie px-4 py-8 text-center text-sm leading-relaxed text-tenue">
        Nombre y tarifas
        <br />
        <span className="text-tenue-2">Llega en el Paso 6.</span>
      </div>

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
