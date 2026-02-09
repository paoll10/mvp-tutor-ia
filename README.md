# 🎓 MentorIA - Tutor 24h com RAG

Um tutor inteligente 24 horas que responde dúvidas dos alunos usando **exclusivamente o material do professor/mentor**, com respostas citando a fonte (trechos/páginas).

> **"ChatGPT do Professor"** - Uma base privada de conhecimento para cada curso.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológico](#-stack-tecnológico)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração do Banco](#-configuração-do-banco)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Executando o Projeto](#-executando-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Perfis de Usuário](#-perfis-de-usuário)
- [Fluxo do Sistema](#-fluxo-do-sistema)

---

## 🎯 Sobre o Projeto

O **MentorIA** é um MVP de tutor inteligente que permite:

- **Mentores/Professores** criarem cursos e enviarem materiais (PDFs)
- **Alunos** entrarem em cursos via código de convite
- **Chat com IA** que responde baseado APENAS no material do curso
- **Citações de fontes** mostrando de onde veio cada resposta

### O que NÃO é (escopo do MVP):
- ❌ Plataforma completa de EAD
- ❌ Gamificação (pontos, badges, ranking)
- ❌ Provas, certificados, vídeo-aulas
- ❌ Dashboard avançado de analytics

---

## ✨ Funcionalidades

### Para Mentores/Professores
- ✅ Criar cursos com código de convite
- ✅ Upload de materiais (PDFs)
- ✅ Visualizar status de processamento dos materiais
- ✅ Ver perguntas dos alunos

### Para Alunos
- ✅ Entrar em cursos via código de convite
- ✅ Chat 24h com tutor IA
- ✅ Respostas com citações/fontes do material
- ✅ Histórico de conversas

---

## 🛠 Stack Tecnológico

| Tecnologia | Função |
|------------|--------|
| **Next.js 16** | Framework React (App Router) |
| **TypeScript** | Tipagem estática |
| **Tailwind CSS 4** | Estilização |
| **Supabase** | Auth + Banco de Dados (Postgres) |
| **Gemini 2.5 Flash** | Modelo de IA para respostas do tutor |
| **Google File Search** | RAG (busca inteligente nos PDFs) |

---

## 📦 Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- Conta no **Supabase** (gratuito)
- Conta no **Google Cloud** (para File Search)

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/fabrica-de-produtos/mvp-tutor-ia.git
cd mvp-tutor-ia
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui

# Gemini AI (Google AI Studio)
GEMINI_API_KEY=sua-api-key-do-google-ai-studio
```

---

## 🗄 Configuração do Banco

O projeto usa o **Supabase** com um schema customizado chamado `mentoria`.

### Executar Migrações

As migrações estão na pasta `migrations/`. Execute-as **na ordem** no SQL Editor do Supabase:

| Ordem | Arquivo | Descrição |
|-------|---------|-----------|
| 1️⃣ | `001_create_schema.sql` | Cria schema + permissões |
| 2️⃣ | `002_create_profiles.sql` | Tabela de perfis |
| 3️⃣ | `003_create_courses.sql` | Tabela de cursos |
| 4️⃣ | `004_create_course_members.sql` | Membros dos cursos |
| 5️⃣ | `005_create_materials.sql` | Materiais (PDFs) |
| 6️⃣ | `006_create_conversations_messages.sql` | Chat |
| 7️⃣ | `007_enable_rls.sql` | Ativa segurança |
| 8️⃣ | `008_rls_policies.sql` | Políticas de acesso |
| 9️⃣ | `009_alter_courses_materials.sql` | Status do curso + metadados |
| 🔟 | `010_rls_student_courses.sql` | Políticas RLS para alunos |
| 1️⃣1️⃣ | `011_add_file_search_store_id.sql` | Coluna File Search Store ID nos cursos |

> 📖 Veja instruções detalhadas em [`migrations/README.md`](./migrations/README.md)

### Configurar Google OAuth (Login com Google)

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie credenciais OAuth 2.0
3. No Supabase Dashboard → Authentication → Providers → Google
4. Adicione o Client ID e Client Secret

---

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase | ✅ |
| `GEMINI_API_KEY` | API Key do Google AI Studio (Gemini) | ✅ |

### Obter a API Key do Gemini

1. Acesse [Google AI Studio](https://aistudio.google.com/)
2. Clique em **Get API Key** 
3. Crie uma nova chave ou copie uma existente
4. Adicione ao `.env.local`

---

## 🏃 Executando o Projeto

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Produção

```bash
npm run build
npm start
```

### Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Inicia servidor de produção |
| `npm run lint` | Verifica erros de lint |
| `npm run test:google` | Testa configuração do Google OAuth |
| `npm run check:stores` | Lista File Search Stores e documentos |
| `npm run sync:stores` | Sincroniza File Search Store IDs com o banco |

---

## 📁 Estrutura do Projeto

```
mvp-tutor-ia/
├── app/                              # App Router (Next.js)
│   ├── (mentor-creation)/            # Fluxo de criação de curso
│   │   └── mentor/courses/
│   │       ├── create/               # Step 1: Detalhes
│   │       └── [id]/
│   │           ├── materials/        # Step 2: Upload PDFs
│   │           └── complete/         # Step 3: Código
│   ├── (mentor-global)/              # Dashboard do mentor
│   ├── (mentor-course)/              # Gestão de curso (mentor)
│   │   └── mentor/courses/[id]/
│   │       └── manage/              # Gerenciar curso
│   ├── (onboarding)/                 # Seleção de perfil
│   ├── (public)/                     # Páginas públicas (login)
│   ├── (student)/                    # Dashboard e layout do aluno
│   ├── (student-course)/             # Chat do aluno com tutor IA
│   │   └── student-course/course/
│   │       └── [id]/                # Interface de chat RAG
│   ├── api/
│   │   └── materials/upload/         # API de upload
│   └── auth/                         # Callbacks de auth
├── components/                       # Componentes reutilizáveis
├── docs/                             # Documentação detalhada
├── lib/
│   └── gemini/                       # Integração Google AI
│       ├── client.ts                 # Cliente GoogleGenAI
│       └── file-search.ts            # Adapter File Search
├── migrations/                       # Migrações SQL (001-011)
├── scripts/                          # Scripts utilitários
│   ├── test-google-login.js          # Testa OAuth
│   ├── check-file-search-stores.js   # Lista stores
│   ├── sync-file-search-stores.js    # Sincroniza store IDs
│   └── test-file-search-query.js     # Testa queries do File Search
├── server/                           # Server Actions
│   ├── profiles.ts                   # Gestão de perfis
│   ├── courses.ts                    # CRUD de cursos
│   ├── chat.ts                       # Chat IA com Gemini File Search
│   ├── student-courses.ts            # Fluxo do aluno (entrar em curso)
│   └── materials.ts                  # Gestão de materiais
├── utils/supabase/                   # Clientes Supabase
└── proxy.ts                          # Middleware (proxy)
```

---

## 👥 Perfis de Usuário

### Mentor / Professor
- Cria cursos
- Envia materiais (PDFs)
- Gera códigos de convite
- Visualiza perguntas dos alunos

### Aluno
- Entra em cursos via código
- Faz perguntas no chat
- Recebe respostas com fontes
- Acessa histórico de conversas

---

## 🔄 Fluxo do Sistema

```
┌─────────────┐     ┌───────────────┐     ┌──────────────────┐
│   Login     │────►│ Tem profile?  │─NO─►│   Onboarding     │
│  (Google)   │     │               │     │ "Mentor ou Aluno"│
└─────────────┘     └───────┬───────┘     └────────┬─────────┘
                            │ YES                   │
                            ▼                       ▼
                    ┌───────────────┐       ┌──────────────────┐
                    │   Dashboard   │◄──────│  Cria Profile    │
                    │ (por role)    │       │  e Redireciona   │
                    └───────────────┘       └──────────────────┘
```

### Fluxo do Chat (RAG com Gemini File Search)

```
Aluno faz pergunta
      │
      ▼
┌──────────────────────┐
│  Server Action       │
│  askQuestion()       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Gemini 2.5 Flash     │
│ + File Search Tool   │
│ (fileSearchStoreNames)│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Busca semântica nos  │
│ PDFs do curso via    │
│ File Search Store    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ LLM responde APENAS  │
│ com base nos chunks  │
│ retornados            │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Retorna resposta     │
│ + fontes (deduplica- │
│   das, com snippets) │
└──────────────────────┘
```

> **Nota**: O tutor é instruído a responder exclusivamente com base nos documentos do curso. Se nenhum chunk relevante for encontrado, ele informa que não encontrou a informação nos materiais.

---

## 📝 Changelog

### v0.5.1 (2026-01-31) - Correções do Chat e File Search

#### 🐛 Correções
- **Gemini API**: Corrigido parâmetro `fileSearchStoreIds` para `fileSearchStoreNames` que causava erro 400 (`INVALID_ARGUMENT`)
- **Instruções do Tutor**: System instruction reescrita para eliminar alucinações — o tutor agora responde **exclusivamente** com base nos documentos do File Search, e informa quando não encontra informações relevantes
- **Scroll do Chat**: Corrigido bug onde a janela de chat não rolava, impedindo a visualização de respostas completas
  - Layout reestruturado com Flexbox (`flex-col h-full`)
  - Header e input com `flex-shrink-0`
  - Área de mensagens com `flex-1 min-h-0 overflow-y-auto`

#### ✅ Melhorias
- **Scrollbar customizada**: Adicionado estilo visual para scrollbar na área de chat (`.custom-scrollbar`)
- **Fontes deduplicadas**: Fontes citadas agora usam `Set` para evitar duplicatas
- **Snippets maiores**: Tamanho dos trechos exibidos aumentado de 200 para 300 caracteres
- **Debug logging**: Adicionados logs de depuração para `file_search_store_id` e `groundingMetadata`

#### 📦 Arquivos Adicionados/Alterados
- `server/chat.ts` - Correção de API + melhoria de system instruction
- `app/(student-course)/student-course/course/[id]/page.tsx` - Reestruturação do layout com Flexbox
- `app/globals.css` - Estilos de scrollbar customizada
- `scripts/test-file-search-query.js` - Script de teste direto do File Search API

---

### v0.5.0 (2026-01-31) - Chat RAG com Gemini

#### ✅ Novas Funcionalidades
- **Chat com IA**: Interface de chat funcional para alunos
- **Integração Gemini File Search**: RAG com materiais do curso
- **Fontes Citadas**: Exibe documentos consultados na resposta
- **Server Action `askQuestion`**: Envia pergunta e retorna resposta com fontes

#### 📦 Arquivos Adicionados/Alterados
- `server/chat.ts` - Server Action para chat com IA
- `app/(student-course)/student-course/course/[id]/page.tsx` - Página de chat real
- `app/(student-course)/layout.tsx` - Layout simplificado

---

### v0.4.0 (2026-01-31) - Fluxo do Aluno

#### ✅ Novas Funcionalidades
- **Dashboard do Aluno**: Página inicial com cursos inscritos
- **Entrar em Curso**: Aluno insere código de convite para entrar
- **Lista de Cursos**: Exibe cursos do aluno com link para chat
- **Server Actions**: `joinCourseByCode`, `listStudentCourses`, `getStudentCourse`
- **Migração RLS**: Políticas para alunos acessarem cursos publicados

#### 📦 Arquivos Adicionados
- `server/student-courses.ts` - Server Actions para aluno
- `app/(student)/student/dashboard/page.tsx` - Dashboard do aluno
- `migrations/010_rls_student_courses.sql` - Políticas RLS para alunos

#### 🔄 Alterações
- Layout do aluno atualizado com novos links
- Redirecionamento pós-login agora vai para `/student/dashboard`

---

### v0.3.1 (2026-01-31) - Correções e Gestão de Curso

#### 🐛 Correções
- **pageSize**: Corrigido limite de 100 para 20 (API File Search)
- **Polling**: Agora só roda quando há materiais em processamento

#### ✅ Melhorias
- **Página de Gestão do Curso**: Agora usa dados reais do banco
  - Exibe nome, descrição e status do curso
  - Lista materiais com status real
  - Upload de PDFs funcional
  - Código de convite visível apenas se publicado

---

### v0.3.0 (2026-01-31) - Módulo de Cursos

#### ✅ Novas Funcionalidades
- **Criação de Cursos**: Wizard em 3 etapas (Detalhes → Materiais → Conclusão)
- **Upload de PDFs**: Drag & drop com status em tempo real
- **Gemini File Search**: Integração completa para RAG
  - Chunking automático de documentos
  - Indexação e busca semântica
- **Dashboard do Mentor**: Lista cursos reais do banco
- **Script de verificação**: `npm run check:stores`

#### 📦 Arquivos Adicionados
- `lib/gemini/client.ts` - Cliente GoogleGenAI
- `lib/gemini/file-search.ts` - Adapter File Search
- `server/courses.ts` - CRUD de cursos
- `server/materials.ts` - Gestão de materiais
- `app/api/materials/upload/route.ts` - API de upload
- `scripts/check-file-search-stores.js` - Script de verificação

---

### v0.2.0 (2026-01-30) - Auth + Onboarding

#### ✅ Novas Funcionalidades
- Login com email/senha
- Login com Google (OAuth em popup)
- Recuperação de senha
- Onboarding (seleção Mentor/Aluno)
- Migrações do banco (001-009)

---

### v0.1.0 (2026-01-29) - Setup Inicial

- Estrutura base do Next.js 16
- Configuração Supabase
- Layouts para Mentor e Aluno
- Proxy (middleware) configurado

---

## 📄 Licença

Este projeto é privado e pertence à **Fábrica de Produtos**.

---

## 🤝 Contribuição

1. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
2. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
3. Push para a branch: `git push origin feature/nova-funcionalidade`
4. Abra um Pull Request

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.
