import Link from "next/link";

/** Marco visual común de las pantallas de login y registro. */
export function AuthShell({
  titulo,
  children,
  pie,
}: {
  titulo: string;
  children: React.ReactNode;
  pie: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col justify-center px-6 py-10">
      <div className="mb-8 text-center">
        <div className="text-[10px] font-bold tracking-[3px] text-tenue-2">
          LAS LEÑAS · TEMPORADA {new Date().getFullYear()}
        </div>
        <h1 className="mt-1 text-4xl font-black leading-none tracking-wide">
          SNOW<span className="text-acento">LOG</span>
        </h1>
        <p className="mt-2 text-sm text-tenue">{titulo}</p>
      </div>

      <div className="rounded-2xl border border-borde bg-superficie p-5">
        {children}
      </div>

      <p className="mt-5 text-center text-sm text-tenue">{pie}</p>
    </main>
  );
}

/** Link con estilo de acento, para los pies de las pantallas de auth. */
export function AuthLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-acento underline">
      {children}
    </Link>
  );
}
