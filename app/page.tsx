export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-xs font-bold tracking-[3px] text-tenue-2">
        LAS LEÑAS · TEMPORADA {new Date().getFullYear()}
      </div>
      <h1 className="text-5xl font-black leading-none tracking-wide">
        SNOW<span className="text-acento">LOG</span>
      </h1>
      <p className="text-sm text-tenue">
        Registro de clases · en construcción
      </p>
      <p className="mt-4 rounded-xl border border-borde bg-superficie px-4 py-3 text-xs text-tenue">
        Paso 1 completo: scaffold Next.js + Supabase listo.
        <br />
        Las pantallas de la app llegan en los próximos pasos.
      </p>
    </main>
  );
}
