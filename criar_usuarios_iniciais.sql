-- =============================================
-- CRIAR USUÁRIOS INICIAIS (MENTOR E ALUNO)
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- 1. Criar usuário MENTOR
INSERT INTO mentoria.users (email, password_hash, role, full_name)
VALUES (
  'mentor@mentoria.com',
  crypt('Mentor123!@#', gen_salt('bf', 10)), -- Senha: Mentor123!@#
  'mentor',
  'Mentor Principal'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = crypt('Mentor123!@#', gen_salt('bf', 10)),
    role = 'mentor',
    full_name = 'Mentor Principal';

-- 2. Criar usuário ALUNO de teste
INSERT INTO mentoria.users (email, password_hash, role, full_name)
VALUES (
  'aluno@mentoria.com',
  crypt('Aluno123!@#', gen_salt('bf', 10)), -- Senha: Aluno123!@#
  'aluno',
  'Aluno Teste'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = crypt('Aluno123!@#', gen_salt('bf', 10)),
    role = 'aluno',
    full_name = 'Aluno Teste';

-- =============================================
-- CREDENCIAIS:
-- =============================================
-- MENTOR:
-- Email: mentor@mentoria.com
-- Senha: Mentor123!@#
-- 
-- ALUNO:
-- Email: aluno@mentoria.com
-- Senha: Aluno123!@#
-- =============================================
