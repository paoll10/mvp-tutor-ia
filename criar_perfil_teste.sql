-- =============================================
-- CRIAR PERFIL PARA USUÁRIO DE TESTE
-- =============================================
-- Este SQL busca o usuário pelo email e cria o perfil automaticamente
-- Execute no SQL Editor do Supabase

-- Criar perfil como ALUNO
INSERT INTO mentoria.profiles (user_id, role, full_name)
SELECT 
  id as user_id,
  'aluno' as role,
  split_part(email, '@', 1) as full_name
FROM auth.users
WHERE email = 'teste.mentoria@gmail.com'
  AND id NOT IN (SELECT user_id FROM mentoria.profiles);

-- Verificar se foi criado
SELECT * FROM mentoria.profiles 
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'teste.mentoria@gmail.com'
);

-- =============================================
-- ALTERNATIVA: Criar como MENTOR
-- =============================================
-- Se quiser criar como mentor, descomente e execute este bloco:

/*
INSERT INTO mentoria.profiles (user_id, role, full_name)
SELECT 
  id as user_id,
  'mentor' as role,
  split_part(email, '@', 1) as full_name
FROM auth.users
WHERE email = 'teste.mentoria@gmail.com'
  AND id NOT IN (SELECT user_id FROM mentoria.profiles);
*/
