-- =============================================
-- VERIFICAR SE OS USUÁRIOS EXISTEM
-- Execute este SQL para verificar se os usuários foram criados
-- =============================================

-- Verificar se a tabela existe
SELECT 
  table_schema,
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'mentoria' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Verificar se os usuários existem
SELECT 
  id,
  email,
  role,
  full_name,
  created_at,
  CASE 
    WHEN password_hash IS NULL THEN '❌ SEM SENHA'
    WHEN password_hash = '' THEN '❌ SENHA VAZIA'
    WHEN length(password_hash) < 20 THEN '❌ HASH INVÁLIDO'
    ELSE '✅ HASH OK'
  END as status_senha,
  length(password_hash) as tamanho_hash
FROM mentoria.users
WHERE email IN ('mentor@mentoria.com', 'aluno@mentoria.com')
ORDER BY email;

-- Se não retornar nenhum resultado, execute:
-- 1. atualizar_tabela_users.sql (para criar a tabela)
-- 2. criar_login_simples.sql (para criar os usuários)
