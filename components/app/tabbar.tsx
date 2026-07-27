"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/registrar", ico: "＋", label: "Registrar" },
  { href: "/historial", ico: "☰", label: "Historial" },
  { href: "/ajustes", ico: "⚙", label: "Ajustes" },
];

export function Tabbar() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full shrink-0 border-t border-borde-tenue bg-fondo/95 px-0 pt-2 pb-[calc(10px+env(safe-area-inset-bottom))] backdrop-blur-md">
      {TABS.map((t) => {
        const activo = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex flex-1 flex-col items-center py-1.5 ${
              activo ? "text-acento" : "text-tenue-2"
            }`}
          >
            <span className="text-lg leading-none">{t.ico}</span>
            <span className="mt-1 text-[11px] font-semibold">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
