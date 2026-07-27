-- ============================================================
-- SnowLog · Perfil ampliado + Onboarding + Storage de fotos
-- ============================================================
-- Correr UNA vez en el SQL Editor, DESPUÉS de 0001 y 0002.
--
-- Cambio de alcance: el perfil del profe deja de ser solo "nombre".
-- Se agregan apellido, teléfono, Instagram, nivel de instructor
-- (AADIDESS 1 a 5) y foto de perfil. Además una bandera
-- `onboarding_completado` para mostrar el flujo de alta de perfil
-- UNA sola vez, la primera vez que el profe entra tras registrarse.
--
-- La foto vive en Supabase Storage (bucket 'fotos-perfil', público de
-- lectura). Cada profe solo puede escribir/editar/borrar dentro de su
-- propia carpeta {user_id}/... gracias a las policies de RLS de abajo.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Columnas nuevas en perfiles
-- ------------------------------------------------------------
-- Los defaults cubren a los perfiles que YA existen (creados por el
-- trigger de 0001). Al quedar `onboarding_completado = false`, esos
-- profes verán el onboarding la próxima vez que inicien sesión.

alter table perfiles
  add column if not exists apellido              text    not null default '',
  add column if not exists telefono              text    not null default '',
  add column if not exists instagram             text    not null default '',
  add column if not exists nivel_instructor      text,
  add column if not exists foto_url              text,
  add column if not exists onboarding_completado boolean not null default false;

-- Nivel de instructor: certificación AADIDESS del 1 al 5.
-- Nullable porque hasta terminar el onboarding todavía no está cargado.
alter table perfiles drop constraint if exists perfiles_nivel_instructor_check;
alter table perfiles add constraint perfiles_nivel_instructor_check
  check (nivel_instructor is null or nivel_instructor in ('1','2','3','4','5'));

-- ------------------------------------------------------------
-- 2. Bucket de Storage para las fotos de perfil
-- ------------------------------------------------------------
-- Público de lectura: la foto se muestra con un <img> directo, sin
-- signed URLs. La escritura queda restringida por las policies (paso 3).

insert into storage.buckets (id, name, public)
values ('fotos-perfil', 'fotos-perfil', true)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 3. RLS de Storage: cada profe solo toca su propia carpeta
-- ------------------------------------------------------------
-- Convención de path: '{user_id}/perfil.jpg'. La primera carpeta del
-- path (storage.foldername(name))[1] tiene que coincidir con el uid.

drop policy if exists "fotos-perfil: lectura publica"       on storage.objects;
drop policy if exists "fotos-perfil: subir la propia"       on storage.objects;
drop policy if exists "fotos-perfil: actualizar la propia"  on storage.objects;
drop policy if exists "fotos-perfil: borrar la propia"      on storage.objects;

-- Lectura: cualquiera puede ver (el bucket es público igual; esta policy
-- habilita también el acceso vía API autenticada).
create policy "fotos-perfil: lectura publica" on storage.objects
  for select
  using (bucket_id = 'fotos-perfil');

-- Subir: solo dentro de la carpeta propia.
create policy "fotos-perfil: subir la propia" on storage.objects
  for insert
  with check (
    bucket_id = 'fotos-perfil'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Actualizar (upsert al cambiar la foto): solo la propia.
create policy "fotos-perfil: actualizar la propia" on storage.objects
  for update
  using (
    bucket_id = 'fotos-perfil'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'fotos-perfil'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Borrar: solo la propia.
create policy "fotos-perfil: borrar la propia" on storage.objects
  for delete
  using (
    bucket_id = 'fotos-perfil'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
