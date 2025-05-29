-- Create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  'a96ea309-eb6a-4be6-9891-00d89f881f5a'::uuid,
  'authenticated',
  'authenticated',
  'admin@saboresnordeste.com.br',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now()
);

-- Create admin profile
INSERT INTO users (id, name, role)
VALUES (
  'a96ea309-eb6a-4be6-9891-00d89f881f5a'::uuid,
  'Administrador',
  'admin'
);