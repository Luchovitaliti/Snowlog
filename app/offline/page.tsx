export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-borde bg-superficie text-3xl">
        ❄️
      </div>

      <div className="text-[10px] font-bold tracking-[3px] text-tenue-2">
        SNOWLOG · LAS LEÑAS
      </div>
      <h1 className="mt-3 text-2xl font-bold text-texto">Estás sin conexión</h1>
      <p className="mt-3 max-w-sm text-sm leading-6 text-texto-suave">
        SnowLog no pudo conectarse. Revisá la señal y volvé a intentar. Tus datos
        personales no se guardan en el caché del dispositivo.
      </p>

      <a
        href="/"
        className="mt-7 rounded-xl bg-acento px-5 py-3 text-sm font-bold text-fondo"
      >
        Reintentar
      </a>
    </main>
  );
}
