# Migraciones SQL — SnowLog

Estas migraciones se corren **a mano** en el **SQL Editor de Supabase**
(Dashboard → SQL Editor → New query → pegar → Run). Claude Code no las ejecuta.

Correr en orden:

1. `0001_esquema_inicial.sql` — tablas, RLS y trigger de alta.
2. `0002_full_day_snowriders.sql` — habilita 7 horas (Full Day) solo para snowriders.
3. `0003_perfil_onboarding.sql` — columnas de perfil (apellido, teléfono,
   Instagram, nivel AADIDESS, foto), bandera `onboarding_completado` y bucket
   de Storage `fotos-perfil` (público de lectura) con RLS por profesor.

> El trigger `on_auth_user_created` crea el perfil + las 4 tarifas default
> cada vez que se registra un usuario nuevo. Conviene correr esta migración
> **antes** de crear cuentas. Si ya creaste alguna cuenta de prueba antes,
> ver el snippet de backfill en la sección correspondiente del handoff.
