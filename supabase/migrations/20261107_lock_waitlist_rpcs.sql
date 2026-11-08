-- ============================================================
--  20261107_lock_waitlist_rpcs.sql
--  Seguridad — cierra las RPC de waitlist y push al rol anon
--
--  Idempotente. Problemas que corrige:
--   1. get_waitlist_position(email) y register_waitlist(email) estaban
--      abiertas a anon: con la anon key (publica, y en el historial de
--      git) cualquiera podia preguntar por CUALQUIER correo y saber si
--      esta en la waitlist, su posicion y su referral_code.
--   2. Sin verificacion de correo, registrar correos inventados con un
--      referral_code ajeno o propio movia la posicion 10 puestos por alta.
--   3. subscribe_push dejaba asociar un endpoint push al correo de otro
--      y reescribia el correo de un endpoint existente (ON CONFLICT).
--   4. gen_ref_code usaba md5(random()): random() no es criptografico y
--      6 caracteres hex son solo ~16,7 millones de codigos.
--
--  Ninguna pagina del sitio llama hoy a estas RPC (la seccion de
--  waitlist ya no esta en el HTML), asi que revocarlas no rompe nada
--  visible. Si vuelven a hacer falta desde el navegador, deben pasar por
--  el backend (service_role) con verificacion de correo (doble opt-in) y
--  limite de tasa, no reabrirse a anon.
--
--  get_waitlist_count() se queda abierta: solo devuelve un numero.
-- ============================================================

-- ------------------------------------------------------------
--  1. Solo el backend (service_role) puede ejecutar estas RPC.
--     Postgres concede EXECUTE a PUBLIC por defecto, por eso se revoca
--     tambien de PUBLIC y no solo de anon/authenticated.
-- ------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.register_waitlist(text, text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_waitlist_position(text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.subscribe_push(text, text, text, text, text)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.gen_ref_code()
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.register_waitlist(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_waitlist_position(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.subscribe_push(text, text, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.gen_ref_code() TO service_role;

-- ------------------------------------------------------------
--  2. Codigos de referido con aleatoriedad criptografica:
--     5 bytes de gen_random_bytes -> 10 caracteres hex (~1,1 billones).
--     Los codigos existentes (6 caracteres) siguen siendo validos.
--     En Supabase pgcrypto vive en el schema `extensions`.
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.gen_ref_code()
RETURNS text
LANGUAGE sql
VOLATILE
SET search_path = ''
AS $$
  SELECT encode(extensions.gen_random_bytes(5), 'hex');
$$;

-- CREATE OR REPLACE conserva los privilegios, pero se reafirman por si la
-- funcion no existia al correr esta migracion.
REVOKE EXECUTE ON FUNCTION public.gen_ref_code() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gen_ref_code() TO service_role;

-- ------------------------------------------------------------
--  Verificacion: anon no debe poder ejecutar ninguna de las cuatro.
-- ------------------------------------------------------------
DO $$
DECLARE
  f text;
BEGIN
  FOREACH f IN ARRAY ARRAY[
    'public.register_waitlist(text, text)',
    'public.get_waitlist_position(text)',
    'public.subscribe_push(text, text, text, text, text)',
    'public.gen_ref_code()'
  ] LOOP
    IF has_function_privilege('anon', f, 'EXECUTE') THEN
      RAISE EXCEPTION 'anon todavia puede ejecutar %', f;
    END IF;
  END LOOP;
  RAISE NOTICE 'RPC de waitlist y push cerradas a anon.';
END $$;
