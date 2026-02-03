# 🚀 Configuração para Produção - Vercel

Guia completo do que precisa ser configurado além do deploy na Vercel.

---

## ✅ Checklist de Configuração para Produção

### 1. Variáveis de Ambiente na Vercel ✅
### 2. Google OAuth para Produção ✅
### 3. Supabase (URLs de Redirect) ✅
### 4. Verificações Finais ✅

---

## 📋 Passo 1: Configurar Variáveis de Ambiente na Vercel

### 1.1 Acessar Configurações do Projeto

1. Acesse: **https://vercel.com/dashboard**
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**

### 1.2 Adicionar Variáveis

Adicione as seguintes variáveis (as mesmas do seu `.env.local`):

#### ✅ Variáveis Obrigatórias

```
NEXT_PUBLIC_SUPABASE_URL
```
- **Value**: `https://yltnhioftdhfjugcibvz.supabase.co`
- **Environment**: Production, Preview, Development (marque todas)

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
- **Value**: Sua chave anon do Supabase
- **Environment**: Production, Preview, Development (marque todas)

```
GEMINI_API_KEY
```
- **Value**: `AIzaSyBGV6P_MGb3-4iF8gRDfNB3OYWFQx8zUO8`
- **Environment**: Production, Preview, Development (marque todas)
- ⚠️ **IMPORTANTE**: Esta é uma variável secreta, não marque como "Public"

### 1.3 Salvar e Fazer Redeploy

1. Clique em **"Save"** para cada variável
2. Após adicionar todas, vá em **Deployments**
3. Clique nos **3 pontinhos** do último deployment → **Redeploy**
4. Isso aplicará as novas variáveis

---

## 📋 Passo 2: Configurar Google OAuth para Produção

### 2.1 Obter URL de Produção da Vercel

Após fazer deploy, você terá uma URL como:
- `https://seu-projeto.vercel.app`
- Ou seu domínio customizado (se configurou)

**Anote essa URL!** Você vai precisar dela.

### 2.2 Atualizar Google Cloud Console

1. Acesse: **https://console.cloud.google.com/**
2. Vá em **APIs & Services** → **Credentials**
3. Clique no **OAuth client ID** que você criou (ou crie um novo para produção)

4. **Adicionar URLs de Produção**:

   **Authorized JavaScript origins**:
   - Adicione: `https://seu-projeto.vercel.app`
   - Se tiver domínio customizado: `https://seu-dominio.com`

   **Authorized redirect URIs**:
   - Adicione: `https://seu-projeto.vercel.app/auth/callback`
   - Se tiver domínio customizado: `https://seu-dominio.com/auth/callback`

5. Clique em **"Save"**

### 2.3 Atualizar Supabase

1. Acesse: **https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz**
2. Vá em **Authentication** → **URL Configuration**
3. Adicione nas **Redirect URLs**:
   - `https://seu-projeto.vercel.app/auth/callback`
   - `https://seu-dominio.com/auth/callback` (se tiver)

4. Clique em **"Save"**

---

## 📋 Passo 3: Publicar OAuth Consent Screen (Opcional mas Recomendado)

Se você quiser que qualquer pessoa possa fazer login (não apenas test users):

### 3.1 Publicar App no Google Cloud

1. Acesse: **https://console.cloud.google.com/**
2. Vá em **APIs & Services** → **OAuth consent screen**
3. Revise todas as informações
4. Clique em **"PUBLISH APP"** (botão no topo)
5. Confirme a publicação

> ⚠️ **Nota**: Após publicar, qualquer pessoa poderá fazer login. Se quiser manter apenas test users, não publique.

---

## 📋 Passo 4: Verificações Finais

### 4.1 Testar Deploy

1. Acesse sua URL de produção: `https://seu-projeto.vercel.app`
2. Teste o login com Google
3. Teste criar um curso (se Mentor)
4. Teste entrar em curso (se Aluno)
5. Teste o chat com IA

### 4.2 Verificar Logs

Se algo não funcionar:

1. Na Vercel, vá em **Deployments**
2. Clique no deployment
3. Vá em **Functions** → veja os logs
4. Verifique se há erros relacionados a:
   - Variáveis de ambiente não encontradas
   - URLs de redirect incorretas
   - APIs não habilitadas

### 4.3 Verificar Variáveis de Ambiente

Na Vercel:
1. Vá em **Settings** → **Environment Variables**
2. Verifique se todas as variáveis estão configuradas
3. Verifique se estão marcadas para **Production**

---

## 🆘 Problemas Comuns em Produção

### Erro: "redirect_uri_mismatch"

**Causa**: URL de redirect não configurada no Google Cloud.

**Solução**:
1. Verifique a URL exata da Vercel
2. Adicione em **Authorized redirect URIs** no Google Cloud
3. Aguarde alguns minutos (pode demorar para propagar)

### Erro: "GEMINI_API_KEY não está configurada"

**Causa**: Variável não foi adicionada na Vercel ou não foi feito redeploy.

**Solução**:
1. Adicione a variável na Vercel
2. Faça um redeploy
3. Verifique se está marcada para Production

### Erro: "Supabase connection failed"

**Causa**: URLs ou chaves incorretas.

**Solução**:
1. Verifique se `NEXT_PUBLIC_SUPABASE_URL` está correto
2. Verifique se `NEXT_PUBLIC_SUPABASE_ANON_KEY` está correto
3. Faça redeploy após corrigir

### Login com Google não funciona

**Causa**: URLs de produção não configuradas.

**Solução**:
1. Adicione a URL da Vercel no Google Cloud Console
2. Adicione a URL no Supabase (Redirect URLs)
3. Aguarde alguns minutos

---

## ✅ Checklist Final de Produção

Marque conforme for completando:

### Vercel
- [ ] Projeto criado na Vercel
- [ ] Deploy realizado com sucesso
- [ ] URL de produção anotada
- [ ] Variáveis de ambiente configuradas:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `GEMINI_API_KEY`
- [ ] Redeploy realizado após adicionar variáveis

### Google Cloud (OAuth)
- [ ] URLs de produção adicionadas em **Authorized JavaScript origins**
- [ ] URLs de produção adicionadas em **Authorized redirect URIs**
- [ ] OAuth consent screen publicado (opcional)

### Supabase
- [ ] URLs de produção adicionadas em **Redirect URLs**
- [ ] Teste de login funciona

### Testes
- [ ] Login com Google funciona em produção
- [ ] Criar curso funciona (Mentor)
- [ ] Upload de PDF funciona
- [ ] Chat com IA funciona (Aluno)
- [ ] Todas as funcionalidades testadas

---

## 🎯 Resumo Rápido

**O que você PRECISA fazer:**

1. ✅ **Adicionar variáveis de ambiente na Vercel** (3 variáveis)
2. ✅ **Adicionar URL de produção no Google Cloud** (OAuth)
3. ✅ **Adicionar URL de produção no Supabase** (Redirect URLs)
4. ✅ **Fazer redeploy na Vercel**
5. ✅ **Testar tudo em produção**

**O que é OPCIONAL:**

- Publicar OAuth consent screen (se quiser que qualquer pessoa faça login)
- Configurar domínio customizado

---

## 📚 Próximos Passos

Após configurar tudo:

1. **Monitorar logs** na Vercel
2. **Testar todas as funcionalidades** em produção
3. **Configurar domínio customizado** (se quiser)
4. **Configurar CI/CD** (se quiser deploy automático)

---

**Boa sorte com o deploy! 🚀**
