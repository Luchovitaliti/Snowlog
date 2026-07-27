"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { esProductoValido, horasDisponibles, type ProductoId } from "@/lib/dominio";

export type CrearState = {
  ok?: boolean;
  error?: string;
  nonce?: number; // cambia en cada guardado exitoso, para resetear el form
};

export async function crearClase(
  _prev: CrearState,
  formData: FormData,
): Promise<CrearState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Se venció la sesión. Volvé a entrar." };

  const fecha = String(formData.get("fecha") ?? "");
  const producto = String(formData.get("producto") ?? "");
  const horas = Number(formData.get("horas") ?? 0);
  const nota = String(formData.get("nota") ?? "").trim();

  if (!fecha) return { error: "Elegí una fecha." };
  if (!esProductoValido(producto)) return { error: "Producto inválido." };
  if (!horasDisponibles(producto as ProductoId).includes(horas)) {
    return { error: "Esa cantidad de horas no es válida para el producto." };
  }

  // Congelar la tarifa desde la base (RLS: solo devuelve la del propio profe).
  const { data: tarifa } = await supabase
    .from("tarifas")
    .select("valor_hora")
    .eq("producto", producto)
    .single();
  if (!tarifa) return { error: "No encontramos la tarifa de ese producto." };

  const { error } = await supabase.from("clases").insert({
    profesor_id: user.id,
    fecha,
    producto,
    horas,
    tarifa_hora: tarifa.valor_hora,
    nota,
  });
  if (error) return { error: "No se pudo guardar la clase. Probá de nuevo." };

  // El historial se recalcula la próxima vez que se visite.
  revalidatePath("/historial");
  return { ok: true, nonce: Date.now() };
}
