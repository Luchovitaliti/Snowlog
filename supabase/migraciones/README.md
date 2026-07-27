# Migraciones SQL — SnowLog

Estas migraciones se corren **a mano** en el **SQL Editor de Supabase**
(Dashboard → SQL Editor → New query → pegar → Run). Claude Code no las ejecuta.

Correr en orden:

1. `0001_esquema_inicial.sql` — tablas, RLS y trigger de alta.
2. `0002_full_day_snowriders.sql` — habilita 7 horas (Full Day) solo para snowriders.

> El trigger `on_auth_user_created` crea el perfil + las 4 tarifas default
> cada vez que se registra un usuario nuevo. Conviene correr esta migración
> **antes** de crear cuentas. Si ya creaste alguna cuenta de prueba antes,
> ver el snippet de backfill en la sección correspondiente del handoff.
