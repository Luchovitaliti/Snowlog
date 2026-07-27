"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  PRODUCTOS,
  MESES,
  fmtPesos,
  fmtFecha,
  esFullDay,
  productoPorId,
} from "@/lib/dominio";
import type { Clase } from "@/lib/tipos";
import { borrarClase } from "./actions";

export function Historial({ clases }: { clases: Clase[] }) {
  const router = useRouter();
  const hoy = new Date();
  const [mesVista, setMesVista] = useState(hoy.getMonth());
  const [anioVista, setAnioVista] = useState(hoy.getFullYear());
  const [confirmarId, setConfirmarId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cambiarMes(delta: number) {
    let m = mesVista + delta;
    let a = anioVista;
    if (m < 0) {
      m = 11;
      a--;
    }
    if (m > 11) {
      m = 0;
      a++;
    }
    setMesVista(m);
    setAnioVista(a);
    setConfirmarId(null);
  }

  const delMes = clases.filter((c) => {
    const [y, m] = c.fecha.split("-").map(Number);
    return y === anioVista && m - 1 === mesVista;
  });

  const totHoras = delMes.reduce((s, c) => s + c.horas, 0);
  const totPlata = delMes.reduce((s, c) => s + c.horas * c.tarifa_hora, 0);
  const ordenadas = [...delMes].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));

  const desglose = PRODUCTOS.map((p) => {
    const cs = delMes.filter((c) => c.producto === p.id);
    return {
      p,
      horas: cs.reduce((s, c) => s + c.horas, 0),
      plata: cs.reduce((s, c) => s + c.horas * c.tarifa_hora, 0),
      hay: cs.length > 0,
    };
  }).filter((d) => d.hay);

  function pedirBorrar(id: string) {
    if (confirmarId !== id) {
      setConfirmarId(id);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setConfirmarId(null), 3000);
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setConfirmarId(null);
    startTransition(async () => {
      await borrarClase(id);
      router.refresh();
    });
  }

  return (
    <div>
      {/* Navegación por mes */}
      <div className="mb-3.5 flex items-center justify-between">
        <button
          onClick={() => cambiarMes(-1)}
          className="h-10 w-10 rounded-xl border border-borde bg-superficie text-xl text-tenue"
          aria-label="Mes anterior"
        >
          ‹
        </button>
        <div className="text-[17px] font-extrabold">
          {MESES[mesVista]} {anioVista}
        </div>
        <button
          onClick={() => cambiarMes(1)}
          className="h-10 w-10 rounded-xl border border-borde bg-superficie text-xl text-tenue"
          aria-label="Mes siguiente"
        >
          ›
        </button>
      </div>

      {/* Tarjeta de totales */}
      <div className="mb-4 rounded-2xl border border-borde bg-gradient-to-br from-[#0D1826] to-[#0B1420] px-4 py-[18px]">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-[2px] text-tenue-2">
              HORAS DEL MES
            </div>
            <div className="mt-1 text-[26px] font-black tabular-nums">
              {totHoras} h
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold tracking-[2px] text-tenue-2">
              A COBRAR
            </div>
            <div className="mt-1 text-[26px] font-black text-acento tabular-nums">
              {fmtPesos(totPlata)}
            </div>
          </div>
        </div>

        {desglose.length > 0 && (
          <div className="mt-3.5 border-t border-borde pt-3">
            {desglose.map(({ p, horas, plata }) => (
              <div
                key={p.id}
                className="flex items-center gap-2 py-1 text-[13px]"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: p.color }}
                />
                <span className="text-texto-suave">{p.nombre}</span>
                <span className="ml-auto text-tenue tabular-nums">
                  {horas} h · {fmtPesos(plata)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lista de clases */}
      {ordenadas.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm leading-relaxed text-tenue-2">
          Sin clases registradas este mes.
          <br />
          Registrá la primera desde la pestaña Registrar.
        </div>
      ) : (
        ordenadas.map((c) => {
          const p = productoPorId(c.producto);
          const esConfirmar = confirmarId === c.id;
          return (
            <div
              key={c.id}
              className="mb-2.5 flex items-center gap-3 rounded-2xl border border-borde-tenue bg-superficie px-3.5 py-3"
            >
              <div
                className="w-1 self-stretch rounded"
                style={{ background: p?.color ?? "#5B7089" }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold">{fmtFecha(c.fecha)}</div>
                <div className="mt-0.5 text-[13px] text-tenue">
                  {p?.nombre ?? c.producto} ·{" "}
                  {esFullDay(c.horas) ? "Full Day" : `${c.horas} h`}
                  {c.nota ? ` · ${c.nota}` : ""}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-texto-suave tabular-nums">
                  {fmtPesos(c.horas * c.tarifa_hora)}
                </div>
                <div className="mt-1 flex justify-end gap-3">
                  <Link
                    href={`/registrar?editar=${c.id}`}
                    className="text-[11px] text-acento underline"
                  >
                    editar
                  </Link>
                  <button
                    onClick={() => pedirBorrar(c.id)}
                    disabled={pending}
                    className={`text-[11px] underline ${
                      esConfirmar ? "font-bold text-[#F87171]" : "text-tenue-2"
                    }`}
                  >
                    {esConfirmar ? "¿seguro?" : "borrar"}
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
