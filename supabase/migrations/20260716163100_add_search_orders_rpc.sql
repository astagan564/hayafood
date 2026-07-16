-- Migration: Add search_order_by_id_prefix RPC function
-- Creates a function to allow public/guest prefix matching on order IDs (since UUID columns cannot be directly queried with ILIKE in standard client requests).

CREATE OR REPLACE FUNCTION public.search_order_by_id_prefix(prefix text)
RETURNS SETOF public.orders
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.orders
  WHERE id::text ILIKE prefix || '%';
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_order_by_id_prefix(text) TO anon, authenticated;
