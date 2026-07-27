"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BUCKET_FOTOS, NIVELES_INSTRUCTOR } from "@/lib/dominio";
import type { Perfil } from "@/lib/tipos";
import { guardarPerfil, type PerfilState } from "@/app/perfil/actions";

const inputClase =
  "w-full rounded-xl border border-borde bg-fondo px-3.5 py-3 text-base text-texto outline-none focus:border-acento placeholder:text-tenue-2";

const labelClase =
  "mb-2 block text-[11px] font-bold uppercase tracking-[2px] text-tenue-2";

/**
 * Redimensiona la imagen a un máximo de 640px y la re-encoda como JPEG para
 * que la foto pese poco (buena idea con el wifi de la montaña). Si algo falla,
 * cae al archivo original sin romper.
 */
async function procesarImagen(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const max = 640;
    const escala = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * escala);
    const h = Math.round(bitmap.height * escala);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/jpeg", 0.85),
    );
    return blob ?? file;
  } catch {
    return file;
  }
}

export function PerfilForm({
  perfil,
  userId,
  modo,
}: {
  perfil: Perfil | null;
  userId: string;
  /** "onboarding" marca el flujo como completado y redirige; "ajustes" edita. */
  modo: "onboarding" | "ajustes";
}) {
  const [state, formAction, pending] = useActionState<PerfilState, FormData>(
    guardarPerfil,
    {},
  );

  const fileRef = useRef<HTMLInputElement>(null);
  const objUrlRef = useRef<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(perfil?.foto_url ?? null);
  const [subiendo, setSubiendo] = useState(false);
  const [errorFoto, setErrorFoto] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);

  // Preview local del archivo elegido; liberamos el object URL anterior.
  function elegirFoto(f: File | null) {
    if (objUrlRef.current) URL.revokeObjectURL(objUrlRef.current);
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      objUrlRef.current = url;
      setPreview(url);
    } else {
      objUrlRef.current = null;
      setPreview(perfil?.foto_url ?? null);
    }
  }

  // Liberar el object URL pendiente al desmontar.
  useEffect(() => {
    return () => {
      if (objUrlRef.current) URL.revokeObjectURL(objUrlRef.current);
    };
  }, []);

  // "✓ Guardado" transitorio tras una edición exitosa (modo ajustes).
  // Diferido a callbacks para no llamar a setState dentro del effect.
  useEffect(() => {
    if (!state.ok || !state.nonce) return;
    const t0 = setTimeout(() => {
      setFile(null);
      setGuardado(true);
    }, 0);
    const t1 = setTimeout(() => setGuardado(false), 1800);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
    };
  }, [state.ok, state.nonce]);

  async function subirFoto(f: File): Promise<string | null> {
    const supabase = createClient();
    const blob = await procesarImagen(f);
    const path = `${userId}/perfil.jpg`;
    const { error } = await supabase.storage
      .from(BUCKET_FOTOS)
      .upload(path, blob, { upsert: true, contentType: "image/jpeg" });
    if (error) return null;
    const { data } = supabase.storage.from(BUCKET_FOTOS).getPublicUrl(path);
    // Cache-buster: la URL es siempre la misma al pisar el archivo.
    return `${data.publicUrl}?t=${Date.now()}`;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorFoto(null);
    const fd = new FormData(e.currentTarget);

    if (file) {
      setSubiendo(true);
      const url = await subirFoto(file);
      setSubiendo(false);
      if (!url) {
        setErrorFoto("No se pudo subir la foto. Probá de nuevo.");
        return;
      }
      fd.set("foto_url", url);
    }

    formAction(fd);
  }

  const ocupado = pending || subiendo;
  const iniciales =
    (perfil?.nombre?.[0] ?? "") + (perfil?.apellido?.[0] ?? "");

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
      {modo === "onboarding" && (
        <input type="hidden" name="marcar_onboarding" value="1" />
      )}

      {/* Foto de perfil */}
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border border-borde bg-superficie">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Foto de perfil"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-bold uppercase text-tenue-2">
              {iniciales || "🎿"}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-xl border border-borde bg-superficie px-4 py-2 text-sm font-semibold text-tenue"
          >
            {preview ? "Cambiar foto" : "Subir foto"}
          </button>
          <span className="text-xs text-tenue-2">JPG o PNG, se ajusta sola.</span>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => elegirFoto(e.target.files?.[0] ?? null)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label>
          <span className={labelClase}>Nombre</span>
          <input
            name="nombre"
            defaultValue={perfil?.nombre ?? ""}
            required
            className={inputClase}
            placeholder="Juan"
          />
        </label>
        <label>
          <span className={labelClase}>Apellido</span>
          <input
            name="apellido"
            defaultValue={perfil?.apellido ?? ""}
            required
            className={inputClase}
            placeholder="Pérez"
          />
        </label>
      </div>

      <label>
        <span className={labelClase}>Nivel de instructor (AADIDESS)</span>
        <select
          name="nivel_instructor"
          defaultValue={perfil?.nivel_instructor ?? ""}
          required
          className={`${inputClase} appearance-none`}
        >
          <option value="" disabled>
            Elegí tu nivel…
          </option>
          {NIVELES_INSTRUCTOR.map((n) => (
            <option key={n} value={n}>
              Nivel {n}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className={labelClase}>Teléfono</span>
        <input
          name="telefono"
          type="tel"
          inputMode="tel"
          defaultValue={perfil?.telefono ?? ""}
          className={inputClase}
          placeholder="+54 9 …"
        />
      </label>

      <label>
        <span className={labelClase}>Instagram</span>
        <div className="flex items-center rounded-xl border border-borde bg-fondo focus-within:border-acento">
          <span className="pl-3.5 text-base text-tenue-2">@</span>
          <input
            name="instagram"
            defaultValue={perfil?.instagram ?? ""}
            className="w-full bg-transparent px-2 py-3 text-base text-texto outline-none placeholder:text-tenue-2"
            placeholder="usuario"
          />
        </div>
      </label>

      {(errorFoto || state.error) && (
        <p className="rounded-xl border border-[#F87171]/35 bg-[#F87171]/10 px-3 py-2 text-sm text-[#F87171]">
          {errorFoto ?? state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={ocupado}
        className="mt-2 rounded-2xl bg-acento px-5 py-3.5 text-[15px] font-extrabold text-[#06141F] disabled:opacity-60"
      >
        {subiendo
          ? "Subiendo foto…"
          : pending
            ? "Guardando…"
            : modo === "onboarding"
              ? "Completar perfil"
              : guardado
                ? "✓ Guardado"
                : "Guardar cambios"}
      </button>
    </form>
  );
}
