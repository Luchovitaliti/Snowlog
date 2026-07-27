import { AuthLink, AuthShell } from "@/components/auth/auth-shell";
import { RegistroForm } from "./registro-form";

export default function RegistroPage() {
  return (
    <AuthShell
      titulo="Creá tu cuenta de instructor"
      pie={
        <>
          ¿Ya tenés cuenta? <AuthLink href="/login">Iniciá sesión</AuthLink>
        </>
      }
    >
      <RegistroForm />
    </AuthShell>
  );
}
