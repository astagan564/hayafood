-- Fix: Mark trigger functions as SECURITY DEFINER so they run with
-- the privileges of the function owner (postgres) instead of the
-- calling role (anon). This allows the trigger to UPDATE products.stok
-- even when called by a guest/anon user during checkout.
-- Idempotent: CREATE OR REPLACE.

CREATE OR REPLACE FUNCTION public.reduce_product_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  available_stok INTEGER;
BEGIN
  SELECT stok INTO available_stok FROM public.products WHERE id = NEW.product_id;

  IF available_stok IS NULL THEN
    RAISE EXCEPTION 'Produk tidak ditemukan.';
  ELSIF available_stok < NEW.jumlah THEN
    RAISE EXCEPTION 'Stok untuk produk ini tidak mencukupi.';
  END IF;

  UPDATE public.products
  SET stok = stok - NEW.jumlah
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.restore_product_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products
  SET stok = stok + OLD.jumlah
  WHERE id = OLD.product_id;

  RETURN OLD;
END;
$$;
