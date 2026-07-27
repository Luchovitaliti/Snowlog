import { getTarifas } from "@/lib/datos";
import { RegistrarForm } from "./registrar-form";

export default async function RegistrarPage() {
  const tarifas = await getTarifas();
  return <RegistrarForm tarifas={tarifas} />;
}
