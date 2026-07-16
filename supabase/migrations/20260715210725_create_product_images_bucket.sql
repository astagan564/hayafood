/*
# Create product-images storage bucket

## Overview
Creates a public storage bucket for product images uploaded by admin.
Buyers (anon) can read images; only authenticated admins can upload/update/delete.

## Changes
1. New Storage Bucket
   - `product-images` (public bucket) - stores product image files

2. Storage Policies (on storage.objects)
   - SELECT: anyone (anon, authenticated) can read - images must be publicly visible in the store
   - INSERT: only authenticated (admin) can upload
   - UPDATE: only authenticated (admin) can replace
   - DELETE: only authenticated (admin) can remove

## Notes
1. The bucket is public so product images are accessible without authentication.
2. Only authenticated admins can upload, update, or delete images.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product images
DROP POLICY IF EXISTS "anon_read_product_images" ON storage.objects;
CREATE POLICY "anon_read_product_images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'product-images');

-- Allow authenticated admins to upload
DROP POLICY IF EXISTS "admin_insert_product_images" ON storage.objects;
CREATE POLICY "admin_insert_product_images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated admins to update
DROP POLICY IF EXISTS "admin_update_product_images" ON storage.objects;
CREATE POLICY "admin_update_product_images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated admins to delete
DROP POLICY IF EXISTS "admin_delete_product_images" ON storage.objects;
CREATE POLICY "admin_delete_product_images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');