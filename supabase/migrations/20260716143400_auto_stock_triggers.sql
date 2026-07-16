-- Migration: Automatic stock reduction and restoration triggers
-- Automatically reduces product stock when order_items are added.
-- Automatically restores product stock when order_items are deleted (or when orders are deleted due to cascade).

-- Create function to reduce stock when order_items are added
CREATE OR REPLACE FUNCTION public.reduce_product_stock()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on insert into order_items
DROP TRIGGER IF EXISTS trigger_reduce_product_stock ON public.order_items;
CREATE TRIGGER trigger_reduce_product_stock
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.reduce_product_stock();

-- Create function to restore stock when order_items are deleted
CREATE OR REPLACE FUNCTION public.restore_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET stok = stok + OLD.jumlah
  WHERE id = OLD.product_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on delete from order_items
DROP TRIGGER IF EXISTS trigger_restore_product_stock ON public.order_items;
CREATE TRIGGER trigger_restore_product_stock
  AFTER DELETE ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.restore_product_stock();
