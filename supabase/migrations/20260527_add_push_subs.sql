-- ============================================================
--  20260527_add_push_subs.sql
--  Phase 5 — Web Push subscriptions
--
--  Idempotente. Crea tabla push_subs y RPC subscribe_push que
--  permite a anon registrar su endpoint sin exponer la tabla.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.push_subs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL,
  endpoint      text NOT NULL UNIQUE,
  p256dh        text NOT NULL,
  auth          text NOT NULL,
  user_agent    text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Index para lookup por email (broadcast targeting)
CREATE INDEX IF NOT EXISTS push_subs_email_idx ON public.push_subs (email);

-- RLS: ningun SELECT/UPDATE/DELETE directo desde anon
ALTER TABLE public.push_subs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
--  RPC: subscribe_push
--  - Inserta o actualiza por endpoint UNIQUE
--  - Valida que el email exista en waitlist (gate de subscripcion)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.subscribe_push(
  p_email     text,
  p_endpoint  text,
  p_p256dh    text,
  p_auth      text,
  p_ua        text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
BEGIN
  v_email := lower(trim(p_email));

  IF v_email IS NULL
     OR v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    RAISE EXCEPTION 'email_invalid' USING ERRCODE = '22023';
  END IF;

  IF p_endpoint IS NULL OR length(p_endpoint) < 20 THEN
    RAISE EXCEPTION 'endpoint_invalid' USING ERRCODE = '22023';
  END IF;

  -- Solo permitir suscripciones de emails que ya estan en waitlist
  IF NOT EXISTS (SELECT 1 FROM public.waitlist WHERE email = v_email) THEN
    RAISE EXCEPTION 'email_not_in_waitlist' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.push_subs (email, endpoint, p256dh, auth, user_agent)
    VALUES (v_email, p_endpoint, p_p256dh, p_auth, p_ua)
    ON CONFLICT (endpoint) DO UPDATE
      SET email = EXCLUDED.email,
          p256dh = EXCLUDED.p256dh,
          auth = EXCLUDED.auth,
          user_agent = EXCLUDED.user_agent,
          updated_at = now();

  RETURN jsonb_build_object('subscribed', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.subscribe_push(text, text, text, text, text)
  TO anon, authenticated;
