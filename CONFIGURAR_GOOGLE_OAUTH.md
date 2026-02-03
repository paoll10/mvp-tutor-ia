# 🔐 Configurar Google OAuth - Login com Google

Guia completo passo a passo para configurar o login com Google no Google Cloud Console e no Supabase.

---

## 📋 Pré-requisitos

- Conta no Google (Gmail)
- Acesso ao Google Cloud Console
- Projeto Supabase já configurado

---

## 🚀 Passo 1: Criar Projeto no Google Cloud

### 1.1 Acessar Google Cloud Console

1. Acesse: **https://console.cloud.google.com/**
2. Faça login com sua conta Google

### 1.2 Criar Novo Projeto

1. No topo da página, clique no **seletor de projetos** (ao lado do logo do Google Cloud)
2. Clique em **"New Project"**
3. Preencha:
   - **Project name**: `mentor-ia` (ou qualquer nome)
   - **Organization**: Deixe como está (ou selecione se tiver)
4. Clique em **"Create"**
5. ⏳ Aguarde alguns segundos
6. Selecione o projeto criado no seletor de projetos

---

## 🚀 Passo 2: Configurar OAuth Consent Screen

### 2.1 Acessar OAuth Consent Screen

1. No menu lateral esquerdo, clique em **"APIs & Services"**
2. Clique em **"OAuth consent screen"**

### 2.2 Configurar Tipo de Usuário

1. Selecione **"External"** (para desenvolvimento/teste)
2. Clique em **"Create"**

### 2.3 Preencher Informações do App

**App information:**
- **App name**: `MentorIA`
- **User support email**: Seu email
- **App logo**: (Opcional - pode pular)
- **App domain**: (Opcional - pode pular)
- **Application home page**: `http://localhost:3000`
- **Application privacy policy link**: (Opcional - pode pular)
- **Application terms of service link**: (Opcional - pode pular)
- **Authorized domains**: (Deixe vazio por enquanto)

Clique em **"Save and Continue"**

### 2.4 Configurar Scopes

1. Na tela de **"Scopes"**, clique em **"Add or Remove Scopes"**
2. Selecione os seguintes scopes:
   - ✅ `.../auth/userinfo.email`
   - ✅ `.../auth/userinfo.profile`
   - ✅ `openid`
3. Clique em **"Update"**
4. Clique em **"Save and Continue"**

### 2.5 Adicionar Test Users (Importante!)

1. Na tela de **"Test users"**, clique em **"Add Users"**
2. Adicione seu email (o mesmo que você usa para fazer login)
3. Clique em **"Add"**
4. Clique em **"Save and Continue"**

### 2.6 Revisar e Finalizar

1. Revise as informações
2. Clique em **"Back to Dashboard"**

> ⚠️ **IMPORTANTE**: Durante o desenvolvimento, o app estará em modo "Testing". Apenas os usuários adicionados como "Test users" poderão fazer login.

---

## 🚀 Passo 3: Criar Credenciais OAuth 2.0

### 3.1 Acessar Credentials

1. No menu lateral, vá em **"APIs & Services"** → **"Credentials"**
2. Clique em **"Create Credentials"** (botão no topo)
3. Selecione **"OAuth client ID"**

### 3.2 Configurar OAuth Client

1. **Application type**: Selecione **"Web application"**

2. **Name**: `MentorIA Web Client` (ou qualquer nome)

3. **Authorized JavaScript origins**:
   - Clique em **"Add URI"**
   - Adicione: `http://localhost:3000`
   - Se tiver domínio de produção, adicione também (ex: `https://seu-dominio.com`)

4. **Authorized redirect URIs**:
   - Clique em **"Add URI"**
   - Adicione: `http://localhost:3000/auth/callback`
   - Se tiver domínio de produção, adicione também (ex: `https://seu-dominio.com/auth/callback`)

5. Clique em **"Create"**

### 3.3 Copiar Credenciais

⚠️ **IMPORTANTE**: Uma janela popup aparecerá com suas credenciais. **COPIE AGORA!**

Você verá:
- **Your Client ID**: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
- **Your Client Secret**: `GOCSPX-abcdefghijklmnopqrstuvwxyz`

> 💡 **Dica**: Se fechar a janela sem copiar, você pode ver novamente:
> 1. Vá em **"APIs & Services"** → **"Credentials"**
> 2. Clique no nome do OAuth client criado
> 3. As credenciais estarão visíveis lá

---

## 🚀 Passo 4: Configurar no Supabase

### 4.1 Acessar Supabase Dashboard

1. Acesse: **https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz**
2. No menu lateral, clique em **"Authentication"**
3. Clique em **"Providers"**

### 4.2 Habilitar Google Provider

1. Na lista de providers, encontre **"Google"**
2. Clique no toggle para **habilitar** (ou clique no card do Google)

### 4.3 Adicionar Credenciais

1. **Client ID (for OAuth)**: Cole o **Client ID** copiado do Google Cloud
2. **Client Secret (for OAuth)**: Cole o **Client Secret** copiado do Google Cloud

3. Clique em **"Save"**

> ✅ **Pronto!** O Google OAuth está configurado!

---

## ✅ Testar o Login com Google

### 5.1 Acessar a Página de Login

1. Acesse: **http://localhost:3000/login**
2. Você verá um botão **"Google"** na página

### 5.2 Fazer Login

1. Clique no botão **"Google"**
2. Uma janela popup abrirá
3. Selecione sua conta Google (ou faça login)
4. Autorize o acesso
5. A janela fechará automaticamente
6. Você será redirecionado para o onboarding (se for primeiro login) ou dashboard

---

## 🆘 Problemas Comuns

### Erro: "redirect_uri_mismatch"

**Causa**: A URL de redirect não está configurada corretamente no Google Cloud.

**Solução**:
1. Vá em Google Cloud Console → APIs & Services → Credentials
2. Clique no OAuth client criado
3. Verifique se `http://localhost:3000/auth/callback` está em **"Authorized redirect URIs"**
4. Salve as alterações

### Erro: "access_denied" ou "popup_blocked"

**Causa**: Popup bloqueado pelo navegador.

**Solução**:
1. Permita popups para `localhost:3000`
2. Ou tente em uma janela anônima

### Erro: "This app isn't verified"

**Causa**: O app está em modo "Testing" e você não está na lista de test users.

**Solução**:
1. Vá em Google Cloud Console → APIs & Services → OAuth consent screen
2. Vá em **"Test users"**
3. Adicione seu email à lista
4. Tente fazer login novamente

### Login funciona, mas não redireciona

**Causa**: Pode ser problema com o callback do Supabase.

**Solução**:
1. Verifique se o redirect URI no Supabase está correto: `http://localhost:3000/auth/callback`
2. Verifique se o servidor está rodando (`npm run dev`)

---

## 📋 Checklist de Configuração

Marque conforme for completando:

### Google Cloud Console
- [ ] Projeto criado no Google Cloud
- [ ] OAuth consent screen configurado
- [ ] Tipo de usuário: External
- [ ] App name preenchido
- [ ] Scopes adicionados (email, profile, openid)
- [ ] Test users adicionados
- [ ] OAuth client ID criado
- [ ] Authorized JavaScript origins configurado (`http://localhost:3000`)
- [ ] Authorized redirect URIs configurado (`http://localhost:3000/auth/callback`)
- [ ] Client ID copiado
- [ ] Client Secret copiado

### Supabase
- [ ] Google provider habilitado
- [ ] Client ID adicionado no Supabase
- [ ] Client Secret adicionado no Supabase
- [ ] Configuração salva

### Teste
- [ ] Botão Google aparece na página de login
- [ ] Popup abre ao clicar no botão
- [ ] Login com Google funciona
- [ ] Redirecionamento funciona corretamente

---

## 🎉 Próximos Passos

Após configurar o Google OAuth:

1. ✅ **Teste o login** com diferentes contas Google
2. ✅ **Configure para produção** (quando for fazer deploy):
   - Adicione o domínio de produção nas URLs autorizadas
   - Publique o OAuth consent screen (se necessário)
3. ✅ **Adicione mais test users** se necessário

---

## 📚 Referências

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)

---

**Boa sorte! 🚀**
