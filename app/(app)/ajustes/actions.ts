"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { esProductoValido } from "@/lib/dominio";

export type TarifaState = {
  ok?: boolean;
  error?: string;
  nonce?: number; // cambia en cada guardado exitoso, para el "✓ Guardado"
};

/**
 * Guarda el valor por hora de un producto. Si `aplicar_temporada` viene
 * marcado, además propaga el nuevo precio a las clases YA cargadas de ese
 * producto de la temporada en curso (año calendario actual); las de
 * temporadas anteriores nunca se tocan. La atomicidad de los dos updates
 * la garantiza la función SQL guardar_tarifa (ver migración 0004).
 */
export async function guardarTarifa(
  _prev: TarifaState,
  formData: FormData,
): Promise<TarifaState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Se venció la sesión. Volvé a entrar." };

  const producto = String(formData.get("producto") ?? "").trim();
  const valor = Number(formData.get("valor") ?? NaN);
  const aplicarTemporada = formData.get("aplicar_temporada") === "1";

  if (!esProductoValido(producto)) return { error: "Producto inválido." };
  if (!Number.isFinite(valor) || valor <= 0) {
    return { error: "Ingresá un valor por hora mayor a 0." };
  }

  const { error } = await supabase.rpc("guardar_tarifa", {
    p_producto: producto,
    p_valor: valor,
    p_aplicar_temporada: aplicarTemporada,
  });
  if (error) return { error: "No se pudo guardar la tarifa. Probá de nuevo." };

  // La tarifa se muestra en Registrar (precio por producto) y afecta los
  // totales del Historial cuando se propaga a la temporada.
  revalidatePath("/registrar");
  revalidatePath("/historial");
  return { ok: true, nonce: Date.now() };
}
