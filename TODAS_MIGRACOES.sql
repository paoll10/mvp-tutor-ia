-- =============================================
-- MIGRAÇÃO 001: CRIAR SCHEMA MENTORIA
-- Isola todas as tabelas do sistema MentorIA
-- =============================================

create schema if not exists mentoria;

-- Permissões do schema para usuários do Supabase
grant usage on schema mentoria to anon;
grant usage on schema mentoria to authenticated;
grant usage on schema mentoria to service_role;

-- Permissão para TODAS as tabelas do schema
grant all on all tables in schema mentoria to anon;
grant all on all tables in schema mentoria to authenticated;
grant all on all tables in schema mentoria to service_role;

-- Permissão para tabelas FUTURAS
alter default privileges in schema mentoria
grant all on tables to anon;

alter default privileges in schema mentoria
grant all on tables to authenticated;

alter default privileges in schema mentoria
grant all on tables to service_role;

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

-- =============================================
-- MIGRAÇÃO 006: TABELAS CONVERSATIONS E MESSAGES
-- Armazena as conversas do chat e as mensagens do tutor IA
-- =============================================

-- CONVERSATIONS (threads de conversa)
create table if not exists mentoria.conversations (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references mentoria.courses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);

create index if not exists idx_conversations_course_id on mentoria.conversations(course_id);
create index if not exists idx_conversations_user_id on mentoria.conversations(user_id);

-- MESSAGES (mensagens dentro de cada conversa)
create table if not exists mentoria.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references mentoria.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  sources jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_conversation_id on mentoria.messages(conversation_id);

-- =============================================
-- MIGRAÇÃO 007: ATIVAR RLS (ROW LEVEL SECURITY)
-- Ativa a segurança a nível de linha em todas as tabelas
-- =============================================

alter table mentoria.profiles enable row level security;
alter table mentoria.courses enable row level security;
alter table mentoria.course_members enable row level security;
alter table mentoria.materials enable row level security;
alter table mentoria.conversations enable row level security;
alter table mentoria.messages enable row level security;

-- =============================================
-- MIGRAÇÃO 008: POLÍTICAS DE SEGURANÇA (RLS POLICIES)
-- Define quem pode ver/editar o quê
-- =============================================

-- PROFILES: usuário vê/edita só o próprio perfil
create policy "profiles_select_own" on mentoria.profiles 
  for select to authenticated 
  using (user_id = auth.uid());

create policy "profiles_insert_own" on mentoria.profiles 
  for insert to authenticated 
  with check (user_id = auth.uid());

create policy "profiles_update_own" on mentoria.profiles 
  for update to authenticated 
  using (user_id = auth.uid());

-- COURSES: mentor vê/edita só os cursos dele
create policy "courses_select_owner" on mentoria.courses 
  for select to authenticated 
  using (owner_id = auth.uid());

create policy "courses_insert_owner" on mentoria.courses 
  for insert to authenticated 
  with check (owner_id = auth.uid());

create policy "courses_update_owner" on mentoria.courses 
  for update to authenticated 
  using (owner_id = auth.uid());

create policy "courses_delete_owner" on mentoria.courses 
  for delete to authenticated 
  using (owner_id = auth.uid());

-- COURSE_MEMBERS: usuário vê só os vínculos dele
create policy "course_members_select_own" on mentoria.course_members 
  for select to authenticated 
  using (user_id = auth.uid());

create policy "course_members_insert" on mentoria.course_members 
  for insert to authenticated 
  with check (
    exists (select 1 from mentoria.courses c where c.id = course_id and c.owner_id = auth.uid()) 
    OR user_id = auth.uid()
  );

-- MATERIALS: mentor vê os dele, aluno vê dos cursos que participa
create policy "materials_select_owner" on mentoria.materials 
  for select to authenticated 
  using (exists (select 1 from mentoria.courses c where c.id = materials.course_id and c.owner_id = auth.uid()));

create policy "materials_select_members" on mentoria.materials 
  for select to authenticated 
  using (exists (select 1 from mentoria.course_members cm where cm.course_id = materials.course_id and cm.user_id = auth.uid()));

create policy "materials_insert_owner" on mentoria.materials 
  for insert to authenticated 
  with check (exists (select 1 from mentoria.courses c where c.id = course_id and c.owner_id = auth.uid()));

create policy "materials_update_owner" on mentoria.materials 
  for update to authenticated 
  using (exists (select 1 from mentoria.courses c where c.id = materials.course_id and c.owner_id = auth.uid()));

create policy "materials_delete_owner" on mentoria.materials 
  for delete to authenticated 
  using (exists (select 1 from mentoria.courses c where c.id = materials.course_id and c.owner_id = auth.uid()));

-- CONVERSATIONS: usuário vê só as conversas dele
create policy "conversations_select_own" on mentoria.conversations 
  for select to authenticated 
  using (user_id = auth.uid());

create policy "conversations_insert_own" on mentoria.conversations 
  for insert to authenticated 
  with check (user_id = auth.uid());

-- MESSAGES: usuário vê só mensagens das conversas dele
create policy "messages_select_own" on mentoria.messages 
  for select to authenticated 
  using (exists (select 1 from mentoria.conversations conv where conv.id = messages.conversation_id and conv.user_id = auth.uid()));

create policy "messages_insert_own" on mentoria.messages 
  for insert to authenticated 
  with check (exists (select 1 from mentoria.conversations conv where conv.id = messages.conversation_id and conv.user_id = auth.uid()));

-- =============================================
-- MIGRAÇÃO 009: ALTERAÇÕES PARA FLUXO DE CRIAÇÃO DE CURSO
-- Adiciona status em courses e metadados em materials
-- =============================================

-- Status do curso: 'draft' ou 'published'
ALTER TABLE mentoria.courses 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft' 
CHECK (status IN ('draft', 'published'));

-- Metadados dos materiais
ALTER TABLE mentoria.materials 
ADD COLUMN IF NOT EXISTS file_size_bytes bigint;

ALTER TABLE mentoria.materials 
ADD COLUMN IF NOT EXISTS mime_type text DEFAULT 'application/pdf';

ALTER TABLE mentoria.materials 
ADD COLUMN IF NOT EXISTS original_filename text;

-- Índice para buscar cursos por status
CREATE INDEX IF NOT EXISTS idx_courses_status ON mentoria.courses(status);

-- =============================================
-- MIGRAÇÃO 010: RLS PARA ALUNOS ACESSAREM CURSOS
-- Permite que alunos busquem cursos publicados e vejam cursos onde são membros
-- =============================================

-- Alunos podem ver cursos publicados (para buscar por invite_code)
CREATE POLICY "courses_select_published" ON mentoria.courses
  FOR SELECT
  USING (status = 'published');

-- Usuário pode ver suas próprias inscrições
CREATE POLICY "members_select_own" ON mentoria.course_members
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuário pode se inscrever em cursos (inserir como aluno)
CREATE POLICY "members_insert_student" ON mentoria.course_members
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND role = 'aluno'
  );

-- Usuário pode sair de cursos (deletar própria inscrição)
CREATE POLICY "members_delete_own" ON mentoria.course_members
  FOR DELETE
  USING (auth.uid() = user_id AND role = 'aluno');

-- Mentor pode ver membros dos seus cursos
CREATE POLICY "members_select_mentor" ON mentoria.course_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mentoria.courses c 
      WHERE c.id = course_id 
      AND c.owner_id = auth.uid()
    )
  );

-- =============================================
-- MIGRAÇÃO 011: ADICIONA FILE_SEARCH_STORE_ID NA TABELA COURSES
-- Armazena o ID do File Search Store do Gemini para cada curso
-- =============================================

ALTER TABLE mentoria.courses
ADD COLUMN IF NOT EXISTS file_search_store_id text;

-- Índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_courses_file_search_store 
ON mentoria.courses(file_search_store_id) 
WHERE file_search_store_id IS NOT NULL;
