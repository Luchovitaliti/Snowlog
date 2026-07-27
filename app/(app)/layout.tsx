import { Tabbar } from "@/components/app/tabbar";
import { getNombrePerfil } from "@/lib/datos";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nombre = await getNombrePerfil();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col">
      <header className="border-b border-borde-tenue px-5 pb-[18px] pt-[calc(20px+env(safe-area-inset-top))]">
        <div className="text-[10px] font-bold tracking-[3px] text-tenue-2">
          LAS LEÑAS · TEMPORADA {new Date().getFullYear()}
        </div>
        <div className="mt-1 text-[32px] font-black leading-none tracking-wide">
          SNOW<span className="text-acento">LOG</span>
        </div>
        <div className="mt-1.5 text-[13px] text-tenue">
          Registro de clases{nombre ? ` · ${nombre}` : ""}
        </div>
      </header>

      <main className="flex-1 px-5 pb-[calc(90px+env(safe-area-inset-bottom))] pt-4">
        {children}
      </main>

      <Tabbar />
    </div>
  );
}
