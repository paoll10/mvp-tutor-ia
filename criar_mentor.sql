-- =============================================
-- CRIAR USUÁRIO MENTOR
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- 1. Criar usuário no auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'mentor@mentoria.com',  -- Email do mentor
  crypt('Mentor123!@#', gen_salt('bf')),  -- Senha: Mentor123!@#
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"mentor","full_name":"Mentor Principal"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- 2. Criar profile do mentor
INSERT INTO mentoria.profiles (user_id, role, full_name)
SELECT 
  id as user_id,
  'mentor' as role,
  'Mentor Principal' as full_name
FROM auth.users
WHERE email = 'mentor@mentoria.com'
  AND id NOT IN (SELECT user_id FROM mentoria.profiles)
RETURNING *;

-- =============================================
-- CREDENCIAIS DO MENTOR:
-- Email: mentor@mentoria.com
-- Senha: Mentor123!@#
-- =============================================
