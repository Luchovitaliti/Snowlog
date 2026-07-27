"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Borra una clase del profesor autenticado (RLS asegura que sea propia). */
export async function borrarClase(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("clases").delete().eq("id", id);
  revalidatePath("/historial");
}
