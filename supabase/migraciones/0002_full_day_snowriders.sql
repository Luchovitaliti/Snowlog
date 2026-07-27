-- ============================================================
-- SnowLog · Full Day para Snowriders/Olimpo (Paso 3.1)
-- ============================================================
-- Correr UNA vez en el SQL Editor, DESPUÉS de 0001.
--
-- Cambio de alcance: se agrega la opción "Full Day" = 7 horas
-- fijas, disponible SOLO para el producto 'snowriders'. Los
-- demás productos siguen con 1/2/3 horas. Se cobra igual:
-- horas × tarifa del producto (no hay tarifa especial).
-- ============================================================

-- 1. Permitir 7 horas además de 1/2/3.
alter table clases drop constraint clases_horas_check;
alter table clases add constraint clases_horas_check
  check (horas in (1, 2, 3, 7));

-- 2. Regla de negocio en la base: las 7 horas (Full Day) solo
--    son válidas para snowriders. Defensa extra además del UI.
alter table clases add constraint clases_full_day_solo_snowriders
  check (horas <> 7 or producto = 'snowriders');
