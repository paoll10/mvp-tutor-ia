-- =============================================
-- MIGRAÇÃO 014: TABELA DE USUÁRIOS CUSTOMIZADA
-- Sistema de login direto pela tabela (sem Supabase Auth)
-- =============================================

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS mentoria.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL, -- Senha criptografada
  role text NOT NULL CHECK (role IN ('mentor', 'aluno')),
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Índice para busca rápida por email
CREATE INDEX IF NOT EXISTS idx_users_email ON mentoria.users(email);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION mentoria.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON mentoria.users
  FOR EACH ROW
  EXECUTE FUNCTION mentoria.update_updated_at_column();

-- Permissões
GRANT ALL ON TABLE mentoria.users TO authenticated;
GRANT ALL ON TABLE mentoria.users TO anon;

-- Criar usuário mentor de exemplo
-- Senha: Mentor123!@# (hash bcrypt)
INSERT INTO mentoria.users (email, password_hash, role, full_name)
VALUES (
  'mentor@mentoria.com',
  '$2a$10$rK8X8X8X8X8X8X8X8X8X8u8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X', -- Hash temporário, será atualizado
  'mentor',
  'Mentor Principal'
)
ON CONFLICT (email) DO NOTHING;

-- Criar usuário aluno de exemplo
-- Senha: Aluno123!@# (hash bcrypt)
INSERT INTO mentoria.users (email, password_hash, role, full_name)
VALUES (
  'aluno@mentoria.com',
  '$2a$10$rK8X8X8X8X8X8X8X8X8X8u8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X', -- Hash temporário, será atualizado
  'aluno',
  'Aluno Teste'
)
ON CONFLICT (email) DO NOTHING;

-- Comentários:
-- Esta tabela armazena usuários com login/senha direto
-- As senhas devem ser hasheadas com bcrypt antes de inserir
-- Use a função de hash do Supabase ou Node.js para gerar os hashes
