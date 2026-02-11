-- =============================================
-- CRIAR TUDO DE UMA VEZ - EXECUTE ESTE SQL
-- Copie TODO este conteúdo e execute no Supabase SQL Editor
-- =============================================

-- 1. Criar schema se não existir
CREATE SCHEMA IF NOT EXISTS mentoria;

-- 2. Dar permissões no schema
GRANT USAGE ON SCHEMA mentoria TO anon;
GRANT USAGE ON SCHEMA mentoria TO authenticated;
GRANT USAGE ON SCHEMA mentoria TO service_role;

-- 3. Criar tabela de usuários (se não existir)
CREATE TABLE IF NOT EXISTS mentoria.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('mentor', 'aluno')),
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Adicionar constraint UNIQUE no email (se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_email_key' 
    AND conrelid = 'mentoria.users'::regclass
  ) THEN
    ALTER TABLE mentoria.users ADD CONSTRAINT users_email_key UNIQUE (email);
  END IF;
END $$;

-- 5. Criar índice para busca rápida por email (se não existir)
CREATE INDEX IF NOT EXISTS idx_users_email ON mentoria.users(email);

-- 6. Criar função para atualizar updated_at (substitui se já existir)
CREATE OR REPLACE FUNCTION mentoria.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Criar trigger para updated_at (remove se já existir e cria novamente)
DROP TRIGGER IF EXISTS update_users_updated_at ON mentoria.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON mentoria.users
  FOR EACH ROW
  EXECUTE FUNCTION mentoria.update_updated_at_column();

-- 8. Dar permissões na tabela
GRANT ALL ON TABLE mentoria.users TO authenticated;
GRANT ALL ON TABLE mentoria.users TO anon;
GRANT ALL ON TABLE mentoria.users TO service_role;

-- 9. CRIAR USUÁRIO MENTOR
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

-- 10. CRIAR USUÁRIO ALUNO
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
-- ✅ PRONTO! TUDO CRIADO!
-- =============================================
-- Agora você pode fazer login com:
-- 
-- MENTOR:
--   Email: mentor@mentoria.com
--   Senha: Mentor123!@#
--
-- ALUNO:
--   Email: aluno@mentoria.com
--   Senha: Aluno123!@#
-- =============================================
