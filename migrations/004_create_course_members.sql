-- =============================================
-- MIGRAÇÃO 004: TABELA COURSE_MEMBERS
-- Vincula usuários aos cursos (quem participa de qual curso)
-- =============================================

create table if not exists mentoria.course_members (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references mentoria.courses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('mentor', 'aluno')),
  created_at timestamptz not null default now(),
  unique(course_id, user_id)
);

-- Índices para buscas rápidas
create index if not exists idx_course_members_course_id on mentoria.course_members(course_id);
create index if not exists idx_course_members_user_id on mentoria.course_members(user_id);

-- Comentários:
-- unique(course_id, user_id): impede que o mesmo usuário entre 2x no mesmo curso
-- role: pode ser 'mentor' ou 'aluno' dentro daquele curso específico

