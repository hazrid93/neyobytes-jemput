-- =============================================================================
-- Migration 2: Site Settings + Chat Config + Chatbot Usage
-- Run this in the Supabase SQL Editor for project hdhhfvromohwxgpwnkcw
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. SITE SETTINGS TABLE
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id                text PRIMARY KEY,
  company_name      text NOT NULL DEFAULT 'Jemput by Neyobytes',
  company_tagline   text NOT NULL DEFAULT 'Platform kad kahwin digital premium untuk pasangan Malaysia moden.',
  about_short       text NOT NULL DEFAULT 'Jemput membantu pasangan Malaysia membina kad kahwin digital yang cantik, mudah dikongsi, dan mudah diurus dari RSVP hingga ke salam kaut digital.',
  contact_email     text NOT NULL DEFAULT 'hello@jemput.neyobytes.com',
  contact_phone     text,
  address           text,
  instagram_url     text,
  facebook_url      text,
  x_url             text,
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'site_settings_select_public' AND tablename = 'site_settings'
  ) THEN
    CREATE POLICY "site_settings_select_public" ON public.site_settings FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'site_settings_admin_all' AND tablename = 'site_settings'
  ) THEN
    CREATE POLICY "site_settings_admin_all" ON public.site_settings FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );
  END IF;
END $$;

-- Seed default row
INSERT INTO public.site_settings (
  id,
  company_name,
  company_tagline,
  about_short,
  contact_email,
  address
) VALUES (
  'main',
  'Jemput by Neyobytes',
  'Platform kad kahwin digital premium untuk pasangan Malaysia moden.',
  'Jemput membantu pasangan Malaysia membina kad kahwin digital yang cantik, mudah dikongsi, dan mudah diurus dari RSVP hingga ke salam kaut digital.',
  'hello@jemput.neyobytes.com',
  'Malaysia'
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. CHAT CONFIG COLUMNS (added to site_settings)
-- ---------------------------------------------------------------------------
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cuba_preview_chat_enabled boolean NOT NULL DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cuba_preview_chat_daily_limit integer NOT NULL DEFAULT 10;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cuba_editor_chat_enabled boolean NOT NULL DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cuba_editor_chat_daily_limit integer NOT NULL DEFAULT 10;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS editor_chat_enabled boolean NOT NULL DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS editor_chat_daily_limit integer NOT NULL DEFAULT 20;

-- ---------------------------------------------------------------------------
-- 3. CHATBOT USAGE TRACKING TABLE
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chatbot_usage (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id   uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  visitor_id      text NOT NULL,
  date            date NOT NULL DEFAULT CURRENT_DATE,
  count           integer NOT NULL DEFAULT 1,
  created_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chatbot_usage_unique UNIQUE (invitation_id, visitor_id, date)
);

CREATE INDEX IF NOT EXISTS idx_chatbot_usage_lookup ON public.chatbot_usage (invitation_id, visitor_id, date);

ALTER TABLE public.chatbot_usage ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'chatbot_usage_insert_anyone' AND tablename = 'chatbot_usage'
  ) THEN
    CREATE POLICY "chatbot_usage_insert_anyone" ON public.chatbot_usage FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'chatbot_usage_select_anyone' AND tablename = 'chatbot_usage'
  ) THEN
    CREATE POLICY "chatbot_usage_select_anyone" ON public.chatbot_usage FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'chatbot_usage_update_anyone' AND tablename = 'chatbot_usage'
  ) THEN
    CREATE POLICY "chatbot_usage_update_anyone" ON public.chatbot_usage FOR UPDATE USING (true);
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 4. FORCE POSTGREST SCHEMA CACHE RELOAD
-- ---------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
