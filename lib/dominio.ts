// Constantes y helpers de negocio, portados del index.html original.
// Se usan tanto en el cliente como en el servidor (sin dependencias de entorno).

export type ProductoId = "colectiva" | "snowriders" | "particular" | "requerida";

export type Producto = {
  id: ProductoId;
  nombre: string;
  color: string;
};

export const PRODUCTOS: Producto[] = [
  { id: "colectiva", nombre: "Colectiva Adulto", color: "#4ADE80" },
  { id: "snowriders", nombre: "Snowriders / Olimpo", color: "#38BDF8" },
  { id: "particular", nombre: "Particular", color: "#FBBF24" },
  { id: "requerida", nombre: "Requerida", color: "#C084FC" },
];

export const TARIFAS_DEFAULT: Record<ProductoId, number> = {
  colectiva: 16000,
  snowriders: 12000,
  particular: 14000,
  requerida: 20000,
};

export const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// --- Full Day (7 horas) exclusivo de snowriders ---
export const FULL_DAY_HORAS = 7;
export const PRODUCTO_FULL_DAY: ProductoId = "snowriders";

/** Opciones de horas válidas según el producto. */
export function horasDisponibles(producto: ProductoId): number[] {
  return producto === PRODUCTO_FULL_DAY ? [1, 2, 3, FULL_DAY_HORAS] : [1, 2, 3];
}

/** true si esa cantidad de horas es "Full Day". */
export function esFullDay(horas: number): boolean {
  return horas === FULL_DAY_HORAS;
}

// --- Formato ---
export const fmtPesos = (n: number): string =>
  "$" + Number(n || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 });

/** Fecha de hoy en ISO (YYYY-MM-DD) según la zona horaria local. */
export const hoyISO = (): string => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
};

/** ISO (YYYY-MM-DD) → "Vie 25/7". */
export const fmtFecha = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${DIAS[date.getDay()]} ${d}/${m}`;
};

export function productoPorId(id: string): Producto | undefined {
  return PRODUCTOS.find((p) => p.id === id);
}

export function esProductoValido(id: string): id is ProductoId {
  return PRODUCTOS.some((p) => p.id === id);
}
