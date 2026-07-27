import type { ProductoId } from "@/lib/dominio";

// Filas de la base (ver supabase/migraciones/0001_esquema_inicial.sql).

export type Perfil = {
  id: string;
  nombre: string;
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
