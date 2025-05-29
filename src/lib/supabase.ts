import { createClient } from '@supabase/supabase-js';

// These values should come from environment variables in a production environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

// Database types for strongly typed queries
export type User = {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  created_at: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_available: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  delivery_address?: string;
  is_delivery: boolean;
  payment_method: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  name: string;
};

export type ThemeSettings = {
  id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_image: string;
  logo_url: string;
  created_at: string;
};