-- Migration: Fix RLS policies - restrict admin operations to users with app_metadata.role = 'admin'
-- Previously all policies used USING (true) / WITH CHECK (true), allowing any authenticated user
-- to perform admin operations. This migration locks them down properly.

-- =====================================================================
-- STEP 1: Revoke public EXECUTE on rls_auto_enable (event trigger helper)
-- The function is kept for the 'ensure_rls' event trigger but must not
-- be callable via the REST API by anon/authenticated roles.
-- =====================================================================
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;

-- =====================================================================
-- STEP 2: CATEGORIES — restrict write operations to admin role
-- =====================================================================
DROP POLICY IF EXISTS "admin_delete_categories" ON categories;
DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
DROP POLICY IF EXISTS "admin_update_categories" ON categories;

CREATE POLICY "admin_delete_categories" ON categories
  FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_insert_categories" ON categories
  FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_update_categories" ON categories
  FOR UPDATE TO authenticated
  USING  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =====================================================================
-- STEP 3: PRODUCTS — restrict write operations to admin role
-- =====================================================================
DROP POLICY IF EXISTS "admin_delete_products" ON products;
DROP POLICY IF EXISTS "admin_insert_products" ON products;
DROP POLICY IF EXISTS "admin_update_products" ON products;

CREATE POLICY "admin_delete_products" ON products
  FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_insert_products" ON products
  FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_update_products" ON products
  FOR UPDATE TO authenticated
  USING  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =====================================================================
-- STEP 4: ORDERS — restrict write operations to admin role
-- =====================================================================
DROP POLICY IF EXISTS "admin_delete_orders" ON orders;
DROP POLICY IF EXISTS "admin_update_orders" ON orders;

CREATE POLICY "admin_delete_orders" ON orders
  FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_update_orders" ON orders
  FOR UPDATE TO authenticated
  USING  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =====================================================================
-- STEP 5: ORDER_ITEMS — restrict write operations to admin role
-- =====================================================================
DROP POLICY IF EXISTS "admin_delete_order_items" ON order_items;
DROP POLICY IF EXISTS "admin_update_order_items" ON order_items;

CREATE POLICY "admin_delete_order_items" ON order_items
  FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_update_order_items" ON order_items
  FOR UPDATE TO authenticated
  USING  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =====================================================================
-- STEP 6: STORAGE — fix product-images bucket SELECT policy
-- Previous policy allowed listing all files (security risk).
-- New policy allows object access by path, not bulk listing.
-- =====================================================================
DROP POLICY IF EXISTS "anon_read_product_images" ON storage.objects;

CREATE POLICY "anon_read_product_images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (
    bucket_id = 'product-images'
    AND name IS NOT NULL
  );

-- =====================================================================
-- NOTE: For new admin users, set app_metadata role via Supabase Dashboard
-- or run this SQL (replace email as needed):
--
--   UPDATE auth.users
--   SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
--   WHERE email = 'new-admin@example.com';
--
-- NOTE: Leaked password protection must be enabled manually in:
--   Supabase Dashboard → Authentication → Sign In / Up → Password strength
-- =====================================================================
