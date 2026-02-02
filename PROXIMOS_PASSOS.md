# 🎯 Próximos Passos - Após Configurar Supabase

Agora que você configurou o Supabase, vamos completar a configuração do projeto!

---

## ✅ O que já está feito

- ✅ Projeto Supabase criado
- ✅ Credenciais no `.env.local`
- ✅ Migrações executadas (tabelas criadas)

---

## 📋 O que falta fazer

### 1. ⚠️ Configurar Google Gemini (OBRIGATÓRIO)

O projeto precisa da API Key do Gemini para o chat funcionar.

#### Passo a Passo:

1. **Acesse o Google AI Studio**
   - Vá em: https://aistudio.google.com/
   - Faça login com sua conta Google

2. **Obter API Key**
   - Clique em **"Get API Key"** (canto superior direito)
   - Clique em **"Create API Key"**
   - Selecione ou crie um projeto do Google Cloud
   - ⚠️ **IMPORTANTE**: Copie a API Key que aparece! Ela só aparece uma vez.

3. **Adicionar ao .env.local**
   - Abra o arquivo `.env.local` na raiz do projeto
   - Adicione a linha:
   ```env
   GEMINI_API_KEY=sua-api-key-aqui
   ```
   - Salve o arquivo

---

### 2. 🔐 Configurar Google OAuth (OPCIONAL mas recomendado)

Permite login com Google. Se não configurar, só terá login com email/senha.

#### Passo a Passo:

1. **Criar Projeto no Google Cloud**
   - Acesse: https://console.cloud.google.com/
   - Clique em **"Select a project"** → **"New Project"**
   - Nome: `mentor-ia` (ou qualquer nome)
   - Clique em **"Create"**

2. **Habilitar OAuth Consent Screen**
   - No menu lateral, vá em **APIs & Services** → **OAuth consent screen**
   - Escolha **External** → **Create**
   - Preencha:
     - **App name**: `MentorIA`
     - **User support email**: Seu email
     - **Developer contact**: Seu email
   - Clique em **Save and Continue** (vá até o final)

3. **Criar Credenciais OAuth**
   - Vá em **APIs & Services** → **Credentials**
   - Clique em **"Create Credentials"** → **"OAuth client ID"**
   - Tipo: **Web application**
   - Nome: `MentorIA Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
   - **Authorized redirect URIs**:
     - `http://localhost:3000/auth/callback`
   - Clique em **"Create"**
   - ⚠️ **Copie o Client ID e Client Secret!**

4. **Configurar no Supabase**
   - No Supabase Dashboard, vá em **Authentication** → **Providers**
   - Encontre **Google** e clique para habilitar
   - Cole o **Client ID** e **Client Secret**
   - Clique em **"Save"**

---

### 3. 🧪 Testar o Projeto

Após configurar tudo, vamos testar:

#### 3.1 Verificar Variáveis de Ambiente

Certifique-se de que o `.env.local` tem:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yltnhioftdhfjugcibvz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
GEMINI_API_KEY=sua-api-key-aqui
```

#### 3.2 Iniciar o Servidor

```bash
npm run dev
```

#### 3.3 Acessar o Projeto

Abra no navegador: **http://localhost:3000**

#### 3.4 Testar Login

- Tente fazer login (com Google ou email/senha)
- Se funcionar, você será redirecionado para o onboarding
- Escolha se é Mentor ou Aluno

---

## ✅ Checklist Final

Marque conforme for completando:

### Configuração Básica
- [ ] `GEMINI_API_KEY` adicionada ao `.env.local`
- [ ] Projeto inicia sem erros (`npm run dev`)
- [ ] Página de login carrega corretamente

### Google OAuth (Opcional)
- [ ] Projeto criado no Google Cloud
- [ ] OAuth consent screen configurado
- [ ] Credenciais OAuth criadas (Client ID + Secret)
- [ ] Google OAuth configurado no Supabase
- [ ] Login com Google funciona

### Testes
- [ ] Login funciona (email/senha ou Google)
- [ ] Onboarding aparece após primeiro login
- [ ] Consegue criar perfil (Mentor ou Aluno)
- [ ] Dashboard carrega corretamente

---

## 🆘 Problemas Comuns

### Erro: "GEMINI_API_KEY não está configurada"
- **Solução**: Adicione a variável `GEMINI_API_KEY` no `.env.local`
- **Solução**: Reinicie o servidor (`npm run dev`)

### Erro: "Invalid API key" do Gemini
- **Solução**: Verifique se copiou a chave completa
- **Solução**: Gere uma nova chave no Google AI Studio

### Erro ao fazer login com Google
- **Solução**: Verifique se o Client ID e Secret estão corretos no Supabase
- **Solução**: Verifique se as URLs de redirect estão corretas no Google Cloud

### Erro: "relation does not exist"
- **Solução**: Verifique se executou todas as migrações no Supabase
- **Solução**: Verifique se está usando o schema `mentoria`

---

## 🎉 Próximos Passos Após Configurar

1. **Criar seu primeiro curso** (como Mentor)
2. **Adicionar materiais** (upload de PDFs)
3. **Testar o chat** (como Aluno)

---

**Boa sorte! 🚀**
