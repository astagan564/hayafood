-- Migration: Create instagram_embeds table
-- Stores URL and formatted embed URLs for Instagram Reels/Posts.
-- RLS policies allow guest/public reading and full admin access.

CREATE TABLE IF NOT EXISTS public.instagram_embeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_url text NOT NULL,
  embed_url text NOT NULL,
  label text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.instagram_embeds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_instagram_embeds" ON public.instagram_embeds;
CREATE POLICY "anon_select_instagram_embeds" ON public.instagram_embeds FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_all_instagram_embeds" ON public.instagram_embeds;
CREATE POLICY "admin_all_instagram_embeds" ON public.instagram_embeds FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

GRANT SELECT ON public.instagram_embeds TO anon, authenticated;
GRANT ALL ON public.instagram_embeds TO authenticated;
