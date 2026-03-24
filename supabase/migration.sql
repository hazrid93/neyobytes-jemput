-- =============================================================================
-- Jemput - Kad Kahwin Digital
-- Complete Database Schema Migration
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- PROFILES (extends auth.users)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL,
  full_name   text,
  phone       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for trigger / client fallback)
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================================================
-- INVITATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.invitations (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug                text NOT NULL,
  status              text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  template            text NOT NULL DEFAULT 'classic',

  -- Couple info
  bride_name          text NOT NULL DEFAULT '',
  groom_name          text NOT NULL DEFAULT '',
  bride_parent_names  text NOT NULL DEFAULT '',
  groom_parent_names  text NOT NULL DEFAULT '',
  couple_photo_url    text,
  cover_photo_url     text,

  -- Event details
  event_date          text NOT NULL DEFAULT '',
  event_time_start    text NOT NULL DEFAULT '',
  event_time_end      text NOT NULL DEFAULT '',
  venue_name          text NOT NULL DEFAULT '',
  venue_address       text NOT NULL DEFAULT '',
  venue_lat           numeric,
  venue_lng           numeric,

  -- Content
  invitation_text     text NOT NULL DEFAULT '',
  music_url           text,
  itinerary           jsonb NOT NULL DEFAULT '[]'::jsonb,
  contacts            jsonb NOT NULL DEFAULT '[]'::jsonb,
  money_gift          jsonb,
  wishlist            jsonb NOT NULL DEFAULT '[]'::jsonb,
  theme_config        jsonb NOT NULL DEFAULT '{
    "primary_color": "#8B6F4E",
    "secondary_color": "#D4AF37",
    "accent_color": "#F5E6D3",
    "bg_color": "#FDF8F0",
    "text_color": "#2C1810",
    "font_display": "Playfair Display",
    "font_body": "Poppins",
    "font_arabic": "Amiri"
  }'::jsonb,

  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT invitations_slug_unique UNIQUE (slug)
);

-- Index on slug for fast public lookups
CREATE INDEX idx_invitations_slug ON public.invitations (slug);

-- Index on user_id for dashboard queries
CREATE INDEX idx_invitations_user_id ON public.invitations (user_id);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Owner can do everything with own invitations
CREATE POLICY "invitations_select_own"
  ON public.invitations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "invitations_insert_own"
  ON public.invitations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "invitations_update_own"
  ON public.invitations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "invitations_delete_own"
  ON public.invitations FOR DELETE
  USING (auth.uid() = user_id);

-- Anyone can read published invitations (public guest access)
CREATE POLICY "invitations_select_published"
  ON public.invitations FOR SELECT
  USING (status = 'published');

-- Auto-update updated_at on modification
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_invitations_updated
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- RSVPS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.rsvps (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id   uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name      text NOT NULL,
  phone           text,
  attending       boolean NOT NULL DEFAULT true,
  num_adults      integer NOT NULL DEFAULT 1 CHECK (num_adults >= 0),
  num_children    integer NOT NULL DEFAULT 0 CHECK (num_children >= 0),
  message         text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_rsvps_invitation_id ON public.rsvps (invitation_id);

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an RSVP (public guest action)
CREATE POLICY "rsvps_insert_anyone"
  ON public.rsvps FOR INSERT
  WITH CHECK (true);

-- Invitation owner can read RSVPs for their invitations
CREATE POLICY "rsvps_select_owner"
  ON public.rsvps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = rsvps.invitation_id
        AND invitations.user_id = auth.uid()
    )
  );

-- Invitation owner can delete RSVPs
CREATE POLICY "rsvps_delete_owner"
  ON public.rsvps FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = rsvps.invitation_id
        AND invitations.user_id = auth.uid()
    )
  );

-- =============================================================================
-- GUESTBOOK MESSAGES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.guestbook_messages (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id   uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  name            text NOT NULL,
  message         text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_guestbook_messages_invitation_id ON public.guestbook_messages (invitation_id);

ALTER TABLE public.guestbook_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can post a guestbook message (public guest action)
CREATE POLICY "guestbook_insert_anyone"
  ON public.guestbook_messages FOR INSERT
  WITH CHECK (true);

-- Anyone can read guestbook messages for published invitations
CREATE POLICY "guestbook_select_published"
  ON public.guestbook_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = guestbook_messages.invitation_id
        AND invitations.status = 'published'
    )
  );

-- Invitation owner can read all guestbook messages for their invitations
CREATE POLICY "guestbook_select_owner"
  ON public.guestbook_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = guestbook_messages.invitation_id
        AND invitations.user_id = auth.uid()
    )
  );

-- Invitation owner can delete guestbook messages
CREATE POLICY "guestbook_delete_owner"
  ON public.guestbook_messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = guestbook_messages.invitation_id
        AND invitations.user_id = auth.uid()
    )
  );

-- =============================================================================
-- GALLERY IMAGES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id   uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  url             text NOT NULL,
  sort_order      integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_gallery_images_invitation_id ON public.gallery_images (invitation_id);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Invitation owner can do everything with their gallery images
CREATE POLICY "gallery_select_owner"
  ON public.gallery_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = gallery_images.invitation_id
        AND invitations.user_id = auth.uid()
    )
  );

CREATE POLICY "gallery_insert_owner"
  ON public.gallery_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = gallery_images.invitation_id
        AND invitations.user_id = auth.uid()
    )
  );

CREATE POLICY "gallery_update_owner"
  ON public.gallery_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = gallery_images.invitation_id
        AND invitations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = gallery_images.invitation_id
        AND invitations.user_id = auth.uid()
    )
  );

CREATE POLICY "gallery_delete_owner"
  ON public.gallery_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = gallery_images.invitation_id
        AND invitations.user_id = auth.uid()
    )
  );

-- Anyone can view gallery images for published invitations
CREATE POLICY "gallery_select_published"
  ON public.gallery_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = gallery_images.invitation_id
        AND invitations.status = 'published'
    )
  );

-- =============================================================================
-- STORAGE BUCKET for invitation images
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'invitation-images',
  'invitation-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Anyone can read public bucket images
CREATE POLICY "storage_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'invitation-images');

-- Authenticated users can upload to their own folder (user_id/*)
CREATE POLICY "storage_auth_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'invitation-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own files
CREATE POLICY "storage_auth_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'invitation-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own files
CREATE POLICY "storage_auth_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'invitation-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- =============================================================================
-- AUTO-CREATE PROFILE ON AUTH SIGNUP
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to allow re-runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
