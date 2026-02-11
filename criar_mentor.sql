-- =============================================
-- CRIAR USUÁRIO MENTOR
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- 1. Verificar se o usuário já existe e criar se não existir
DO $$
DECLARE
  mentor_user_id uuid;
  mentor_exists boolean;
BEGIN
  -- Verifica se já existe
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE email = 'mentor@mentoria.com'
  ) INTO mentor_exists;
  
  IF NOT mentor_exists THEN
    -- Cria o usuário
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
      'mentor@mentoria.com',
      crypt('Mentor123!@#', gen_salt('bf')),
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
    RETURNING id INTO mentor_user_id;
    
    RAISE NOTICE '✅ Usuário mentor criado com ID: %', mentor_user_id;
  ELSE
    SELECT id INTO mentor_user_id FROM auth.users WHERE email = 'mentor@mentoria.com';
    RAISE NOTICE 'ℹ️ Usuário mentor já existe com ID: %', mentor_user_id;
  END IF;
END $$;

-- 2. Criar profile do mentor (se não existir)
INSERT INTO mentoria.profiles (user_id, role, full_name)
SELECT 
  id as user_id,
  'mentor' as role,
  'Mentor Principal' as full_name
FROM auth.users
WHERE email = 'mentor@mentoria.com'
  AND id NOT IN (SELECT user_id FROM mentoria.profiles WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING
RETURNING *;

-- =============================================
-- CREDENCIAIS DO MENTOR:
-- Email: mentor@mentoria.com
-- Senha: Mentor123!@#
-- =============================================
