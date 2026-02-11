-- =============================================
-- CRIAR LOGIN SIMPLES - MENTOR E ALUNO
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Primeiro, execute o arquivo: atualizar_tabela_users.sql
-- Depois execute este SQL para criar os usuários

-- Criar usuário MENTOR
-- Email: mentor@mentoria.com
-- Senha: Mentor123!@#
INSERT INTO mentoria.users (email, password_hash, role, full_name)
VALUES (
  'mentor@mentoria.com',
  '$2b$10$CNN.OziQeg2T1Hp/SeFFOuhGsP2kZUr2q6zk.bXhu/t24zCsTs0AG',
  'mentor',
  'Mentor Principal'
)
ON CONFLICT (email) DO UPDATE
SET 
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name;

-- Criar usuário ALUNO
-- Email: aluno@mentoria.com
-- Senha: Aluno123!@#
INSERT INTO mentoria.users (email, password_hash, role, full_name)
VALUES (
  'aluno@mentoria.com',
  '$2b$10$BPjsPvGDK.z2K/dDHzf2W.uhmaH6Zd539ItJhYo64SrvOTO3Fy8QG',
  'aluno',
  'Aluno Teste'
)
ON CONFLICT (email) DO UPDATE
SET 
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name;

-- =============================================
-- ✅ USUÁRIOS CRIADOS!
-- =============================================
-- MENTOR:
--   Email: mentor@mentoria.com
--   Senha: Mentor123!@#
--   Dashboard: /mentor/dashboard
--
-- ALUNO:
--   Email: aluno@mentoria.com
--   Senha: Aluno123!@#
--   Dashboard: /student/dashboard
-- =============================================
