import { redirect } from "next/navigation";

export default function Home() {
  // La app arranca en Registrar. El proxy ya exige sesión para llegar acá.
  redirect("/registrar");
}
