import { getClases } from "@/lib/datos";
import { Historial } from "./historial";

export default async function HistorialPage() {
  const clases = await getClases();
  return <Historial clases={clases} />;
}
