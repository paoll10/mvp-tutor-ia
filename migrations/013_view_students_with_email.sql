-- =============================================
-- MIGRAÇÃO 013: VIEW PARA LISTAR ALUNOS COM EMAIL
-- Cria uma view que junta profiles com auth.users para mostrar emails
-- =============================================

-- View que retorna alunos com email
create or replace view mentoria.students_with_email as
select 
  p.user_id,
  u.email,
  p.full_name,
  p.role,
  p.created_at
from mentoria.profiles p
join auth.users u on u.id = p.user_id
where p.role = 'aluno';

-- Permissão para mentores verem a view
grant select on mentoria.students_with_email to authenticated;

-- Comentários:
-- Esta view permite que mentores vejam os emails dos alunos
-- sem precisar de service_role key
