-- =============================================================================
-- Migration 4: Admin-managed user subscriptions & grants
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_plan_id uuid REFERENCES public.plans(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'inactive'
    CHECK (subscription_status IN ('inactive', 'active', 'expired', 'granted')),
  ADD COLUMN IF NOT EXISTS subscription_active_from timestamptz,
  ADD COLUMN IF NOT EXISTS subscription_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS invitation_chatbot_enabled_override boolean,
  ADD COLUMN IF NOT EXISTS invitation_chat_daily_limit_override integer
    CHECK (invitation_chat_daily_limit_override IS NULL OR invitation_chat_daily_limit_override >= 0),
  ADD COLUMN IF NOT EXISTS granted_features jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS admin_notes text;

CREATE INDEX IF NOT EXISTS idx_profiles_subscription_plan_id
  ON public.profiles(subscription_plan_id);

CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status
  ON public.profiles(subscription_status);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'profiles_admin_select_all'
  ) THEN
    CREATE POLICY "profiles_admin_select_all"
      ON public.profiles FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM public.profiles admin_profile
          WHERE admin_profile.id = auth.uid()
            AND admin_profile.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'profiles_admin_update_all'
  ) THEN
    CREATE POLICY "profiles_admin_update_all"
      ON public.profiles FOR UPDATE
      USING (
        EXISTS (
          SELECT 1
          FROM public.profiles admin_profile
          WHERE admin_profile.id = auth.uid()
            AND admin_profile.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.profiles admin_profile
          WHERE admin_profile.id = auth.uid()
            AND admin_profile.role = 'admin'
        )
      );
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.get_user_subscription_features(target_user_id uuid)
RETURNS TABLE (
  plan_id uuid,
  plan_name text,
  plan_name_ms text,
  is_active boolean,
  source text,
  invitation_chatbot_enabled boolean,
  invitation_chat_daily_limit integer,
  subscription_status text,
  active_from timestamptz,
  expires_at timestamptz,
  granted_features jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_row public.profiles%ROWTYPE;
  plan_row RECORD;
  payment_plan RECORD;
  manual_active boolean;
BEGIN
  SELECT *
  INTO profile_row
  FROM public.profiles
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  IF profile_row.subscription_plan_id IS NOT NULL THEN
    SELECT
      p.id,
      p.name,
      p.name_ms,
      p.chatbot_enabled,
      p.chatbot_daily_limit
    INTO plan_row
    FROM public.plans p
    WHERE p.id = profile_row.subscription_plan_id
    LIMIT 1;

    manual_active := profile_row.subscription_status IN ('active', 'granted');

    IF profile_row.subscription_active_from IS NOT NULL
       AND profile_row.subscription_active_from > now() THEN
      manual_active := false;
    END IF;

    IF profile_row.subscription_expires_at IS NOT NULL
       AND profile_row.subscription_expires_at < now() THEN
      manual_active := false;
    END IF;

    RETURN QUERY
    SELECT
      plan_row.id::uuid,
      plan_row.name::text,
      plan_row.name_ms::text,
      manual_active,
      'profile_override'::text,
      COALESCE(profile_row.invitation_chatbot_enabled_override, COALESCE(plan_row.chatbot_enabled, false)),
      COALESCE(profile_row.invitation_chat_daily_limit_override, COALESCE(plan_row.chatbot_daily_limit, 0)),
      profile_row.subscription_status,
      profile_row.subscription_active_from,
      profile_row.subscription_expires_at,
      COALESCE(profile_row.granted_features, '[]'::jsonb);
    RETURN;
  END IF;

  SELECT
    pl.id,
    pl.name,
    pl.name_ms,
    pl.chatbot_enabled,
    pl.chatbot_daily_limit
  INTO payment_plan
  FROM public.payments pay
  LEFT JOIN public.plans pl
    ON pl.id = pay.plan_id
  WHERE pay.user_id = target_user_id
    AND pay.status = 'succeeded'
  ORDER BY pay.created_at DESC
  LIMIT 1;

  IF FOUND AND payment_plan.id IS NOT NULL THEN
    RETURN QUERY
    SELECT
      payment_plan.id::uuid,
      payment_plan.name::text,
      payment_plan.name_ms::text,
      true,
      'payment_history'::text,
      COALESCE(profile_row.invitation_chatbot_enabled_override, COALESCE(payment_plan.chatbot_enabled, false)),
      COALESCE(profile_row.invitation_chat_daily_limit_override, COALESCE(payment_plan.chatbot_daily_limit, 0)),
      COALESCE(profile_row.subscription_status, 'active'),
      profile_row.subscription_active_from,
      profile_row.subscription_expires_at,
      COALESCE(profile_row.granted_features, '[]'::jsonb);
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    NULL::uuid,
    'Free'::text,
    'Percuma'::text,
    false,
    'free'::text,
    COALESCE(profile_row.invitation_chatbot_enabled_override, false),
    COALESCE(profile_row.invitation_chat_daily_limit_override, 0),
    COALESCE(profile_row.subscription_status, 'inactive'),
    profile_row.subscription_active_from,
    profile_row.subscription_expires_at,
    COALESCE(profile_row.granted_features, '[]'::jsonb);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_subscription_features(uuid) TO anon, authenticated;
