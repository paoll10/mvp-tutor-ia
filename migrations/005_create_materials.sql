-- =============================================
-- MIGRAÇÃO 005: TABELA MATERIALS
-- Armazena os materiais (PDFs) enviados pelo mentor
-- =============================================

create table if not exists mentoria.materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references mentoria.courses(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status text not null default 'processing' check (status in ('processing','ready','error')),
  google_file_id text,
  error_message text,
  created_at timestamptz not null default now()
);

-- Índices para buscas rápidas
create index if not exists idx_materials_course_id on mentoria.materials(course_id);
create index if not exists idx_materials_created_by on mentoria.materials(created_by);

-- Comentários:
-- status: 'processing' (enviando), 'ready' (pronto), 'error' (falhou)
-- google_file_id: ID do arquivo no Google File Search
-- error_message: mensagem de erro se o processamento falhar

