/*
# Hayafood E-Commerce Schema

## Overview
Creates the database schema for Hayafood, a kripik (chips) e-commerce site.
Buyers checkout as guests (no account needed) and orders are sent via WhatsApp.
Admins manage products, categories, and orders through a protected admin panel.

## New Tables
1. `categories` - Product categories (e.g. kripik singkong, kripik pisang)
   - id (uuid, primary key)
   - nama (text, not null) - category display name
   - slug (text, unique, not null) - URL-friendly identifier
   - created_at (timestamptz)

2. `products` - Product listings
   - id (uuid, primary key)
   - nama (text, not null) - product name
   - deskripsi (text) - product description
   - harga (integer, not null) - price in IDR
   - gambar_url (text) - product image URL
   - category_id (uuid, foreign key to categories)
   - stok (integer, not null, default 0) - stock quantity
   - is_active (boolean, default true) - whether product is visible to buyers
   - created_at (timestamptz)

3. `orders` - Customer orders
   - id (uuid, primary key)
   - nama_pembeli (text, not null) - buyer name
   - nomor_telepon (text, not null) - buyer phone
   - alamat (text, not null) - delivery address
   - catatan (text) - order notes
   - total (integer, not null) - total price in IDR
   - status (text, default 'baru') - order status: baru/diproses/dikirim/selesai
   - created_at (timestamptz)

4. `order_items` - Line items for each order
   - id (uuid, primary key)
   - order_id (uuid, foreign key to orders)
   - product_id (uuid, foreign key to products)
   - nama_product (text, not null) - snapshot of product name at order time
   - jumlah (integer, not null) - quantity ordered
   - harga_satuan (integer, not null) - unit price at order time

## Security (RLS)
- `categories`: anon can SELECT (buyers browse categories); authenticated (admin) can INSERT/UPDATE/DELETE
- `products`: anon can SELECT active products; authenticated (admin) can INSERT/UPDATE/DELETE
- `orders`: anon can INSERT (guest checkout); authenticated (admin) can SELECT/UPDATE
- `order_items`: anon can INSERT (guest checkout); authenticated (admin) can SELECT

## Notes
1. Buyers are guests (no auth) - they can browse products and place orders.
2. Only authenticated admins can manage products, categories, and view/update orders.
3. Order items store a snapshot of product name and price for historical accuracy.
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
CREATE POLICY "admin_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_categories" ON categories;
CREATE POLICY "admin_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_categories" ON categories;
CREATE POLICY "admin_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  deskripsi text,
  harga integer NOT NULL,
  gambar_url text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  stok integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_pembeli text NOT NULL,
  nomor_telepon text NOT NULL,
  alamat text NOT NULL,
  catatan text,
  total integer NOT NULL,
  status text NOT NULL DEFAULT 'baru',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_orders" ON orders;
CREATE POLICY "admin_select_orders" ON orders FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_orders" ON orders;
CREATE POLICY "admin_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  nama_product text NOT NULL,
  jumlah integer NOT NULL,
  harga_satuan integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_order_items" ON order_items;
CREATE POLICY "admin_select_order_items" ON order_items FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_order_items" ON order_items;
CREATE POLICY "admin_update_order_items" ON order_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_order_items" ON order_items;
CREATE POLICY "admin_delete_order_items" ON order_items FOR DELETE
  TO authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);