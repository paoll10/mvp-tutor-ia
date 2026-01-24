-- =============================================
-- MIGRAÇÃO 002: TABELA PROFILES
-- Guarda o papel do usuário no sistema (mentor ou aluno)
-- =============================================

create table if not exists mentoria.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('mentor', 'aluno')),
  full_name text,
  created_at timestamptz not null default now()
);

-- Comentários:
-- user_id: referencia a tabela de auth do Supabase
-- role: 'mentor' pode criar cursos, 'aluno' pode entrar em cursos
-- on delete cascade: se o usuário for deletado, o profile também é

