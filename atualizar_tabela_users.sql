-- =============================================
-- ATUALIZAR TABELA DE USUÁRIOS CUSTOMIZADA
-- SQL idempotente - pode ser executado múltiplas vezes
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

-- 5. Adicionar colunas se não existirem
DO $$ 
BEGIN
  -- Adiciona coluna updated_at se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'mentoria' 
    AND table_name = 'users' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE mentoria.users ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
  
  -- Adiciona coluna created_at se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'mentoria' 
    AND table_name = 'users' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE mentoria.users ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
  END IF;
  
  -- Adiciona coluna full_name se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'mentoria' 
    AND table_name = 'users' 
    AND column_name = 'full_name'
  ) THEN
    ALTER TABLE mentoria.users ADD COLUMN full_name text;
  END IF;
END $$;

-- 6. Criar índice para busca rápida por email (se não existir)
CREATE INDEX IF NOT EXISTS idx_users_email ON mentoria.users(email);

-- 7. Criar função para atualizar updated_at (substitui se já existir)
CREATE OR REPLACE FUNCTION mentoria.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Remover trigger se já existir e criar novamente
DROP TRIGGER IF EXISTS update_users_updated_at ON mentoria.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON mentoria.users
  FOR EACH ROW
  EXECUTE FUNCTION mentoria.update_updated_at_column();

-- 9. Atualizar permissões
GRANT ALL ON TABLE mentoria.users TO authenticated;
GRANT ALL ON TABLE mentoria.users TO anon;
GRANT ALL ON TABLE mentoria.users TO service_role;

-- 10. Criar usuários de exemplo (apenas se não existirem)
-- IMPORTANTE: Substitua os hashes pelos hashes reais gerados com bcrypt
INSERT INTO mentoria.users (email, password_hash, role, full_name)
VALUES (
  'mentor@mentoria.com',
  '$2a$10$rK8X8X8X8X8X8X8X8X8X8u8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X', -- Hash temporário - SUBSTITUA
  'mentor',
  'Mentor Principal'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO mentoria.users (email, password_hash, role, full_name)
VALUES (
  'aluno@mentoria.com',
  '$2a$10$rK8X8X8X8X8X8X8X8X8X8u8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X', -- Hash temporário - SUBSTITUA
  'aluno',
  'Aluno Teste'
)
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- ✅ PRONTO!
-- =============================================
-- Este SQL pode ser executado múltiplas vezes sem erro
-- Ele verifica se cada elemento existe antes de criar
-- =============================================
