/*
  # Create Admin User

  1. Changes
    - Create admin user in auth.users table
    - Create corresponding profile in profiles table
    - Set admin role

  2. Security
    - Uses secure UUID for user ID
    - Maintains referential integrity
*/

-- Create admin user in auth.users
DO $$
DECLARE
  admin_uid UUID;
BEGIN
  -- Insert into auth.users and get the ID
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@example.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex')
  )
  RETURNING id INTO admin_uid;

  -- Insert corresponding profile
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    admin_uid,
    'admin@example.com',
    'admin'
  );
END $$;