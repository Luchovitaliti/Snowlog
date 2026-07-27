"use client";

import { useActionState, useEffect, useState } from "react";
import { PRODUCTOS, fmtPesos, type ProductoId } from "@/lib/dominio";
import type { TarifasMap } from "@/lib/tipos";
import { guardarTarifa, type TarifaState } from "@/app/(app)/ajustes/actions";

const tituloClase =
  "text-[11px] font-bold uppercase tracking-[2px] text-tenue-2";

function TarifaRow({
  producto,
  nombre,
  color,
  valorInicial,
}: {
  producto: ProductoId;
  nombre: string;
  color: string;
  valorInicial: number;
}) {
  const [state, formAction, pending] = useActionState<TarifaState, FormData>(
    guardarTarifa,
    {},
  );
  const [valor, setValor] = useState(String(valorInicial));
  // Baseline contra el que comparamos para saber si hay algo para guardar.
  // Se actualiza tras cada guardado exitoso (así el botón se vuelve a apagar).
  const [base, setBase] = useState(valorInicial);
  const [aplicar, setAplicar] = useState(false);
  const [guardado, setGuardado] = useState(false);

  // "✓ Guardado" transitorio. Diferido a callbacks para no llamar a setState
  // dentro del effect (mismo patrón que PerfilForm).
  useEffect(() => {
    if (!state.ok || !state.nonce) return;
    const t0 = setTimeout(() => {
      setBase(Number(valor));
      setAplicar(false);
      setGuardado(true);
    }, 0);
    const t1 = setTimeout(() => setGuardado(false), 1800);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok, state.nonce]);

  const num = Number(valor);
  const valido = Number.isFinite(num) && num > 0;
  // Habilitado si cambió el precio, o si se pide propagar la tarifa actual
  // a la temporada (aplicar tildado aunque el valor no haya cambiado).
  const habilitado = valido && (num !== base || aplicar);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-xl border border-borde bg-fondo p-4"
    >
      <input type="hidden" name="producto" value={producto} />

      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm font-semibold text-texto">{nombre}</span>
      </div>

      <div className="flex items-center rounded-xl border border-borde bg-superficie focus-within:border-acento">
        <span className="pl-3.5 text-base text-tenue-2">$</span>
        <input
          name="valor"
          type="number"
          inputMode="numeric"
          min={1}
          step="any"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="w-full bg-transparent px-2 py-3 text-base text-texto outline-none"
        />
        <span className="pr-3.5 text-sm text-tenue-2">/h</span>
      </div>

      <label className="flex items-start gap-2 text-sm text-tenue">
        <input
          type="checkbox"
          name="aplicar_temporada"
          value="1"
          checked={aplicar}
          onChange={(e) => setAplicar(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-acento"
        />
        <span>Aplicar al historial de esta temporada</span>
      </label>

      {aplicar && (
        <p className="text-xs leading-relaxed text-tenue-2">
          Reescribe las clases de {nombre.toLowerCase()} de este año a{" "}
          {valido ? fmtPesos(num) : "—"}/h. Las temporadas anteriores no se
          tocan.
        </p>
      )}

      {state.error && (
        <p className="rounded-xl border border-[#F87171]/35 bg-[#F87171]/10 px-3 py-2 text-sm text-[#F87171]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !habilitado}
        className="rounded-xl bg-acento px-4 py-2.5 text-sm font-extrabold text-[#06141F] disabled:opacity-40"
      >
        {pending ? "Guardando…" : guardado ? "✓ Guardado" : "Guardar"}
      </button>
    </form>
  );
}

export function TarifasForm({ tarifas }: { tarifas: TarifasMap }) {
  return (
    <div className="rounded-2xl border border-borde bg-superficie p-5">
      <h2 className={tituloClase}>Tarifas por hora</h2>
      <div className="mt-3 flex flex-col gap-3">
        {PRODUCTOS.map((p) => (
          <TarifaRow
            key={p.id}
            producto={p.id}
            nombre={p.nombre}
            color={p.color}
            valorInicial={tarifas[p.id]}
          />
        ))}
      </div>
    </div>
  );
}
