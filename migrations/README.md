# 📦 Migrações do Banco de Dados - MentorIA

Este diretório contém todas as migrações SQL necessárias para configurar o banco de dados do MentorIA no Supabase.

---

## 🚀 Como executar (Passo a Passo)

### Pré-requisitos
- Acesso ao **Supabase Dashboard** do projeto
- Permissão para executar SQL

### Passos

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral esquerdo)
4. Clique em **New Query**
5. Execute cada migração **NA ORDEM ABAIXO**

---

## 📋 Ordem de Execução das Migrações

> ⚠️ **IMPORTANTE**: Execute na ordem exata! Cada migração depende da anterior.

### Passo 1️⃣ - Criar Schema e Permissões
```
Arquivo: 001_create_schema.sql
```
- Cria o schema `mentoria`
- Configura permissões para `anon`, `authenticated` e `service_role`
- **Sem isso, nada funciona!**

---

### Passo 2️⃣ - Criar Tabela de Perfis
```
Arquivo: 002_create_profiles.sql
```
- Cria tabela `mentoria.profiles`
- Guarda se o usuário é `mentor` ou `aluno`

---

### Passo 3️⃣ - Criar Tabela de Cursos
```
Arquivo: 003_create_courses.sql
```
- Cria tabela `mentoria.courses`
- Cada curso tem um `invite_code` único

---

### Passo 4️⃣ - Criar Tabela de Membros
```
Arquivo: 004_create_course_members.sql
```
- Cria tabela `mentoria.course_members`
- Vincula usuários aos cursos

---

### Passo 5️⃣ - Criar Tabela de Materiais
```
Arquivo: 005_create_materials.sql
```
- Cria tabela `mentoria.materials`
- Armazena PDFs enviados pelo mentor

---

### Passo 6️⃣ - Criar Tabelas do Chat
```
Arquivo: 006_create_conversations_messages.sql
```
- Cria tabela `mentoria.conversations`
- Cria tabela `mentoria.messages`
- Armazena o histórico do chat com a IA

---

### Passo 7️⃣ - Ativar Segurança (RLS)
```
Arquivo: 007_enable_rls.sql
```
- Ativa Row Level Security em todas as tabelas
- **Obrigatório para segurança!**

---

### Passo 8️⃣ - Criar Políticas de Acesso
```
Arquivo: 008_rls_policies.sql
```
- Define quem pode ver/editar cada tabela
- Mentor só vê seus cursos
- Aluno só vê cursos que participa

---

## ✅ Checklist de Execução

Marque conforme for executando:

- [ ] `001_create_schema.sql`
- [ ] `002_create_profiles.sql`
- [ ] `003_create_courses.sql`
- [ ] `004_create_course_members.sql`
- [ ] `005_create_materials.sql`
- [ ] `006_create_conversations_messages.sql`
- [ ] `007_enable_rls.sql`
- [ ] `008_rls_policies.sql`

---

## 📋 Resumo das Migrações

| # | Arquivo | O que cria |
|---|---------|------------|
| 001 | `001_create_schema.sql` | Schema `mentoria` + permissões |
| 002 | `002_create_profiles.sql` | Tabela `profiles` |
| 003 | `003_create_courses.sql` | Tabela `courses` |
| 004 | `004_create_course_members.sql` | Tabela `course_members` |
| 005 | `005_create_materials.sql` | Tabela `materials` |
| 006 | `006_create_conversations_messages.sql` | Tabelas `conversations` + `messages` |
| 007 | `007_enable_rls.sql` | Ativa RLS |
| 008 | `008_rls_policies.sql` | Políticas de segurança |

## 🔒 Segurança (RLS)

Todas as tabelas usam **Row Level Security** para garantir que:

- ✅ Mentor só vê os **cursos dele**
- ✅ Aluno só vê os **cursos que participa**
- ✅ Cada usuário só vê as **próprias conversas**
- ✅ Materiais são visíveis apenas para membros do curso

## 📊 Diagrama do Banco

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  auth.users │◄────│   profiles   │     │    courses      │
└─────────────┘     │  (role)      │     │  (owner_id)     │
       │            └──────────────┘     └────────┬────────┘
       │                                          │
       │            ┌──────────────────┐          │
       └───────────►│  course_members  │◄─────────┘
                    │  (user + course) │
                    └──────────────────┘
                             │
       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
       ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
│  materials   │    │ conversations│───►│    messages      │
│  (PDFs)      │    │  (threads)   │    │ (user/assistant) │
└──────────────┘    └──────────────┘    └──────────────────┘
```

## ⚠️ Importante

- Execute as migrações **na ordem**
- O schema `mentoria` isola todas as tabelas do sistema
- As permissões são configuradas na migração 001

