-- Migration: Add position column to instagram_embeds for manual ordering
-- Idempotent: uses IF NOT EXISTS.

ALTER TABLE public.instagram_embeds ADD COLUMN IF NOT EXISTS position integer;

-- Backfill existing rows with a position based on created_at order
-- so older rows don't all get NULL position.
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS rn
  FROM public.instagram_embeds
  WHERE position IS NULL
)
UPDATE public.instagram_embeds
SET position = ranked.rn
FROM ranked
WHERE public.instagram_embeds.id = ranked.id;
