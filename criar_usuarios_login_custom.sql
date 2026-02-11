-- =============================================
-- CRIAR USUÁRIOS PARA LOGIN CUSTOMIZADO
-- Execute este SQL após gerar os hashes de senha
-- =============================================

-- IMPORTANTE: Primeiro gere os hashes usando o script:
-- node scripts/generate-password-hash.js "Mentor123!@#"
-- node scripts/generate-password-hash.js "Aluno123!@#"

-- Depois substitua os hashes abaixo pelos hashes gerados

-- Criar usuário mentor
-- Email: mentor@mentoria.com
-- Senha: Mentor123!@#
INSERT INTO mentoria.users (email, password_hash, role, full_name)
VALUES (
  'mentor@mentoria.com',
  'SUBSTITUA_PELO_HASH_DO_MENTOR', -- Cole o hash gerado aqui
  'mentor',
  'Mentor Principal'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash;

-- Criar usuário aluno
-- Email: aluno@mentoria.com
-- Senha: Aluno123!@#
INSERT INTO mentoria.users (email, password_hash, role, full_name)
VALUES (
  'aluno@mentoria.com',
  'SUBSTITUA_PELO_HASH_DO_ALUNO', -- Cole o hash gerado aqui
  'aluno',
  'Aluno Teste'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash;

-- =============================================
-- CREDENCIAIS:
-- =============================================
-- MENTOR:
-- Email: mentor@mentoria.com
-- Senha: Mentor123!@#
-- =============================================
-- ALUNO:
-- Email: aluno@mentoria.com
-- Senha: Aluno123!@#
-- =============================================
