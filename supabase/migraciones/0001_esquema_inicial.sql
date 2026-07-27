-- ============================================================
-- SnowLog · Esquema inicial (Paso 3)
-- ============================================================
-- Correr UNA vez en el SQL Editor de Supabase.
-- Crea las 3 tablas, activa RLS con políticas por profesor, y
-- agrega un trigger que al registrarse un usuario le crea el
-- perfil + las 4 tarifas default.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Tablas
-- ------------------------------------------------------------

-- perfiles: 1 fila por usuario autenticado
create table perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null default '',
  creado_en timestamptz not null default now()
);

-- tarifas: por profesor, por producto
create table tarifas (
  profesor_id uuid not null references perfiles(id) on delete cascade,
  producto text not null check (producto in ('colectiva','snowriders','particular','requerida')),
  valor_hora numeric not null,
  primary key (profesor_id, producto)
);

-- clases: el registro de cada clase dada
create table clases (
  id uuid primary key default gen_random_uuid(),
  profesor_id uuid not null references perfiles(id) on delete cascade,
  fecha date not null,
  producto text not null check (producto in ('colectiva','snowriders','particular','requerida')),
  horas smallint not null check (horas in (1,2,3)),
  tarifa_hora numeric not null, -- congelada al momento de crear la clase
  nota text default '',
  creado_en timestamptz not null default now()
);

-- Índice para el historial por mes (filtra por profesor y ordena por fecha)
create index clases_profesor_fecha_idx on clases (profesor_id, fecha desc);

-- ------------------------------------------------------------
-- 2. Row Level Security: cada profe accede SOLO a sus filas
-- ------------------------------------------------------------

alter table perfiles enable row level security;
alter table tarifas  enable row level security;
alter table clases   enable row level security;

create policy "perfiles: ver y editar el propio" on perfiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "tarifas: solo del propio profesor" on tarifas
  for all using (auth.uid() = profesor_id) with check (auth.uid() = profesor_id);

create policy "clases: solo del propio profesor" on clases
  for all using (auth.uid() = profesor_id) with check (auth.uid() = profesor_id);

-- ------------------------------------------------------------
-- 3. Trigger: al crear un usuario, crear perfil + tarifas default
-- ------------------------------------------------------------
-- SECURITY DEFINER: corre con los permisos del dueño de la función
-- (postgres), así puede insertar aunque el usuario recién creado
-- todavía no tenga sesión. search_path vacío por seguridad.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id)
  values (new.id);

  insert into public.tarifas (profesor_id, producto, valor_hora)
  values
    (new.id, 'colectiva',  16000),
    (new.id, 'snowriders', 12000),
    (new.id, 'particular', 14000),
    (new.id, 'requerida',  20000);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
