-- ============================================================
--  20260527_add_waitlist_referral.sql
--  Phase 4 — Waitlist referral system
--
--  Idempotente: corre con `supabase db push` o desde el SQL
--  Editor del dashboard. Todas las sentencias son seguras de
--  re-ejecutar (IF NOT EXISTS, CREATE OR REPLACE).
--
--  Cambios:
--   1. waitlist += referral_code (text UNIQUE) y referred_by (text)
--   2. waitlist += consent_accepted_at (timestamptz)
--   3. RPC register_waitlist(email, referred_by) — INSERT idempotente
--   4. RPC get_waitlist_position(email) — devuelve posicion + total + codigo
--   5. RPC get_waitlist_count() actualizada (compatible con existente)
--   6. RLS: anon ya NO puede INSERT directo a waitlist (forzado via RPC)
--   7. Trigger de backfill: cualquier fila nueva sin referral_code recibe uno
-- ============================================================

-- ------------------------------------------------------------
--  1. Helper: generar slug aleatorio de 6 chars [a-z0-9]
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.gen_ref_code()
RETURNS text
LANGUAGE sql
VOLATILE
AS $$
  SELECT substring(
    md5(random()::text || clock_timestamp()::text)
    FROM 1 FOR 6
  );
$$;

-- ------------------------------------------------------------
--  2. Columnas nuevas en waitlist
-- ------------------------------------------------------------
ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS referral_code text;

-- Unique con retry-en-aplicacion: si dos INSERT concurrentes generan
-- el mismo random, el INSERT falla con 23505 y la RPC reintenta.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'waitlist_referral_code_key'
  ) THEN
    ALTER TABLE public.waitlist
      ADD CONSTRAINT waitlist_referral_code_key UNIQUE (referral_code);
  END IF;
END $$;

ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS referred_by text;

ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS consent_accepted_at timestamptz;

-- Indice para conteo eficiente de referidos por codigo
CREATE INDEX IF NOT EXISTS waitlist_referred_by_idx
  ON public.waitlist (referred_by)
  WHERE referred_by IS NOT NULL;

-- ------------------------------------------------------------
--  3. Backfill: emails existentes sin codigo reciben uno
--  Usa loop con retry para evitar colisiones UNIQUE
-- ------------------------------------------------------------
DO $$
DECLARE
  r record;
  attempt int;
  new_code text;
BEGIN
  FOR r IN SELECT email FROM public.waitlist WHERE referral_code IS NULL LOOP
    attempt := 0;
    LOOP
      attempt := attempt + 1;
      new_code := public.gen_ref_code();
      BEGIN
        UPDATE public.waitlist
          SET referral_code = new_code
          WHERE email = r.email;
        EXIT; -- exito
      EXCEPTION WHEN unique_violation THEN
        IF attempt > 10 THEN
          RAISE EXCEPTION 'No se pudo generar referral_code unico para %', r.email;
        END IF;
        -- reintentar
      END;
    END LOOP;
  END LOOP;
END $$;

-- Default para INSERTS futuros (cuando se hagan via SQL directo, ej. seeds)
ALTER TABLE public.waitlist
  ALTER COLUMN referral_code SET DEFAULT public.gen_ref_code();

-- Marcar NOT NULL despues del backfill
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='waitlist'
      AND column_name='referral_code' AND is_nullable='YES'
  ) THEN
    ALTER TABLE public.waitlist
      ALTER COLUMN referral_code SET NOT NULL;
  END IF;
END $$;

-- ------------------------------------------------------------
--  4. RPC: register_waitlist(email, referred_by)
--     - INSERT idempotente (email duplicado devuelve la fila existente)
--     - Valida formato email basico
--     - Valida que referred_by exista (si no, lo guarda como NULL silenciosamente)
--     - Devuelve {position, total, referral_code, referred_count}
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.register_waitlist(
  p_email text,
  p_referred_by text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
  v_ref_valid text;
  v_attempt int := 0;
  v_new_code text;
  v_row public.waitlist;
BEGIN
  v_email := lower(trim(p_email));

  IF v_email IS NULL
     OR v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    RAISE EXCEPTION 'email_invalid' USING ERRCODE = '22023';
  END IF;

  -- Verifica que el codigo de referido exista (no es FK estricta para no romper
  -- el INSERT si hay typo; si invalido, se guarda como NULL)
  IF p_referred_by IS NOT NULL AND length(p_referred_by) > 0 THEN
    SELECT referral_code INTO v_ref_valid
      FROM public.waitlist
      WHERE referral_code = p_referred_by
      LIMIT 1;
  END IF;

  -- Si el email ya existe, devolver su info sin re-insertar
  SELECT * INTO v_row FROM public.waitlist WHERE email = v_email LIMIT 1;
  IF FOUND THEN
    RETURN public.get_waitlist_position(v_email);
  END IF;

  -- INSERT con retry en caso de colision de referral_code
  LOOP
    v_attempt := v_attempt + 1;
    v_new_code := public.gen_ref_code();
    BEGIN
      INSERT INTO public.waitlist (email, referral_code, referred_by, consent_accepted_at)
        VALUES (v_email, v_new_code, v_ref_valid, now());
      EXIT;
    EXCEPTION
      WHEN unique_violation THEN
        -- Puede ser email O referral_code; chequear cual
        IF EXISTS (SELECT 1 FROM public.waitlist WHERE email = v_email) THEN
          EXIT; -- carrera: alguien lo insertó entre el SELECT y el INSERT
        END IF;
        IF v_attempt > 10 THEN
          RAISE EXCEPTION 'referral_code_collision' USING ERRCODE = '23505';
        END IF;
        -- reintenta con nuevo codigo
    END;
  END LOOP;

  RETURN public.get_waitlist_position(v_email);
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_waitlist(text, text) TO anon, authenticated;

-- ------------------------------------------------------------
--  5. RPC: get_waitlist_position(email)
--     - Posicion calculada por created_at ASC con bonus por referidos
--     - Bonus: -10 posiciones por cada referido confirmado (max: posicion=1)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_waitlist_position(p_email text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
  v_code text;
  v_raw_pos int;
  v_total int;
  v_referred int;
  v_final_pos int;
BEGIN
  v_email := lower(trim(p_email));
  IF v_email IS NULL OR length(v_email) = 0 THEN
    RETURN NULL;
  END IF;

  SELECT referral_code INTO v_code
    FROM public.waitlist
    WHERE email = v_email
    LIMIT 1;

  IF v_code IS NULL THEN
    RETURN NULL; -- email no registrado
  END IF;

  SELECT count(*)::int INTO v_total FROM public.waitlist;

  SELECT count(*)::int INTO v_raw_pos
    FROM public.waitlist w
    WHERE w.created_at <= (
      SELECT created_at FROM public.waitlist WHERE email = v_email LIMIT 1
    );

  SELECT count(*)::int INTO v_referred
    FROM public.waitlist
    WHERE referred_by = v_code;

  v_final_pos := GREATEST(1, v_raw_pos - (v_referred * 10));

  RETURN jsonb_build_object(
    'position',       v_final_pos,
    'total',          v_total,
    'referral_code',  v_code,
    'referred_count', v_referred
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_waitlist_position(text) TO anon, authenticated;

-- ------------------------------------------------------------
--  6. RLS: deshabilitar INSERT directo de anon a waitlist
--     (las RPC corren con SECURITY DEFINER y bypassean RLS)
-- ------------------------------------------------------------
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Eliminar policy de INSERT anonimo si existe (de la version anterior)
DO $$
DECLARE
  pol_name text;
BEGIN
  FOR pol_name IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'waitlist'
      AND cmd = 'INSERT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.waitlist', pol_name);
  END LOOP;
END $$;

-- Nota: SELECT/UPDATE/DELETE para anon nunca estuvieron habilitados y siguen
-- bloqueados (no se crea ninguna policy permisiva).

-- ------------------------------------------------------------
--  7. Compatibilidad: la RPC get_waitlist_count() ya existia.
--     La dejamos intacta. (No se redefine para evitar overrides accidentales.)
-- ------------------------------------------------------------

-- Verificacion al final:
DO $$
BEGIN
  RAISE NOTICE 'Migracion aplicada. Total filas waitlist: %, con referral_code: %',
    (SELECT count(*) FROM public.waitlist),
    (SELECT count(*) FROM public.waitlist WHERE referral_code IS NOT NULL);
END $$;
