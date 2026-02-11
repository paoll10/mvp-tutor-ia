-- =============================================
-- CRIAR TRIGGER AUTOMÁTICO PARA PROFILES
-- Este SQL cria tudo automaticamente: schema, tabela e trigger
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- 1. Criar schema se não existir
CREATE SCHEMA IF NOT EXISTS mentoria;

-- 2. Dar permissões no schema
GRANT USAGE ON SCHEMA mentoria TO anon;
GRANT USAGE ON SCHEMA mentoria TO authenticated;
GRANT USAGE ON SCHEMA mentoria TO service_role;

-- 3. Criar tabela profiles se não existir
CREATE TABLE IF NOT EXISTS mentoria.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('mentor', 'aluno')),
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Dar permissões na tabela
GRANT ALL ON TABLE mentoria.profiles TO anon;
GRANT ALL ON TABLE mentoria.profiles TO authenticated;
GRANT ALL ON TABLE mentoria.profiles TO service_role;

-- 5. Criar função que cria o profile automaticamente
CREATE OR REPLACE FUNCTION mentoria.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  -- Pega o role do user_metadata, ou usa 'aluno' como padrão
  user_role := COALESCE(
    NEW.raw_user_meta_data->>'role',
    'aluno'
  );
  
  -- Garante que o role é válido
  IF user_role NOT IN ('mentor', 'aluno') THEN
    user_role := 'aluno';
  END IF;
  
  -- Cria o profile (ignora se já existir)
  INSERT INTO mentoria.profiles (user_id, role, full_name)
  VALUES (
    NEW.id,
    user_role,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 6. Criar trigger que executa a função quando um novo usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION mentoria.handle_new_user();

-- 7. Criar perfis para usuários existentes que não têm perfil
INSERT INTO mentoria.profiles (user_id, role, full_name)
SELECT
  au.id,
  COALESCE(
    (au.raw_user_meta_data->>'role')::text,
    'aluno'
  )::text,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    split_part(au.email, '@', 1)
  )
FROM auth.users AS au
LEFT JOIN mentoria.profiles AS mp ON au.id = mp.user_id
WHERE mp.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- =============================================
-- ✅ PRONTO!
-- =============================================
-- Agora:
-- 1. Todo novo usuário criado terá um profile automaticamente
-- 2. Usuários existentes sem perfil também receberam um perfil
-- 3. O role vem do user_metadata (passado no signup)
-- 4. Se não tiver role, usa 'aluno' como padrão
-- =============================================
