-- =============================================
-- MIGRAÇÃO 003: TABELA COURSES
-- Armazena os cursos criados pelos mentores
-- =============================================

create table if not exists mentoria.courses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  invite_code text not null unique,
  created_at timestamptz not null default now()
);

-- Índice para buscar cursos do mentor mais rápido
create index if not exists idx_courses_owner_id on mentoria.courses(owner_id);

-- Comentários:
-- owner_id: o mentor que criou o curso
-- invite_code: código único para alunos entrarem (ex: "AB12CD34")

