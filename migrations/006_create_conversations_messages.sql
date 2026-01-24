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

-- Comentários:
-- role: 'user' (pergunta do aluno) ou 'assistant' (resposta da IA)
-- sources: JSON com as citações/fontes usadas na resposta
-- Exemplo de sources:
-- [{"title": "Apostila - Módulo 1", "googleFileId": "abc123", "snippet": "Trecho usado..."}]

