# 📦 Executar Migrações do Supabase - Ordem Correta

Este arquivo contém todas as migrações na ordem correta para facilitar a cópia e cola.

---

## ⚠️ IMPORTANTE

1. Execute cada migração **NA ORDEM** abaixo
2. Não pule nenhuma migração
3. Verifique se cada uma foi executada com sucesso antes de continuar
4. Se der erro, leia a mensagem e corrija antes de continuar

---

## 📋 Como Executar

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **"New query"**
5. Para cada migração abaixo:
   - Abra o arquivo correspondente na pasta `migrations/`
   - Copie TODO o conteúdo
   - Cole no SQL Editor
   - Clique em **"Run"** (ou `Ctrl+Enter`)
   - Verifique se apareceu "Success"

---

## ✅ Migração 001 - Schema e Permissões

**Arquivo**: `migrations/001_create_schema.sql`

Esta migração:
- Cria o schema `mentoria`
- Configura permissões para `anon`, `authenticated` e `service_role`

**⚠️ Execute esta PRIMEIRO! Sem ela, nada funciona.**

---

## ✅ Migração 002 - Tabela de Perfis

**Arquivo**: `migrations/002_create_profiles.sql`

Esta migração:
- Cria a tabela `mentoria.profiles`
- Armazena se o usuário é `mentor` ou `aluno`

---

## ✅ Migração 003 - Tabela de Cursos

**Arquivo**: `migrations/003_create_courses.sql`

Esta migração:
- Cria a tabela `mentoria.courses`
- Cada curso tem um `invite_code` único

---

## ✅ Migração 004 - Tabela de Membros

**Arquivo**: `migrations/004_create_course_members.sql`

Esta migração:
- Cria a tabela `mentoria.course_members`
- Vincula usuários aos cursos

---

## ✅ Migração 005 - Tabela de Materiais

**Arquivo**: `migrations/005_create_materials.sql`

Esta migração:
- Cria a tabela `mentoria.materials`
- Armazena PDFs enviados pelo mentor

---

## ✅ Migração 006 - Tabelas do Chat

**Arquivo**: `migrations/006_create_conversations_messages.sql`

Esta migração:
- Cria a tabela `mentoria.conversations`
- Cria a tabela `mentoria.messages`
- Armazena o histórico do chat com a IA

---

## ✅ Migração 007 - Ativar RLS (Segurança)

**Arquivo**: `migrations/007_enable_rls.sql`

Esta migração:
- Ativa Row Level Security em todas as tabelas
- **Obrigatório para segurança!**

---

## ✅ Migração 008 - Políticas RLS

**Arquivo**: `migrations/008_rls_policies.sql`

Esta migração:
- Define quem pode ver/editar cada tabela
- Mentor só vê seus cursos
- Aluno só vê cursos que participa

---

## ✅ Migração 009 - Alterações para Fluxo de Criação

**Arquivo**: `migrations/009_alter_courses_materials.sql`

Esta migração:
- Adiciona `status` na tabela `courses` (`draft` | `published`)
- Adiciona metadados na tabela `materials`:
  - `file_size_bytes`: tamanho do arquivo
  - `mime_type`: tipo do arquivo
  - `original_filename`: nome original

---

## ✅ Migração 010 - Políticas RLS para Alunos

**Arquivo**: `migrations/010_rls_student_courses.sql`

Esta migração:
- Permite alunos buscarem cursos publicados (por invite_code)
- Permite alunos verem, entrarem e saírem de cursos
- Permite mentores verem membros dos seus cursos

---

## ✅ Migração 011 - File Search Store ID

**Arquivo**: `migrations/011_add_file_search_store_id.sql`

Esta migração:
- Adiciona coluna `file_search_store_id` na tabela `courses`
- Armazena o ID do File Search Store do Gemini
- **Necessário para o Chat RAG funcionar**

---

## ✅ Verificação Final

Após executar todas as migrações:

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

## 🆘 Problemas Comuns

### Erro: "schema mentoria does not exist"
- **Solução**: Execute a migração 001 primeiro!

### Erro: "permission denied"
- **Solução**: Verifique se executou a migração 001 (ela cria as permissões)

### Erro: "relation already exists"
- **Solução**: A tabela já foi criada. Pule essa migração e continue.

### Erro: "duplicate key value"
- **Solução**: Algum dado já existe. Normal se estiver reexecutando.

---

**Boa sorte! 🚀**
