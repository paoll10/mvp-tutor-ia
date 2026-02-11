# 🔧 Resolver: "Erro ao criar perfil"

## ⚠️ Erro no Onboarding

Ao tentar criar o perfil no onboarding, aparece: **"Erro ao criar perfil. Tente novamente."**

---

## 🔍 Possíveis Causas

### 1. **Políticas RLS Bloqueando**

As políticas RLS podem estar bloqueando a inserção.

**Solução:** Verificar se a política `profiles_insert_own` está ativa:

```sql
-- Verificar políticas RLS
SELECT * FROM pg_policies 
WHERE tablename = 'profiles' 
AND schemaname = 'mentoria';
```

### 2. **Trigger Não Executado**

O trigger pode não ter sido criado ou não está funcionando.

**Solução:** Executar a migração do trigger:

1. Acesse: **https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz**
2. Vá em **SQL Editor** → **New query**
3. Abra o arquivo: `migrations/012_auto_create_profile_trigger.sql`
4. Copie e execute

### 3. **Usuário Já Tem Perfil**

O usuário pode já ter um perfil criado.

**Solução:** Verificar se já existe perfil:

```sql
-- Verificar se o usuário já tem perfil
SELECT * FROM mentoria.profiles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'mentor@mentoria.com');
```

---

## ✅ Solução Rápida: Criar Perfil Manualmente

Se o erro persistir, crie o perfil manualmente:

### Passo 1: Obter User ID

1. Acesse: **https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz**
2. Vá em **Authentication** → **Users**
3. Encontre o usuário (email: `mentor@mentoria.com`)
4. **Copie o User ID** (UUID)

### Passo 2: Criar Perfil via SQL

1. Vá em **SQL Editor** → **New query**
2. Execute este SQL (substitua `USER_ID_AQUI` pelo UUID copiado):

```sql
-- Criar perfil do mentor
INSERT INTO mentoria.profiles (user_id, role, full_name)
VALUES (
  'USER_ID_AQUI',  -- Cole o UUID do usuário aqui
  'mentor',        -- ou 'aluno' se for aluno
  'Mentor Principal'
)
ON CONFLICT (user_id) DO NOTHING;
```

### Passo 3: Testar

1. Faça logout
2. Faça login novamente: `mentor@mentoria.com` / `Mentor123!@#`
3. Você deve ser redirecionado diretamente para o dashboard (sem onboarding)

---

## 🔧 Verificar Políticas RLS

Se as políticas RLS estiverem bloqueando:

1. Acesse: **https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz**
2. Vá em **Authentication** → **Policies**
3. Verifique se a política `profiles_insert_own` está ativa
4. Se não estiver, execute a migração `008_rls_policies.sql`

---

## 📋 Checklist

- [ ] Políticas RLS verificadas
- [ ] Trigger executado (migração 012)
- [ ] Perfil criado manualmente (se necessário)
- [ ] Login testado novamente

---

**Após criar o perfil manualmente, você não precisará mais do onboarding!** 🚀
