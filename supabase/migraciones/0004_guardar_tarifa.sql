-- ============================================================
-- SnowLog · Guardar tarifa (con propagación opcional al historial)
-- ============================================================
-- Correr UNA vez en el SQL Editor, DESPUÉS de 0001–0003.
--
-- Cambio de comportamiento: al editar una tarifa en Ajustes, además de
-- actualizar tarifas.valor_hora, se puede aplicar el nuevo precio de forma
-- retroactiva a las clases YA cargadas de ese producto — pero SOLO las de
-- la temporada en curso (año calendario actual) y SOLO si el profe marca la
-- casilla. Por default la clase sigue "congelada" al precio del momento en
-- que se cargó (ver 0001); esta función es la única vía de propagación, y
-- nunca toca temporadas anteriores.
--
-- Se hace todo en UNA función (transacción implícita) para que los dos
-- UPDATE sean atómicos: nunca queda la tarifa nueva con el historial viejo.
-- SECURITY INVOKER: corre como el usuario, así RLS sigue limitando cada
-- consulta a las filas del propio profesor.
-- ============================================================

create or replace function public.guardar_tarifa(
  p_producto text,
  p_valor numeric,
  p_aplicar_temporada boolean
) returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Validaciones: un valor mal ahora afectaría TODO el historial del año.
  if p_valor is null or p_valor <= 0 then
    raise exception 'valor_hora inválido: %', p_valor;
  end if;
  if p_producto not in ('colectiva','snowriders','particular','requerida') then
    raise exception 'producto inválido: %', p_producto;
  end if;

  -- 1. Precio "actual" del producto (afecta las clases futuras al crearlas).
  update public.tarifas
    set valor_hora = p_valor
    where profesor_id = auth.uid()
      and producto = p_producto;

  -- 2. Opcional: propagar a las clases ya cargadas de la temporada en curso.
  --    Rango = año calendario actual [01-ene, 01-ene del año siguiente).
  if p_aplicar_temporada then
    update public.clases
      set tarifa_hora = p_valor
      where profesor_id = auth.uid()
        and producto = p_producto
        and fecha >= date_trunc('year', current_date)::date
        and fecha <  (date_trunc('year', current_date) + interval '1 year')::date;
  end if;
end;
$$;
