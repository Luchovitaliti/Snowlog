import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Convención "proxy" de Next.js 16 (reemplaza al viejo "middleware").
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Corre en todas las rutas salvo estáticos e imágenes:
     * - _next/static, _next/image
     * - favicon, manifest, íconos e imágenes
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
