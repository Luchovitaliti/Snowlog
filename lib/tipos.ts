import type { NivelInstructor, ProductoId } from "@/lib/dominio";

// Filas de la base (ver supabase/migraciones/0001 y 0003).

export type Perfil = {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  instagram: string;
  nivel_instructor: NivelInstructor | null;
  foto_url: string | null;
  onboarding_completado: boolean;
  creado_en: string;
};

export type Tarifa = {
  profesor_id: string;
  producto: ProductoId;
  valor_hora: number;
};

export type Clase = {
  id: string;
  profesor_id: string;
  fecha: string; // YYYY-MM-DD
  producto: ProductoId;
  horas: number;
  tarifa_hora: number;
  nota: string | null;
  creado_en: string;
};

/** Mapa producto → valor por hora del profesor. */
export type TarifasMap = Record<ProductoId, number>;
