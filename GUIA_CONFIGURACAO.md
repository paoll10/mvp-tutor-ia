# 🚀 Guia Completo de Configuração - MentorIA

Este guia vai te ajudar a configurar o projeto MentorIA do zero até estar funcionando completamente.

---

## 📋 Índice

1. [Pré-requisitos](#1-pré-requisitos)
2. [Configuração do Supabase](#2-configuração-do-supabase)
3. [Configuração do Google Cloud (Gemini + File Search)](#3-configuração-do-google-cloud-gemini--file-search)
4. [Configuração do Google OAuth](#4-configuração-do-google-oauth)
5. [Variáveis de Ambiente](#5-variáveis-de-ambiente)
6. [Executar Migrações do Banco](#6-executar-migrações-do-banco)
7. [Testar a Configuração](#7-testar-a-configuração)
8. [Executar o Projeto](#8-executar-o-projeto)

---

## 1. Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ **Node.js 18+** instalado ([Download](https://nodejs.org/))
- ✅ **npm** ou **yarn** instalado
- ✅ Conta no **Supabase** (gratuito) ([Criar conta](https://supabase.com))
- ✅ Conta no **Google Cloud** (gratuito) ([Criar conta](https://console.cloud.google.com/))
- ✅ Conta no **Google AI Studio** (gratuito) ([Acessar](https://aistudio.google.com/))

---

## 2. Configuração do Supabase

### 2.1 Criar Projeto no Supabase

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `mentor-ia` (ou qualquer nome)
   - **Database Password**: Anote essa senha! Você vai precisar depois
   - **Region**: Escolha a mais próxima (ex: `South America (São Paulo)`)
4. Clique em **"Create new project"**
5. Aguarde alguns minutos enquanto o projeto é criado

### 2.2 Obter Credenciais do Supabase

1. No Dashboard do Supabase, vá em **Settings** → **API**
2. Anote as seguintes informações:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (⚠️ Mantenha secreto!)

> 💡 **Dica**: Você vai precisar dessas credenciais na seção [Variáveis de Ambiente](#5-variáveis-de-ambiente)

---

## 3. Configuração do Google Cloud (Gemini + File Search)

### 3.1 Criar Projeto no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique no seletor de projetos (topo da página)
3. Clique em **"New Project"**
4. Preencha:
   - **Project name**: `mentor-ia` (ou qualquer nome)
   - **Organization**: Deixe padrão
5. Clique em **"Create"**
6. Aguarde alguns segundos e selecione o projeto criado

### 3.2 Habilitar APIs Necessárias

1. No menu lateral, vá em **APIs & Services** → **Library**
2. Procure e habilite as seguintes APIs:
   - ✅ **Generative Language API** (para Gemini)
   - ✅ **Vertex AI API** (para File Search)

> 💡 **Como habilitar**: Digite o nome da API na busca, clique nela, depois em **"Enable"**

### 3.3 Criar Service Account (para File Search)

1. Vá em **IAM & Admin** → **Service Accounts**
2. Clique em **"Create Service Account"**
3. Preencha:
   - **Name**: `mentor-ia-file-search`
   - **Description**: `Service account para File Search do MentorIA`
4. Clique em **"Create and Continue"**
5. Em **Grant this service account access to project**, adicione a role:
   - **Vertex AI User** (`roles/aiplatform.user`)
6. Clique em **"Continue"** e depois **"Done"**
7. Clique no service account criado
8. Vá na aba **"Keys"**
9. Clique em **"Add Key"** → **"Create new key"**
10. Selecione **JSON** e clique em **"Create"**
11. ⚠️ **IMPORTANTE**: Salve o arquivo JSON baixado em local seguro! Você vai precisar dele.

### 3.4 Obter Project ID

1. No Google Cloud Console, vá em **Dashboard** (menu lateral)
2. Anote o **Project ID** (ex: `mentor-ia-123456`)
3. Anote também o **Project Number** (pode ser útil depois)

---

## 4. Configuração do Google OAuth

### 4.1 Criar Credenciais OAuth 2.0

1. No Google Cloud Console, vá em **APIs & Services** → **Credentials**
2. Clique em **"Create Credentials"** → **"OAuth client ID"**
3. Se aparecer uma tela de configuração do OAuth consent screen:
   - **User Type**: Escolha **External** (para desenvolvimento)
   - Clique em **"Create"**
   - **App name**: `MentorIA`
   - **User support email**: Seu email
   - **Developer contact information**: Seu email
   - Clique em **"Save and Continue"**
   - Em **Scopes**, clique em **"Save and Continue"**
   - Em **Test users**, adicione seu email e clique em **"Save and Continue"**
   - Clique em **"Back to Dashboard"**
4. Agora volte em **Credentials** → **"Create Credentials"** → **"OAuth client ID"**
5. Selecione **"Web application"**
6. Preencha:
   - **Name**: `MentorIA Web Client`
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000`
     - `https://seu-dominio.com` (se tiver)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/auth/callback`
     - `https://seu-dominio.com/auth/callback` (se tiver)
7. Clique em **"Create"**
8. ⚠️ **IMPORTANTE**: Anote o **Client ID** e **Client Secret** que aparecem na tela!

### 4.2 Configurar OAuth no Supabase

1. No Dashboard do Supabase, vá em **Authentication** → **Providers**
2. Encontre **Google** na lista
3. Clique para habilitar
4. Preencha:
   - **Client ID (for OAuth)**: Cole o Client ID do passo anterior
   - **Client Secret (for OAuth)**: Cole o Client Secret do passo anterior
5. Clique em **"Save"**

---

## 5. Variáveis de Ambiente

### 5.1 Obter API Key do Gemini

1. Acesse [Google AI Studio](https://aistudio.google.com/)
2. Faça login com sua conta Google
3. Clique em **"Get API Key"** (canto superior direito)
4. Clique em **"Create API Key"**
5. Selecione o projeto criado no Google Cloud
6. ⚠️ **IMPORTANTE**: Copie a API Key que aparece! Ela só aparece uma vez.

### 5.2 Criar Arquivo .env.local

1. Na raiz do projeto, crie um arquivo chamado `.env.local`
2. Cole o seguinte conteúdo e preencha com suas credenciais:

```env
# ============================================
# SUPABASE
# ============================================
# Obtenha em: Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# GOOGLE GEMINI AI
# ============================================
# Obtenha em: https://aistudio.google.com/ → Get API Key
GEMINI_API_KEY=AIzaSy...

# ============================================
# GOOGLE FILE SEARCH (Opcional - se usar Vertex AI)
# ============================================
# Obtenha em: Google Cloud Console → Service Accounts → Keys
GOOGLE_FILESEARCH_PROJECT_ID=seu-project-id
GOOGLE_FILESEARCH_LOCATION=us-central1
# Caminho para o arquivo JSON do Service Account
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account-key.json
```

### 5.3 Explicação das Variáveis

| Variável | Obrigatório | Onde Obter |
|----------|-------------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Sim | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Sim | Supabase Dashboard → Settings → API |
| `GEMINI_API_KEY` | ✅ Sim | Google AI Studio → Get API Key |
| `GOOGLE_FILESEARCH_PROJECT_ID` | ⚠️ Opcional | Google Cloud Console → Dashboard |
| `GOOGLE_FILESEARCH_LOCATION` | ⚠️ Opcional | Região do Google Cloud (ex: `us-central1`) |
| `GOOGLE_APPLICATION_CREDENTIALS` | ⚠️ Opcional | Caminho para o JSON do Service Account |

> 💡 **Nota**: As variáveis do File Search são opcionais se você não for usar Vertex AI diretamente. O projeto usa principalmente a API do Gemini File Search.

---

## 6. Executar Migrações do Banco

### 6.1 Acessar SQL Editor do Supabase

1. No Dashboard do Supabase, vá em **SQL Editor** (menu lateral)
2. Clique em **"New query"**

### 6.2 Executar Migrações na Ordem

Execute cada arquivo SQL da pasta `migrations/` **NA ORDEM EXATA**:

#### ✅ Migração 001 - Schema e Permissões
1. Abra o arquivo `migrations/001_create_schema.sql`
2. Copie todo o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **"Run"** (ou pressione `Ctrl+Enter`)
5. Verifique se apareceu "Success. No rows returned"

#### ✅ Migração 002 - Tabela de Perfis
1. Abra `migrations/002_create_profiles.sql`
2. Copie e cole no SQL Editor
3. Execute

#### ✅ Migração 003 - Tabela de Cursos
1. Abra `migrations/003_create_courses.sql`
2. Copie e cole no SQL Editor
3. Execute

#### ✅ Migração 004 - Tabela de Membros
1. Abra `migrations/004_create_course_members.sql`
2. Copie e cole no SQL Editor
3. Execute

#### ✅ Migração 005 - Tabela de Materiais
1. Abra `migrations/005_create_materials.sql`
2. Copie e cole no SQL Editor
3. Execute

#### ✅ Migração 006 - Tabelas do Chat
1. Abra `migrations/006_create_conversations_messages.sql`
2. Copie e cole no SQL Editor
3. Execute

#### ✅ Migração 007 - Ativar RLS
1. Abra `migrations/007_enable_rls.sql`
2. Copie e cole no SQL Editor
3. Execute

#### ✅ Migração 008 - Políticas RLS
1. Abra `migrations/008_rls_policies.sql`
2. Copie e cole no SQL Editor
3. Execute

#### ✅ Migração 009 - Alterações para Fluxo de Criação
1. Abra `migrations/009_alter_courses_materials.sql`
2. Copie e cole no SQL Editor
3. Execute

#### ✅ Migração 010 - Políticas RLS para Alunos
1. Abra `migrations/010_rls_student_courses.sql`
2. Copie e cole no SQL Editor
3. Execute

#### ✅ Migração 011 - File Search Store ID
1. Abra `migrations/011_add_file_search_store_id.sql`
2. Copie e cole no SQL Editor
3. Execute

### 6.3 Verificar se as Tabelas Foram Criadas

1. No Supabase Dashboard, vá em **Table Editor**
2. Você deve ver as seguintes tabelas no schema `mentoria`:
   - ✅ `profiles`
   - ✅ `courses`
   - ✅ `course_members`
   - ✅ `materials`
   - ✅ `conversations`
   - ✅ `messages`

---

## 7. Testar a Configuração

### 7.1 Testar Google OAuth

Execute o script de teste:

```bash
npm run test:google
```

Se tudo estiver correto, você verá uma mensagem de sucesso.

### 7.2 Testar File Search Stores (Opcional)

Execute o script de verificação:

```bash
npm run check:stores
```

Este script lista os File Search Stores criados no Google Cloud.

---

## 8. Executar o Projeto

### 8.1 Modo Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em: **http://localhost:3000**

### 8.2 Modo Produção

```bash
npm run build
npm start
```

---

## ✅ Checklist Final

Marque conforme for completando:

### Configuração Inicial
- [ ] Node.js 18+ instalado
- [ ] Projeto clonado e dependências instaladas (`npm install`)

### Supabase
- [ ] Projeto criado no Supabase
- [ ] Credenciais anotadas (URL e ANON KEY)
- [ ] Google OAuth configurado no Supabase

### Google Cloud
- [ ] Projeto criado no Google Cloud
- [ ] APIs habilitadas (Generative Language API, Vertex AI API)
- [ ] Service Account criado (se necessário)
- [ ] Project ID anotado

### Google OAuth
- [ ] Credenciais OAuth 2.0 criadas
- [ ] Client ID e Client Secret configurados no Supabase

### Variáveis de Ambiente
- [ ] Arquivo `.env.local` criado
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurado
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurado
- [ ] `GEMINI_API_KEY` configurado

### Banco de Dados
- [ ] Migração 001 executada
- [ ] Migração 002 executada
- [ ] Migração 003 executada
- [ ] Migração 004 executada
- [ ] Migração 005 executada
- [ ] Migração 006 executada
- [ ] Migração 007 executada
- [ ] Migração 008 executada
- [ ] Migração 009 executada
- [ ] Migração 010 executada
- [ ] Migração 011 executada
- [ ] Tabelas verificadas no Table Editor

### Testes
- [ ] Script `test:google` executado com sucesso
- [ ] Projeto inicia sem erros (`npm run dev`)

---

## 🆘 Problemas Comuns

### Erro: "GEMINI_API_KEY não está configurada"
- Verifique se o arquivo `.env.local` existe na raiz do projeto
- Verifique se a variável está escrita corretamente
- Reinicie o servidor de desenvolvimento

### Erro: "Invalid API key" no Supabase
- Verifique se copiou a chave completa (sem espaços)
- Verifique se está usando a `anon key` e não a `service_role key`

### Erro ao executar migrações
- Certifique-se de executar na ordem exata (001 → 011)
- Verifique se não há erros de sintaxe SQL
- Verifique se o schema `mentoria` foi criado na migração 001

### Google OAuth não funciona
- Verifique se as URLs de redirect estão corretas no Google Cloud Console
- Verifique se o Client ID e Secret estão corretos no Supabase
- Verifique se o OAuth consent screen está configurado

---

## 📚 Próximos Passos

Após configurar tudo:

1. **Teste o Login**: Acesse `http://localhost:3000/login` e teste o login com Google
2. **Crie um Perfil**: Após o primeiro login, você será redirecionado para o onboarding
3. **Crie um Curso**: Como mentor, crie seu primeiro curso
4. **Adicione Materiais**: Faça upload de PDFs para o curso
5. **Teste o Chat**: Como aluno, entre no curso e teste o chat com IA

---

## 📞 Suporte

Se tiver dúvidas ou problemas:
- Consulte a [documentação completa](./docs/MVP-TUTOR-24H-DOCUMENTACAO.md)
- Verifique o [README principal](./README.md)
- Entre em contato com a equipe de desenvolvimento

---

**Boa sorte com a configuração! 🚀**
