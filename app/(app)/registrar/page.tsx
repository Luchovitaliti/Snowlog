import { getClase, getTarifas } from "@/lib/datos";
import { RegistrarForm } from "./registrar-form";

export default async function RegistrarPage({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string }>;
}) {
  const { editar } = await searchParams;
  const [tarifas, claseEditar] = await Promise.all([
    getTarifas(),
    editar ? getClase(editar) : Promise.resolve(null),
  ]);

  return <RegistrarForm tarifas={tarifas} claseEditar={claseEditar} />;
}
