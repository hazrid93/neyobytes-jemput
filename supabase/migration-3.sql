-- migration-3.sql
-- Shared-pool chatbot quota tracking (replaces per-visitor localStorage tracking)

-- ---------------------------------------------------------------------------
-- 1. New table: chatbot_pool_usage
--    One row per pool per day. All visitors/users share the same counter.
--    Pool key examples:
--      'cuba_preview'            — /cuba demo preview chatbot
--      'cuba_editor'             — /cuba trial editor assistant
--      'editor'                  — signed-in editor assistant
--      'invitation:<uuid>'       — published invitation chatbot
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chatbot_pool_usage (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pool_key   text NOT NULL,
  date       date NOT NULL DEFAULT CURRENT_DATE,
  count      integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chatbot_pool_usage_unique UNIQUE (pool_key, date)
);

CREATE INDEX IF NOT EXISTS idx_chatbot_pool_usage_lookup
  ON public.chatbot_pool_usage (pool_key, date);

ALTER TABLE public.chatbot_pool_usage ENABLE ROW LEVEL SECURITY;

-- Public access — anonymous guests need to call the RPC
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'chatbot_pool_select_anyone'
  ) THEN
    CREATE POLICY chatbot_pool_select_anyone
      ON public.chatbot_pool_usage FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'chatbot_pool_insert_anyone'
  ) THEN
    CREATE POLICY chatbot_pool_insert_anyone
      ON public.chatbot_pool_usage FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'chatbot_pool_update_anyone'
  ) THEN
    CREATE POLICY chatbot_pool_update_anyone
      ON public.chatbot_pool_usage FOR UPDATE USING (true);
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 2. Atomic check-and-increment RPC function
--    Returns: { "allowed": bool, "remaining": int, "used": int }
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_and_increment_chat_quota(
  p_pool_key   text,
  p_daily_limit integer
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer;
BEGIN
  -- 0 or negative limit means unlimited
  IF p_daily_limit <= 0 THEN
    RETURN jsonb_build_object('allowed', true, 'remaining', 999, 'used', 0);
  END IF;

  -- Upsert: create today's row if it doesn't exist
  INSERT INTO public.chatbot_pool_usage (pool_key, date, count)
  VALUES (p_pool_key, CURRENT_DATE, 0)
  ON CONFLICT (pool_key, date) DO NOTHING;

  -- Lock the row and read current count
  SELECT count INTO v_count
  FROM public.chatbot_pool_usage
  WHERE pool_key = p_pool_key AND date = CURRENT_DATE
  FOR UPDATE;

  -- Check if limit reached
  IF v_count >= p_daily_limit THEN
    RETURN jsonb_build_object('allowed', false, 'remaining', 0, 'used', v_count);
  END IF;

  -- Increment
  UPDATE public.chatbot_pool_usage
  SET count = count + 1
  WHERE pool_key = p_pool_key AND date = CURRENT_DATE;

  RETURN jsonb_build_object(
    'allowed', true,
    'remaining', GREATEST(p_daily_limit - v_count - 1, 0),
    'used', v_count + 1
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- 3. New site_settings columns for invitation chatbot config
-- ---------------------------------------------------------------------------
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS invitation_chat_enabled boolean NOT NULL DEFAULT true;

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS invitation_chat_daily_limit integer NOT NULL DEFAULT 20;

-- Update existing row with defaults
UPDATE public.site_settings
SET invitation_chat_enabled = true,
    invitation_chat_daily_limit = 20
WHERE id = 'main'
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings'
      AND column_name = 'invitation_chat_daily_limit'
  );

-- ---------------------------------------------------------------------------
-- 4. Update admin descriptions for shared pool
-- ---------------------------------------------------------------------------
COMMENT ON TABLE public.chatbot_pool_usage IS
  'Shared daily quota pool for all chatbot contexts. One counter per pool_key per day.';

COMMENT ON FUNCTION public.check_and_increment_chat_quota IS
  'Atomically check and increment a shared chatbot quota pool. Returns JSON with allowed, remaining, used.';

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
