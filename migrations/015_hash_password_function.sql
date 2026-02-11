-- =============================================
-- MIGRAÇÃO 015: FUNÇÃO PARA HASH DE SENHA
-- Cria função para fazer hash de senhas usando pgcrypto
-- =============================================

-- Instalar extensão pgcrypto se não estiver instalada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Função para fazer hash de senha
CREATE OR REPLACE FUNCTION mentoria.hash_password(p_password text)
RETURNS text AS $$
BEGIN
  -- Usa crypt do pgcrypto para fazer hash da senha
  RETURN crypt(p_password, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar senha
CREATE OR REPLACE FUNCTION mentoria.verify_password(p_password text, p_hash text)
RETURNS boolean AS $$
BEGIN
  -- Verifica se a senha corresponde ao hash
  RETURN p_hash = crypt(p_password, p_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentários:
-- hash_password: cria um hash da senha usando bcrypt
-- verify_password: verifica se a senha corresponde ao hash
-- Ambas as funções usam SECURITY DEFINER para ter permissões necessárias
