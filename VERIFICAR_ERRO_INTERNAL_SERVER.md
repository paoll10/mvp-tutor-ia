# 🔧 Resolver: Internal Server Error

## 🔍 Passo 1: Verificar Logs da Vercel

1. **Acesse**: https://vercel.com/dashboard
2. **Selecione o projeto**: `mvp-tutor-ia`
3. **Vá em**: "Deployments" → clique no último deploy
4. **Vá em**: "Functions" → veja os logs de erro
5. **Copie a mensagem de erro completa**

---

## 🔍 Passo 2: Verificar Variáveis de Ambiente na Vercel

1. **Acesse**: https://vercel.com/dashboard
2. **Selecione o projeto**: `mvp-tutor-ia`
3. **Vá em**: "Settings" → "Environment Variables"
4. **Verifique se existem**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`

**Se não existirem, adicione:**
- `NEXT_PUBLIC_SUPABASE_URL`: `https://yltnhioftdhfjugcibvz.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsdG5oaW9mdGRoZmp1Z2NpYnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTQxNzUsImV4cCI6MjA4NTYzMDE3NX0.fI-eQU3Y3mJBqHgrQ2hkS1t9LtkzT7NfJjmV-tIiH8U`
- `GEMINI_API_KEY`: `AIzaSyBGV6P_MGb3-4iF8gRDfNB3OYWFQx8zUO8`

**Após adicionar, faça um novo deploy!**

---

## 🔍 Passo 3: Verificar se o Schema Existe no Supabase

Execute este SQL no Supabase:

```sql
-- Verificar se o schema existe
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'mentoria';
```

**Se não retornar nada, execute:**
1. Abra: `criar_trigger_automatico.sql`
2. Copie e execute no Supabase SQL Editor

---

## 🔍 Passo 4: Verificar Políticas RLS

Execute este SQL:

```sql
-- Verificar políticas RLS
SELECT * FROM pg_policies 
WHERE tablename = 'profiles' 
AND schemaname = 'mentoria';
```

**Se não houver políticas, execute:**
1. Abra: `migrations/008_rls_policies.sql`
2. Copie e execute no Supabase SQL Editor

---

## ✅ Solução Rápida: Re-deploy

Após verificar tudo acima:

1. **Vercel Dashboard** → "Deployments"
2. Clique nos **3 pontos** no último deploy
3. Clique em **"Redeploy"**
4. Aguarde o deploy concluir

---

## 📋 Checklist

- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Schema `mentoria` existe no Supabase
- [ ] Tabela `profiles` existe
- [ ] Políticas RLS estão ativas
- [ ] Logs da Vercel verificados
- [ ] Re-deploy feito

---

**Me envie a mensagem de erro dos logs da Vercel para eu ajudar melhor!** 🔍
