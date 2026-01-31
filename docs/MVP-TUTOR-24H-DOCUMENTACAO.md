# MVP Tutor 24h com RAG — Documentação Completa (V1)

## 📋 Índice

1. [Objetivo do MVP](#1-objetivo-do-mvp)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Perfis de Usuário](#3-perfis-de-usuário)
4. [Módulos do MVP](#4-módulos-do-mvp)
5. [Roadmap (3 Sprints)](#5-roadmap-3-sprints)
6. [Implementação por Partes](#6-implementação-por-partes)
7. [Estrutura de Pastas](#7-estrutura-de-pastas)
8. [Checklist Final](#8-checklist-final)

---

## 1. Objetivo do MVP

Entregar um **tutor 24h** que responde dúvidas do aluno usando **exclusivamente o material do professor/mentor** (PDFs/textos), com respostas citando a fonte (trechos/páginas), e um plano de estudo básico.

> O MVP **NÃO** é uma plataforma completa de EAD. É um **"ChatGPT do professor"**, com base privada.

### O que fica FORA do MVP (v2/v3)

- Gamificação (pontos, badges, ranking)
- Cron que "chama o aluno de volta" automaticamente
- Dashboard avançado de engajamento por aluno
- Turmas complexas com permissões sofisticadas
- Provas, emissão de certificado, vídeo-aula, etc
- Predição/ML de performance

---

## 2. Stack Tecnológico

| Tecnologia | Função |
|------------|--------|
| **Next.js** (App Router) | Front-end do app (Mentor + Aluno + Chat) |
| **Supabase** | Auth (login), Postgres (dados) e Storage (PDFs/materiais) |
| **Google File Search** | Busca inteligente nos PDFs (RAG pronto) - upload + busca + snippets |
| **n8n** (opcional) | Automações do sistema (processar materiais, gatilhos, filas simples) |

---

## 3. Perfis de Usuário

### A) Mentor/Professor (Admin)

- Sobe os materiais (PDF / texto / links colados)
- Cria uma "Turma" (ou "Curso")
- Enxerga uso básico: quantidade de perguntas / alunos / materiais

### B) Aluno

- Entra no curso/turma
- Faz perguntas no chat
- Recebe respostas com referências do material
- Vê um plano de estudo sugerido (simples)

---

## 4. Módulos do MVP

### 4.1 Onboarding do Mentor (Admin)

**Tela: "Criar Curso"**
- Nome do curso
- Descrição curta
- (Opcional) "Como o tutor deve responder" (tom, idioma, se pode ou não dar opinião)

**Tela: "Adicionar Materiais"**
- Upload de PDF (Google File Search)
- Colar texto (para virar "documento")
- Status do processamento: `Aguardando` / `Processando` / `Pronto` / `Erro`

✅ **Resultado:** o curso fica "treinado" no conteúdo (via RAG).

### 4.2 Chat do Aluno (Tutor 24h)

**Tela principal (Chat)**
- Campo de pergunta
- Resposta do tutor
- Bloco de fontes (citações): nome do arquivo + página/trecho
- Botões:
  - "Ver fontes" (abre trechos usados)
  - "Salvar resposta" (favorito)
  - "Copiar"

✅ **Regra do tutor no MVP:**
> Se não encontrar no material: responde algo tipo
> *"Não encontrei isso no material do professor. Você quer que eu procure por outro termo ou envie o documento que fala disso?"*

### 4.3 Plano de Estudo (gerado 1 vez + editável)

**Tela: "Plano de estudo"**

Aluno responde 3 perguntas rápidas:
1. Objetivo (ex: passar em prova / aplicar no trabalho)
2. Tempo disponível por semana
3. Nível atual (iniciante/intermediário/avançado)

Tutor gera um plano simples:
- Semana 1: tópicos + páginas/arquivos
- Semana 2: tópicos + etc
- Botão "Gerar novamente"

✅ Plano não precisa ter gamificação no MVP. Só organização.

### 4.4 Histórico e Organização

- Lista de conversas (threads)
- Favoritos do aluno (respostas salvas)
- Pesquisa por conversa (opcional)

---

## 5. Roadmap (3 Sprints)

### ✅ Sprint 1 — Base do sistema + Curso + Acesso

**Meta:** app em pé com login + curso funcionando.

**Entregas:**
- [x] Next.js pronto (App Router, layout base)
- [x] Supabase configurado (Auth)
- [x] Login com email/senha
- [x] Login com Google (OAuth popup)
- [x] Recuperação de senha
- [x] Migração middleware → proxy
- [x] Layout base (páginas e navegação)
- [x] Componente LogoutButton
- [ ] Tabelas: `profiles`, `courses`, `course_members`
- [ ] Fluxo do Curso (criar, gerar convite, entrar)

**Resultado:** tem login, tem curso, tem aluno entrando.

### ✅ Sprint 2 — Materiais do Curso + Indexação no Google File Search

**Meta:** mentor consegue subir material e ele fica pesquisável.

**Entregas:**
- [ ] Upload de materiais (PDF)
- [ ] Tabela `materials` com status
- [ ] Integração com Google File Search
- [ ] Tela do Mentor "Materiais do Curso"
- [ ] Status: `processing` | `ready` | `error`

**Resultado:** Material entra e vira base consultável.

### ✅ Sprint 3 — Tutor (Chat RAG) + Fontes

**Meta:** aluno pergunta e recebe resposta com base no material + fontes.

**Entregas:**
- [ ] Chat do aluno (interface)
- [ ] Tabelas: `conversations`, `messages`
- [ ] Endpoint do Tutor (RAG)
- [ ] UI de fontes (citações)
- [ ] Botão "Salvar resposta" (favoritos)

**Resultado:** Tutor RAG funcionando ponta a ponta.

---

## 6. Implementação por Partes

### Parte 1 — Banco (Supabase): Tabelas + RLS

#### 1.1 Criar tabelas essenciais

```sql
-- PROFILES
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('mentor', 'aluno')),
  full_name text,
  created_at timestamptz not null default now()
);

-- COURSES
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  invite_code text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists idx_courses_owner_id on public.courses(owner_id);

-- COURSE MEMBERS
create table if not exists public.course_members (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('mentor', 'aluno')),
  created_at timestamptz not null default now(),
  unique(course_id, user_id)
);

create index if not exists idx_course_members_course_id on public.course_members(course_id);
create index if not exists idx_course_members_user_id on public.course_members(user_id);
```

#### 1.2 Tabelas do Chat (conversas + mensagens)

```sql
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);

create index if not exists idx_conversations_course_id on public.conversations(course_id);
create index if not exists idx_conversations_user_id on public.conversations(user_id);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  sources jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_conversation_id on public.messages(conversation_id);
```

#### 1.3 Tabela dos Materiais

```sql
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status text not null default 'processing' check (status in ('processing','ready','error')),
  google_file_id text,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_materials_course_id on public.materials(course_id);
create index if not exists idx_materials_created_by on public.materials(created_by);
```

#### 1.4 Alterações para Fluxo de Criação (Migração 009)

```sql
-- COURSES: Adicionar status para controlar fluxo de criação
-- 'draft' = Mentor está criando/adicionando materiais
-- 'published' = Curso finalizado, código de convite liberado
ALTER TABLE mentoria.courses 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft' 
CHECK (status IN ('draft', 'published'));

-- MATERIALS: Adicionar metadados para Vertex AI
ALTER TABLE mentoria.materials 
ADD COLUMN IF NOT EXISTS file_size_bytes bigint;

ALTER TABLE mentoria.materials 
ADD COLUMN IF NOT EXISTS mime_type text DEFAULT 'application/pdf';

ALTER TABLE mentoria.materials 
ADD COLUMN IF NOT EXISTS original_filename text;

-- Índice para buscar cursos por status
CREATE INDEX IF NOT EXISTS idx_courses_status ON mentoria.courses(status);
```

#### 1.5 RLS (Row Level Security)

```sql
-- Ativar RLS
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.course_members enable row level security;
alter table public.materials enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- PROFILES
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (user_id = auth.uid());

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (user_id = auth.uid());

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (user_id = auth.uid());

-- COURSES
create policy "courses_select_owner"
on public.courses for select
to authenticated
using (owner_id = auth.uid());

create policy "courses_insert_owner"
on public.courses for insert
to authenticated
with check (owner_id = auth.uid());

create policy "courses_update_owner"
on public.courses for update
to authenticated
using (owner_id = auth.uid());

create policy "courses_delete_owner"
on public.courses for delete
to authenticated
using (owner_id = auth.uid());

-- COURSE MEMBERS
create policy "course_members_select_own"
on public.course_members for select
to authenticated
using (user_id = auth.uid());

create policy "course_members_insert_by_course_owner"
on public.course_members for insert
to authenticated
with check (
  exists (
    select 1 from public.courses c
    where c.id = course_id and c.owner_id = auth.uid()
  )
  OR user_id = auth.uid()
);

-- MATERIALS
create policy "materials_select_owner"
on public.materials for select
to authenticated
using (
  exists (
    select 1 from public.courses c
    where c.id = materials.course_id and c.owner_id = auth.uid()
  )
);

create policy "materials_select_members"
on public.materials for select
to authenticated
using (
  exists (
    select 1 from public.course_members cm
    where cm.course_id = materials.course_id and cm.user_id = auth.uid()
  )
);

create policy "materials_insert_owner"
on public.materials for insert
to authenticated
with check (
  exists (
    select 1 from public.courses c
    where c.id = course_id and c.owner_id = auth.uid()
  )
);

create policy "materials_update_owner"
on public.materials for update
to authenticated
using (
  exists (
    select 1 from public.courses c
    where c.id = materials.course_id and c.owner_id = auth.uid()
  )
);

create policy "materials_delete_owner"
on public.materials for delete
to authenticated
using (
  exists (
    select 1 from public.courses c
    where c.id = materials.course_id and c.owner_id = auth.uid()
  )
);

-- CONVERSATIONS
create policy "conversations_select_own"
on public.conversations for select
to authenticated
using (user_id = auth.uid());

create policy "conversations_insert_own"
on public.conversations for insert
to authenticated
with check (user_id = auth.uid());

-- MESSAGES
create policy "messages_select_own_conversations"
on public.messages for select
to authenticated
using (
  exists (
    select 1 from public.conversations conv
    where conv.id = messages.conversation_id
      and conv.user_id = auth.uid()
  )
);

create policy "messages_insert_own_conversations"
on public.messages for insert
to authenticated
with check (
  exists (
    select 1 from public.conversations conv
    where conv.id = messages.conversation_id
      and conv.user_id = auth.uid()
  )
);
```

---

### Parte 2 — Módulo Cursos (Criar / Listar / Entrar com convite)

#### 2.1 Rotas / Páginas sugeridas

| Rota | Função |
|------|--------|
| `/app/courses` | Lista de cursos (mentor ou aluno) |
| `/app/courses/new` | Criar curso (mentor) |
| `/app/join` | Entrar com invite_code (aluno) |
| `/app/courses/[courseId]` | Tela do curso |

#### 2.2 Lógica de convite

- Curso tem `invite_code` único (8 caracteres, ex: `AB12CD34`)
- Aluno entra no curso usando o código
- `course_members` cria vínculo do aluno

#### 2.3 Implementação server-side

Criar módulo: `src/server/courses.ts`

```typescript
// Funções necessárias:
createCourse({name, description})
listMyCourses()
joinCourseByInviteCode(code)
getCourseById(courseId)
getCourseMembers(courseId) // opcional
```

#### ✅ Aceitação Parte 2

- [ ] Mentor cria curso
- [ ] Curso aparece listado
- [ ] Mentor copia invite code
- [ ] Aluno entra com code
- [ ] Aluno passa a ver o curso na lista dele

---

### Parte 3 — Materiais do Curso (lista + upload + status)

#### 3.1 Tela do Mentor no curso

Em `/app/courses/[courseId]` (mentor):

- Card: "Convite do Curso" (mostra invite_code + botão copiar)
- Seção: "Materiais" (lista + botão "Adicionar PDF")

#### 3.2 Fluxo do upload (MVP)

1. Mentor escolhe arquivo PDF
2. Front chama: `POST /api/materials/upload`
3. Backend:
   - Cria registro em `materials` com `status: processing`
   - Envia para Google File Search (Parte 4)
   - Atualiza com `google_file_id` e `status: ready`
   - Se falhar: `status: error` + `error_message`

#### ✅ Aceitação Parte 3

- [ ] Mentor consegue subir material
- [ ] Material aparece na lista
- [ ] Status aparece (processing/ready/error)

---

### Parte 4 — Integração Google File Search (Upload + Query)

#### 4.1 Variáveis de ambiente

```env
GOOGLE_FILESEARCH_API_KEY=...
GOOGLE_FILESEARCH_PROJECT_ID=...
GOOGLE_FILESEARCH_LOCATION=...
GOOGLE_FILESEARCH_COLLECTION=...
GOOGLE_LLM_API_KEY=...
```

#### 4.2 Adapter do Google

Criar: `src/lib/google-filesearch.ts`

```typescript
// Funções:
uploadPdfToFileSearch({fileBuffer, fileName}): Promise<{ googleFileId: string }>

searchInFiles({ query, googleFileIds }): Promise<{ 
  results: Array<{ 
    title: string, 
    snippet: string, 
    googleFileId: string 
  }> 
}>

deleteFile(googleFileId) // opcional
```

#### ✅ Aceitação Parte 4

- [ ] Upload retorna `googleFileId`
- [ ] Busca retorna snippets relevantes

---

### Parte 5 — Tutor Chat (RAG) com fontes

#### 5.1 Endpoint

`POST /api/chat/ask`

**Input:**
```json
{
  "courseId": "uuid",
  "conversationId": "uuid (opcional)",
  "message": "string"
}
```

**Output:**
```json
{
  "conversationId": "uuid",
  "assistantMessage": "string",
  "sources": [
    {
      "title": "Apostila - Módulo 1",
      "googleFileId": "abc123",
      "snippet": "Trecho usado na resposta..."
    }
  ]
}
```

#### 5.2 Fluxo do endpoint ask

1. Validar usuário logado
2. Validar se usuário é membro do curso
3. Pegar todos materiais `ready` do curso
4. Montar lista `googleFileIds[]`
5. Buscar no File Search: `searchInFiles(query, googleFileIds)`
6. Montar prompt pro modelo responder:
   - "Responda apenas com base nos trechos abaixo"
   - "Se não houver base, diga que não encontrou no material"
7. Gerar resposta com IA
8. Salvar no banco: mensagem user + mensagem assistant + sources
9. Retornar resposta e fontes

#### ✅ Aceitação Parte 5

- [ ] Aluno pergunta
- [ ] IA responde
- [ ] Aparece fonte (snippet + título)

---

### Parte 6 — UI do Chat (MVP enxuto)

#### 6.1 Página

`/app/courses/[courseId]/chat`

#### 6.2 Layout do chat

- Coluna esquerda: conversas (opcional no MVP)
- Coluna direita:
  - Mensagens
  - Input embaixo
  - Loading "pensando…"
  - Fontes em accordion

#### 6.3 Estados obrigatórios

| Estado | Mensagem |
|--------|----------|
| Vazio | "Pergunte algo sobre o material do curso" |
| Sem material | "O mentor ainda não adicionou materiais" |
| Sem resposta baseada | "Não encontrei no material enviado" |

#### ✅ Aceitação Parte 6

- [ ] Chat bonito, simples, rápido
- [ ] UX demonstra valor com fontes

---

### Parte 7 (Opcional) — n8n para background jobs

#### 7.1 Quando usar

Em vez de processar upload no endpoint:
1. Cria registro `materials` (`processing`)
2. Dispara webhook no n8n
3. n8n faz upload no Google
4. n8n atualiza material para `ready/error`

**Benefício:** não trava request, fica resiliente e escalável.

---

## 7. Estrutura de Pastas

```
src/
  app/
    (auth)/
    app/
      courses/
        page.tsx              # Lista de cursos
        new/page.tsx          # Criar curso
        [courseId]/
          page.tsx            # Detalhes do curso
          chat/page.tsx       # Chat do curso
      join/page.tsx           # Entrar com código
  server/
    courses.ts                # Lógica de cursos
    materials.ts              # Lógica de materiais
    chat.ts                   # Lógica do chat
  lib/
    supabase/
      server.ts
      client.ts
    google-filesearch.ts      # Adapter do Google
```

---

## 8. Checklist Final

### MVP Pronto quando:

- [ ] Mentor cria curso + convite
- [ ] Aluno entra via código
- [ ] Mentor sobe PDF (Google File Search)
- [ ] Aluno pergunta e recebe resposta com fontes
- [ ] Histórico mínimo salvo no Supabase

---

## Sequência de Implementação (ordem exata)

1. ✅ Criar tabelas + RLS (Parte 1)
2. ⬜ Criar services de cursos (Parte 2)
3. ⬜ Criar páginas de cursos/join (Parte 2)
4. ⬜ Criar tabela + services de materiais (Parte 3)
5. ⬜ Implementar adapter Google File Search (Parte 4)
6. ⬜ Endpoint upload + listagem materiais (Parte 3/4)
7. ⬜ Criar services chat + endpoint ask (Parte 5)
8. ⬜ Construir UI chat + fontes (Parte 6)

---

## Status Atual do Projeto

### ✅ Já Implementado

- [x] Layout base (MVP enxuto)
- [x] Auth completo: cadastro/login/login com Google/recovery
- [x] Login com Google em popup (sempre pede autorização)
- [x] Componente LogoutButton em todos os layouts
- [x] Proxy no Next (migração middleware → proxy)
- [x] Script de teste do Google Login (`npm run test:google`)
- [x] Renomeado software para MentorIA

### ⬜ Próximos Passos

1. Criar tabelas no Supabase (Parte 1)
2. Implementar módulo de Cursos (Parte 2)
3. Implementar módulo de Materiais (Parte 3)
4. Integrar Google File Search (Parte 4)
5. Implementar Chat RAG (Parte 5)
6. Construir UI do Chat (Parte 6)

