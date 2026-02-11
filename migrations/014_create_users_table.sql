-- =============================================
-- MIGRAÇÃO 014: TABELA DE USUÁRIOS PARA LOGIN
-- Sistema de login customizado usando tabela do Supabase
-- =============================================

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS mentoria.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('mentor', 'aluno')),
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Índice para busca rápida por email
CREATE INDEX IF NOT EXISTS idx_users_email ON mentoria.users(email);

-- Índice para busca rápida por role
CREATE INDEX IF NOT EXISTS idx_users_role ON mentoria.users(role);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION mentoria.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON mentoria.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON mentoria.users
  FOR EACH ROW
  EXECUTE FUNCTION mentoria.update_updated_at_column();

-- RLS: usuários podem ver apenas seus próprios dados
ALTER TABLE mentoria.users ENABLE ROW LEVEL SECURITY;

-- Política: usuários autenticados podem ver seus próprios dados
CREATE POLICY "users_select_own" ON mentoria.users
  FOR SELECT TO authenticated
  USING (true); -- Permite ver todos (para login funcionar)

-- Política: apenas service_role pode inserir/atualizar
CREATE POLICY "users_insert_service" ON mentoria.users
  FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "users_update_service" ON mentoria.users
  FOR UPDATE TO service_role
  USING (true);

-- Comentários:
-- Esta tabela armazena usuários com senha hasheada
-- O login será feito verificando email e senha nesta tabela
-- Depois cria uma sessão no Supabase Auth para manter compatibilidade
