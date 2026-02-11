-- =============================================
-- DIAGNÓSTICO: Verificar se o Trigger está Funcionando
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- 1. Verificar se o trigger existe
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Verificar se a função existe
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'mentoria'
  AND routine_name = 'handle_new_user';

-- 3. Verificar usuários sem perfil
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'role' as role_metadata,
  u.created_at,
  p.user_id as has_profile
FROM auth.users u
LEFT JOIN mentoria.profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL
ORDER BY u.created_at DESC
LIMIT 10;

-- 4. Verificar últimos perfis criados
SELECT 
  p.user_id,
  p.role,
  p.full_name,
  p.created_at,
  u.email
FROM mentoria.profiles p
JOIN auth.users u ON u.id = p.user_id
ORDER BY p.created_at DESC
LIMIT 10;

-- 5. Verificar se o schema existe
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'mentoria';

-- 6. Verificar se a tabela profiles existe
SELECT 
  table_name,
  table_schema
FROM information_schema.tables
WHERE table_schema = 'mentoria'
  AND table_name = 'profiles';
