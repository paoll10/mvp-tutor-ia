# 🔧 Executar Migrações - Passo a Passo Detalhado

Se as tabelas não foram criadas, vamos executar as migrações corretamente.

---

## ⚠️ IMPORTANTE: Execute na Ordem!

As migrações devem ser executadas **UMA POR VEZ**, na ordem exata.

---

## 📋 Passo 1: Acessar SQL Editor

1. Acesse: **https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz**
2. No menu lateral esquerdo, clique em **"SQL Editor"**
3. Clique no botão verde **"New query"** (canto superior direito)

---

## 📋 Passo 2: Executar Migração 001 (OBRIGATÓRIA PRIMEIRO!)

### 2.1 Copiar o SQL

Copie EXATAMENTE este código:

```sql
-- =============================================
-- MIGRAÇÃO 001: CRIAR SCHEMA MENTORIA
-- =============================================

create schema if not exists mentoria;

grant usage on schema mentoria to anon;
grant usage on schema mentoria to authenticated;
grant usage on schema mentoria to service_role;

grant all on all tables in schema mentoria to anon;
grant all on all tables in schema mentoria to authenticated;
grant all on all tables in schema mentoria to service_role;

alter default privileges in schema mentoria
grant all on tables to anon;

alter default privileges in schema mentoria
grant all on tables to authenticated;

alter default privileges in schema mentoria
grant all on tables to service_role;
```

### 2.2 Colar e Executar

1. Cole o código no SQL Editor
2. Clique no botão **"Run"** (ou pressione `Ctrl+Enter`)
3. ✅ Deve aparecer: **"Success. No rows returned"**

**Se der erro, me envie a mensagem de erro!**

---

## 📋 Passo 3: Executar Migração 002

Copie e execute:

```sql
-- =============================================
-- MIGRAÇÃO 002: TABELA PROFILES
-- =============================================

create table if not exists mentoria.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('mentor', 'aluno')),
  full_name text,
  created_at timestamptz not null default now()
);
```

Clique em **"Run"** e verifique sucesso.

---

## 📋 Passo 4: Executar Migração 003

Copie e execute:

```sql
-- =============================================
-- MIGRAÇÃO 003: TABELA COURSES
-- =============================================

create table if not exists mentoria.courses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  invite_code text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists idx_courses_owner_id on mentoria.courses(owner_id);
```

---

## 📋 Passo 5: Executar Migração 004

Copie e execute:

```sql
-- =============================================
-- MIGRAÇÃO 004: TABELA COURSE_MEMBERS
-- =============================================

create table if not exists mentoria.course_members (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references mentoria.courses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('mentor', 'aluno')),
  created_at timestamptz not null default now(),
  unique(course_id, user_id)
);

create index if not exists idx_course_members_course_id on mentoria.course_members(course_id);
create index if not exists idx_course_members_user_id on mentoria.course_members(user_id);
```

---

## 📋 Passo 6: Executar Migração 005

Copie e execute:

```sql
-- =============================================
-- MIGRAÇÃO 005: TABELA MATERIALS
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

create index if not exists idx_materials_course_id on mentoria.materials(course_id);
create index if not exists idx_materials_created_by on mentoria.materials(created_by);
```

---

## 📋 Passo 7: Executar Migração 006

Copie e execute:

```sql
-- =============================================
-- MIGRAÇÃO 006: TABELAS CONVERSATIONS E MESSAGES
-- =============================================

create table if not exists mentoria.conversations (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references mentoria.courses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);

create index if not exists idx_conversations_course_id on mentoria.conversations(course_id);
create index if not exists idx_conversations_user_id on mentoria.conversations(user_id);

create table if not exists mentoria.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references mentoria.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  sources jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_conversation_id on mentoria.messages(conversation_id);
```

---

## 📋 Passo 8: Executar Migração 007

Copie e execute:

```sql
-- =============================================
-- MIGRAÇÃO 007: ATIVAR RLS
-- =============================================

alter table mentoria.profiles enable row level security;
alter table mentoria.courses enable row level security;
alter table mentoria.course_members enable row level security;
alter table mentoria.materials enable row level security;
alter table mentoria.conversations enable row level security;
alter table mentoria.messages enable row level security;
```

---

## 📋 Passo 9: Executar Migração 008

Copie e execute (este é um arquivo grande, copie tudo):

```sql
-- =============================================
-- MIGRAÇÃO 008: POLÍTICAS DE SEGURANÇA
-- =============================================

create policy "profiles_select_own" on mentoria.profiles 
  for select to authenticated 
  using (user_id = auth.uid());

create policy "profiles_insert_own" on mentoria.profiles 
  for insert to authenticated 
  with check (user_id = auth.uid());

create policy "profiles_update_own" on mentoria.profiles 
  for update to authenticated 
  using (user_id = auth.uid());

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

create policy "course_members_select_own" on mentoria.course_members 
  for select to authenticated 
  using (user_id = auth.uid());

create policy "course_members_insert" on mentoria.course_members 
  for insert to authenticated 
  with check (
    exists (select 1 from mentoria.courses c where c.id = course_id and c.owner_id = auth.uid()) 
    OR user_id = auth.uid()
  );

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

create policy "conversations_select_own" on mentoria.conversations 
  for select to authenticated 
  using (user_id = auth.uid());

create policy "conversations_insert_own" on mentoria.conversations 
  for insert to authenticated 
  with check (user_id = auth.uid());

create policy "messages_select_own" on mentoria.messages 
  for select to authenticated 
  using (exists (select 1 from mentoria.conversations conv where conv.id = messages.conversation_id and conv.user_id = auth.uid()));

create policy "messages_insert_own" on mentoria.messages 
  for insert to authenticated 
  with check (exists (select 1 from mentoria.conversations conv where conv.id = messages.conversation_id and conv.user_id = auth.uid()));
```

---

## 📋 Passo 10: Executar Migração 009

Copie e execute:

```sql
-- =============================================
-- MIGRAÇÃO 009: ALTERAÇÕES PARA FLUXO DE CRIAÇÃO
-- =============================================

ALTER TABLE mentoria.courses 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft' 
CHECK (status IN ('draft', 'published'));

ALTER TABLE mentoria.materials 
ADD COLUMN IF NOT EXISTS file_size_bytes bigint;

ALTER TABLE mentoria.materials 
ADD COLUMN IF NOT EXISTS mime_type text DEFAULT 'application/pdf';

ALTER TABLE mentoria.materials 
ADD COLUMN IF NOT EXISTS original_filename text;

CREATE INDEX IF NOT EXISTS idx_courses_status ON mentoria.courses(status);
```

---

## 📋 Passo 11: Executar Migração 010

Copie e execute:

```sql
-- =============================================
-- MIGRAÇÃO 010: RLS PARA ALUNOS
-- =============================================

CREATE POLICY "courses_select_published" ON mentoria.courses
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "members_select_own" ON mentoria.course_members
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "members_insert_student" ON mentoria.course_members
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND role = 'aluno'
  );

CREATE POLICY "members_delete_own" ON mentoria.course_members
  FOR DELETE
  USING (auth.uid() = user_id AND role = 'aluno');

CREATE POLICY "members_select_mentor" ON mentoria.course_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mentoria.courses c 
      WHERE c.id = course_id 
      AND c.owner_id = auth.uid()
    )
  );
```

---

## 📋 Passo 12: Executar Migração 011 (ÚLTIMA!)

Copie e execute:

```sql
-- =============================================
-- MIGRAÇÃO 011: FILE_SEARCH_STORE_ID
-- =============================================

ALTER TABLE mentoria.courses
ADD COLUMN IF NOT EXISTS file_search_store_id text;

CREATE INDEX IF NOT EXISTS idx_courses_file_search_store 
ON mentoria.courses(file_search_store_id) 
WHERE file_search_store_id IS NOT NULL;
```

---

## ✅ Verificar se Funcionou

1. No Supabase Dashboard, vá em **Table Editor**
2. No seletor de schema (topo), escolha **`mentoria`**
3. Você deve ver 6 tabelas:
   - ✅ `profiles`
   - ✅ `courses`
   - ✅ `course_members`
   - ✅ `materials`
   - ✅ `conversations`
   - ✅ `messages`

---

## 🆘 Se Der Erro

Me envie:
1. Qual migração deu erro (001, 002, etc.)
2. A mensagem de erro completa
3. Print da tela (se possível)

Vou te ajudar a resolver!
