# 🗄️ Configuração Rápida do Supabase - MentorIA

Guia prático passo a passo para configurar o Supabase do zero.

---

## 📋 Passo 1: Criar Projeto no Supabase

### 1.1 Acessar o Dashboard

1. Acesse: **https://supabase.com/dashboard**
2. Faça login (ou crie uma conta gratuita)

### 1.2 Criar Novo Projeto

1. Clique no botão **"New Project"** (canto superior direito)
2. Preencha os dados:
   - **Name**: `mentor-ia` (ou qualquer nome de sua preferência)
   - **Database Password**: 
     - ⚠️ **IMPORTANTE**: Anote essa senha em local seguro!
     - Use uma senha forte (mínimo 12 caracteres)
   - **Region**: Escolha a região mais próxima
     - 🇧🇷 **Brasil**: `South America (São Paulo)`
     - 🇺🇸 **EUA**: `US East (North Virginia)` ou `US West (Oregon)`
     - 🇪🇺 **Europa**: `West Europe (Ireland)`
3. Clique em **"Create new project"**
4. ⏳ Aguarde 2-3 minutos enquanto o projeto é criado

---

## 📋 Passo 2: Obter Credenciais

### 2.1 Acessar Configurações da API

1. No Dashboard do Supabase, clique em **Settings** (ícone de engrenagem no menu lateral)
2. Clique em **API** (no submenu)

### 2.2 Copiar Credenciais

Você verá uma seção chamada **"Project API keys"**. Copie as seguintes informações:

#### ✅ Project URL
```
https://xxxxx.supabase.co
```
- Copie a URL completa
- Exemplo: `https://abcdefghijklmnop.supabase.co`

#### ✅ anon public key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- Esta é a chave pública (pode ser exposta no frontend)
- Copie a chave completa (é bem longa)

#### ⚠️ service_role key (Opcional - mantenha secreto!)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- Esta chave tem acesso total ao banco
- **NUNCA** exponha no frontend
- Guarde em local seguro

---

## 📋 Passo 3: Criar Arquivo .env.local

### 3.1 Criar o Arquivo

Na raiz do projeto, crie um arquivo chamado `.env.local`

### 3.2 Adicionar Variáveis

Cole o seguinte conteúdo e substitua pelos seus valores:

```env
# ============================================
# SUPABASE - CONFIGURAÇÃO
# ============================================
# Obtenha em: Supabase Dashboard → Settings → API

# URL do seu projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# Chave pública anônima (anon key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.3 Exemplo Completo

```env
# ============================================
# SUPABASE
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.ExemploDeChaveMuitoLongaAqui123456789

# ============================================
# GOOGLE GEMINI AI (vamos configurar depois)
# ============================================
GEMINI_API_KEY=
```

---

## 📋 Passo 4: Executar Migrações do Banco

### 4.1 Acessar SQL Editor

1. No Dashboard do Supabase, clique em **SQL Editor** (menu lateral esquerdo)
2. Clique em **"New query"** (botão verde no topo)

### 4.2 Executar Migrações na Ordem

⚠️ **IMPORTANTE**: Execute cada migração **NA ORDEM EXATA** abaixo!

#### ✅ Migração 001 - Schema e Permissões

1. Abra o arquivo: `migrations/001_create_schema.sql`
2. Copie **TODO** o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **"Run"** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)
5. ✅ Deve aparecer: **"Success. No rows returned"**

#### ✅ Migração 002 - Tabela de Perfis

1. Abra: `migrations/002_create_profiles.sql`
2. Copie e cole no SQL Editor
3. Execute (Run)
4. ✅ Verifique sucesso

#### ✅ Migração 003 - Tabela de Cursos

1. Abra: `migrations/003_create_courses.sql`
2. Copie e cole no SQL Editor
3. Execute (Run)
4. ✅ Verifique sucesso

#### ✅ Migração 004 - Tabela de Membros

1. Abra: `migrations/004_create_course_members.sql`
2. Copie e cole no SQL Editor
3. Execute (Run)
4. ✅ Verifique sucesso

#### ✅ Migração 005 - Tabela de Materiais

1. Abra: `migrations/005_create_materials.sql`
2. Copie e cole no SQL Editor
3. Execute (Run)
4. ✅ Verifique sucesso

#### ✅ Migração 006 - Tabelas do Chat

1. Abra: `migrations/006_create_conversations_messages.sql`
2. Copie e cole no SQL Editor
3. Execute (Run)
4. ✅ Verifique sucesso

#### ✅ Migração 007 - Ativar RLS (Segurança)

1. Abra: `migrations/007_enable_rls.sql`
2. Copie e cole no SQL Editor
3. Execute (Run)
4. ✅ Verifique sucesso

#### ✅ Migração 008 - Políticas RLS

1. Abra: `migrations/008_rls_policies.sql`
2. Copie e cole no SQL Editor
3. Execute (Run)
4. ✅ Verifique sucesso

#### ✅ Migração 009 - Alterações para Fluxo de Criação

1. Abra: `migrations/009_alter_courses_materials.sql`
2. Copie e cole no SQL Editor
3. Execute (Run)
4. ✅ Verifique sucesso

#### ✅ Migração 010 - Políticas RLS para Alunos

1. Abra: `migrations/010_rls_student_courses.sql`
2. Copie e cole no SQL Editor
3. Execute (Run)
4. ✅ Verifique sucesso

#### ✅ Migração 011 - File Search Store ID

1. Abra: `migrations/011_add_file_search_store_id.sql`
2. Copie e cole no SQL Editor
3. Execute (Run)
4. ✅ Verifique sucesso

---

## 📋 Passo 5: Verificar Tabelas Criadas

### 5.1 Acessar Table Editor

1. No Dashboard do Supabase, clique em **Table Editor** (menu lateral)
2. No seletor de schema (topo), escolha **`mentoria`**

### 5.2 Verificar Tabelas

Você deve ver as seguintes tabelas:

- ✅ `profiles` - Perfis de usuários (mentor/aluno)
- ✅ `courses` - Cursos criados pelos mentores
- ✅ `course_members` - Membros dos cursos
- ✅ `materials` - Materiais (PDFs) dos cursos
- ✅ `conversations` - Conversas do chat
- ✅ `messages` - Mensagens do chat

---

## 📋 Passo 6: Testar Conexão

### 6.1 Verificar Arquivo .env.local

Certifique-se de que o arquivo `.env.local` está na raiz do projeto com as credenciais corretas.

### 6.2 Testar no Código (Opcional)

Você pode testar a conexão executando:

```bash
npm run dev
```

Se não houver erros relacionados ao Supabase, a conexão está funcionando!

---

## ✅ Checklist de Configuração

Marque conforme for completando:

### Projeto Supabase
- [ ] Projeto criado no Supabase
- [ ] Senha do banco anotada em local seguro
- [ ] Projeto finalizado (status: Active)

### Credenciais
- [ ] Project URL copiada
- [ ] anon public key copiada
- [ ] service_role key copiada (opcional, mas recomendado)

### Arquivo .env.local
- [ ] Arquivo `.env.local` criado na raiz do projeto
- [ ] `NEXT_PUBLIC_SUPABASE_URL` preenchido
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` preenchido

### Migrações
- [ ] Migração 001 executada com sucesso
- [ ] Migração 002 executada com sucesso
- [ ] Migração 003 executada com sucesso
- [ ] Migração 004 executada com sucesso
- [ ] Migração 005 executada com sucesso
- [ ] Migração 006 executada com sucesso
- [ ] Migração 007 executada com sucesso
- [ ] Migração 008 executada com sucesso
- [ ] Migração 009 executada com sucesso
- [ ] Migração 010 executada com sucesso
- [ ] Migração 011 executada com sucesso

### Verificação
- [ ] Tabelas visíveis no Table Editor (schema `mentoria`)
- [ ] Projeto inicia sem erros (`npm run dev`)

---

## 🆘 Problemas Comuns

### Erro: "schema mentoria does not exist"
- **Solução**: Execute a migração 001 primeiro!

### Erro: "permission denied"
- **Solução**: Verifique se executou todas as migrações na ordem
- **Solução**: Verifique se a migração 001 foi executada (ela cria as permissões)

### Erro: "relation already exists"
- **Solução**: A tabela já foi criada. Pule essa migração e continue com a próxima.

### Erro: "NEXT_PUBLIC_SUPABASE_URL is not defined"
- **Solução**: Verifique se o arquivo `.env.local` está na raiz do projeto
- **Solução**: Reinicie o servidor (`npm run dev`)

### Erro: "Invalid API key"
- **Solução**: Verifique se copiou a chave completa (sem espaços)
- **Solução**: Certifique-se de estar usando a `anon key` e não a `service_role key`

---

## 🎉 Próximos Passos

Após configurar o Supabase:

1. ✅ **Configurar Google Cloud** (para Gemini e File Search)
2. ✅ **Configurar Google OAuth** (para login com Google)
3. ✅ **Obter API Key do Gemini** (Google AI Studio)
4. ✅ **Testar o projeto** (`npm run dev`)

---

**Boa sorte! 🚀**
