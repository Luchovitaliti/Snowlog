"use client";

import { useActionState, useEffect, useState } from "react";
import {
  PRODUCTOS,
  fmtPesos,
  hoyISO,
  horasDisponibles,
  esFullDay,
  productoPorId,
  type ProductoId,
} from "@/lib/dominio";
import type { TarifasMap } from "@/lib/tipos";
import { crearClase, type CrearState } from "./actions";

export function RegistrarForm({ tarifas }: { tarifas: TarifasMap }) {
  const [state, formAction, pending] = useActionState<CrearState, FormData>(
    crearClase,
    {},
  );

  // Cada guardado exitoso trae un nonce nuevo → remonta los campos (reset).
  return (
    <CamposClase
      key={state.nonce ?? 0}
      tarifas={tarifas}
      formAction={formAction}
      pending={pending}
      error={state.error}
      guardada={Boolean(state.ok && state.nonce)}
    />
  );
}

function CamposClase({
  tarifas,
  formAction,
  pending,
  error,
  guardada: guardadaInicial,
}: {
  tarifas: TarifasMap;
  formAction: (formData: FormData) => void;
  pending: boolean;
  error?: string;
  guardada: boolean;
}) {
  const [producto, setProducto] = useState<ProductoId>("colectiva");
  const [horas, setHoras] = useState(3);
  const [guardada, setGuardada] = useState(guardadaInicial);

  // El "✓ Guardada" se limpia solo (setState va dentro del timeout, no sincrónico).
  useEffect(() => {
    if (!guardadaInicial) return;
    const t = setTimeout(() => setGuardada(false), 1800);
    return () => clearTimeout(t);
  }, [guardadaInicial]);

  function cambiarProducto(id: ProductoId) {
    setProducto(id);
    // Si el nuevo producto no permite Full Day y estaba en 7h, volver a 3h.
    if (!horasDisponibles(id).includes(horas)) setHoras(3);
  }

  const opciones = horasDisponibles(producto);
  const prodActual = productoPorId(producto);
  const montoPreview = horas * (tarifas[producto] || 0);

  return (
    <form action={formAction} className="flex flex-col">
      {/* Campos que no son inputs nativos van por hidden */}
      <input type="hidden" name="producto" value={producto} />
      <input type="hidden" name="horas" value={horas} />

      <label className="mb-2 mt-[18px] block text-[11px] font-bold uppercase tracking-[2px] text-tenue-2">
        Fecha
      </label>
      <input
        type="date"
        name="fecha"
        defaultValue={hoyISO()}
        suppressHydrationWarning
        className="w-full rounded-xl border border-borde bg-superficie px-3.5 py-3 text-base text-texto outline-none [color-scheme:dark]"
      />

      <label className="mb-2 mt-[18px] block text-[11px] font-bold uppercase tracking-[2px] text-tenue-2">
        Producto
      </label>
      <div className="grid gap-2.5">
        {PRODUCTOS.map((p) => {
          const activo = producto === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => cambiarProducto(p.id)}
              style={
                activo
                  ? { borderColor: p.color, background: `${p.color}14` }
                  : undefined
              }
              className={`flex w-full items-center gap-2.5 rounded-xl border-[1.5px] px-3.5 py-3 text-left ${
                activo ? "" : "border-borde bg-superficie"
              }`}
            >
              <span
                className="h-2 w-2 flex-shrink-0 rounded-full"
                style={{ background: p.color }}
              />
              <span
                className={`text-sm font-semibold ${activo ? "text-texto" : "text-tenue"}`}
              >
                {p.nombre}
              </span>
              <span className="ml-auto text-xs text-tenue-2 tabular-nums">
                {fmtPesos(tarifas[p.id])}/h
              </span>
            </button>
          );
        })}
      </div>

      <label className="mb-2 mt-[18px] block text-[11px] font-bold uppercase tracking-[2px] text-tenue-2">
        Horas dadas
      </label>
      <div className="flex gap-2.5">
        {opciones
          .filter((h) => !esFullDay(h))
          .map((h) => {
            const activo = horas === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => setHoras(h)}
                className={`flex-1 rounded-xl border-[1.5px] py-3 text-base font-bold ${
                  activo
                    ? "border-acento bg-acento/[0.08] text-[#E2F3FF]"
                    : "border-borde bg-superficie text-tenue"
                }`}
              >
                {h} h
              </button>
            );
          })}
      </div>

      {/* Full Day: solo aparece para snowriders */}
      {opciones.some(esFullDay) && (
        <button
          type="button"
          onClick={() => setHoras(7)}
          className={`mt-2.5 rounded-xl border-[1.5px] py-3 text-base font-bold ${
            esFullDay(horas)
              ? "border-acento bg-acento/[0.08] text-[#E2F3FF]"
              : "border-borde bg-superficie text-tenue"
          }`}
        >
          Full Day · 7 h
        </button>
      )}

      <label className="mb-2 mt-[18px] block text-[11px] font-bold uppercase tracking-[2px] text-tenue-2">
        Nota (opcional)
      </label>
      <input
        type="text"
        name="nota"
        defaultValue=""
        placeholder="Alumno, detalle, lo que quieras…"
        className="w-full rounded-xl border border-borde bg-superficie px-3.5 py-3 text-base text-texto outline-none placeholder:text-tenue-2"
      />

      {error && (
        <p className="mt-4 rounded-xl border border-[#F87171]/35 bg-[#F87171]/10 px-3 py-2 text-sm text-[#F87171]">
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between gap-3.5 rounded-2xl border border-borde bg-superficie p-4">
        <div>
          <div className="text-xs tracking-[1px] text-tenue-2">ESTA CLASE</div>
          <div
            className="text-[22px] font-extrabold tabular-nums"
            style={{ color: prodActual?.color ?? "#F0F6FC" }}
          >
            {fmtPesos(montoPreview)}
          </div>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="whitespace-nowrap rounded-2xl bg-acento px-5 py-3.5 text-[15px] font-extrabold text-[#06141F] disabled:opacity-60"
        >
          {guardada ? "✓ Guardada" : pending ? "Guardando…" : "Registrar clase"}
        </button>
      </div>
    </form>
  );
}
