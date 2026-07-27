import { createClient } from "@/lib/supabase/server";
import { TARIFAS_DEFAULT, type ProductoId } from "@/lib/dominio";
import type { TarifasMap } from "@/lib/tipos";

// Accesos a datos del lado del servidor. RLS asegura que cada consulta
// devuelve solo las filas del profesor autenticado.

/** Tarifas del profesor como mapa producto → valor_hora (con fallback a defaults). */
export async function getTarifas(): Promise<TarifasMap> {
  const supabase = await createClient();
  const { data } = await supabase.from("tarifas").select("producto, valor_hora");

  const map: TarifasMap = { ...TARIFAS_DEFAULT };
  for (const t of data ?? []) {
    map[t.producto as ProductoId] = Number(t.valor_hora);
  }
  return map;
}

/** Nombre del profesor (string vacío si aún no lo cargó). */
export async function getNombrePerfil(): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase.from("perfiles").select("nombre").single();
  return data?.nombre ?? "";
}
