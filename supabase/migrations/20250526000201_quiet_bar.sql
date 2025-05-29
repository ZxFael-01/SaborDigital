/*
  # Initial Schema Setup for Digital Menu System

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - Reference to auth.users
      - `email` (text, unique)
      - `role` (text)
      - `created_at` (timestamp)

    - `menu_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `image_url` (text)
      - `category` (text)
      - `is_available` (boolean)
      - `created_at` (timestamp)

    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `total_amount` (numeric)
      - `status` (text)
      - `payment_method` (text)
      - `is_delivery` (boolean)
      - `delivery_address` (text)
      - `created_at` (timestamp)

    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `menu_item_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price` (numeric)
      - `created_at` (timestamp)

    - `theme_settings`
      - `id` (uuid, primary key)
      - `primary_color` (text)
      - `secondary_color` (text)
      - `accent_color` (text)
      - `background_image` (text)
      - `logo_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for CRUD operations
*/

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  is_delivery BOOLEAN DEFAULT TRUE,
  delivery_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Theme settings table
CREATE TABLE IF NOT EXISTS theme_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_color TEXT DEFAULT '#1E1E1E',
  secondary_color TEXT DEFAULT '#000000',
  accent_color TEXT DEFAULT '#FFD700',
  background_image TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Policies for menu_items
CREATE POLICY "Anyone can view menu items"
  ON menu_items
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can insert menu items"
  ON menu_items
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update menu items"
  ON menu_items
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete menu items"
  ON menu_items
  FOR DELETE
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can insert orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any order"
  ON orders
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Policies for order_items
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING ((SELECT user_id FROM orders WHERE id = order_items.order_id) = auth.uid());

CREATE POLICY "Admins can view all order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can insert order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT user_id FROM orders WHERE id = order_items.order_id) = auth.uid());

-- Policies for theme_settings
CREATE POLICY "Anyone can view theme settings"
  ON theme_settings
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage theme settings"
  ON theme_settings
  FOR ALL
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Insert default theme settings
INSERT INTO theme_settings (primary_color, secondary_color, accent_color)
VALUES ('#1E1E1E', '#000000', '#FFD700');

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, image_url, category)
VALUES 
  ('Baião de Dois', 'Prato tradicional nordestino com arroz, feijão de corda, queijo coalho e carne seca.', 39.90, 'https://images.pexels.com/photos/5836649/pexels-photo-5836649.jpeg', 'Pratos Principais'),
  ('Acarajé', 'Bolinho de feijão fradinho frito em azeite de dendê, recheado com vatapá, camarão e vinagrete.', 25.90, 'https://images.pexels.com/photos/5865511/pexels-photo-5865511.jpeg', 'Petiscos'),
  ('Carne de Sol com Macaxeira', 'Carne de sol grelhada, acompanhada de macaxeira frita e manteiga de garrafa.', 45.90, 'https://images.pexels.com/photos/6697469/pexels-photo-6697469.jpeg', 'Pratos Principais'),
  ('Cartola', 'Sobremesa típica com banana frita, queijo coalho e canela.', 18.90, 'https://images.pexels.com/photos/6483421/pexels-photo-6483421.jpeg', 'Sobremesas'),
  ('Caldinho de Feijão', 'Caldo cremoso de feijão, temperado com bacon, calabresa e temperos nordestinos.', 15.90, 'https://images.pexels.com/photos/6726447/pexels-photo-6726447.jpeg', 'Petiscos'),
  ('Tapioca Recheada', 'Tapioca recheada com carne de sol, queijo coalho e banana.', 22.90, 'https://images.pexels.com/photos/5946431/pexels-photo-5946431.jpeg', 'Lanches');