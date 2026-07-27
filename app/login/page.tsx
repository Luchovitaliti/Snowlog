import { AuthLink, AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <AuthShell
      titulo="Entrá a tu cuenta"
      pie={
        <>
          ¿No tenés cuenta? <AuthLink href="/registro">Registrate</AuthLink>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
