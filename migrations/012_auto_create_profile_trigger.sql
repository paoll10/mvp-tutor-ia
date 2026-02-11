-- =============================================
-- MIGRAÇÃO 012: TRIGGER PARA CRIAR PROFILE AUTOMATICAMENTE
-- Cria o profile automaticamente quando um usuário é criado no auth
-- =============================================

-- Função que cria o profile automaticamente
create or replace function mentoria.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text;
begin
  -- Pega o role do user_metadata, ou usa 'aluno' como padrão
  user_role := coalesce(
    new.raw_user_meta_data->>'role',
    'aluno'
  );
  
  -- Garante que o role é válido
  if user_role not in ('mentor', 'aluno') then
    user_role := 'aluno';
  end if;
  
  -- Cria o profile
  insert into mentoria.profiles (user_id, role, full_name)
  values (
    new.id,
    user_role,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    )
  );
  
  return new;
end;
$$;

-- Trigger que executa a função quando um novo usuário é criado
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function mentoria.handle_new_user();

-- Comentários:
-- Este trigger cria automaticamente um profile quando um usuário é criado
-- O role vem do user_metadata passado no signup
-- Se não tiver role, usa 'aluno' como padrão
