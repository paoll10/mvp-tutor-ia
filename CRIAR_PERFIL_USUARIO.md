# 👤 Criar Perfil para Usuário Existente

O usuário foi criado no Supabase Auth, mas não tem perfil na tabela `mentoria.profiles`. Vamos criar o perfil agora.

---

## 🚀 Solução Rápida: Criar Perfil via SQL

### Passo 1: Obter o User ID

1. **Acesse o Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz

2. **Vá em Authentication → Users**
   - No menu lateral, clique em **"Authentication"**
   - Depois clique em **"Users"**

3. **Encontrar o Usuário**
   - Procure pelo email: `teste.mentoria@gmail.com`
   - **Copie o User ID** (UUID que aparece na coluna "UUID")

### Passo 2: Criar o Perfil via SQL

1. **Acesse o SQL Editor**
   - No menu lateral, clique em **"SQL Editor"**
   - Clique em **"New query"**

2. **Execute este SQL** (substitua `USER_ID_AQUI` pelo UUID copiado):

```sql
-- Criar perfil para o usuário
INSERT INTO mentoria.profiles (user_id, role, full_name)
VALUES (
  'USER_ID_AQUI',  -- Cole o UUID do usuário aqui
  'aluno',         -- ou 'mentor' se quiser criar como mentor
  'Teste Mentoria' -- Nome do usuário (opcional)
);
```

**Exemplo completo:**

```sql
INSERT INTO mentoria.profiles (user_id, role, full_name)
VALUES (
  '123e4567-e89b-12d3-a456-426614174000',  -- UUID do usuário
  'aluno',
  'Teste Mentoria'
);
```

3. **Clique em "Run"** (ou `Ctrl+Enter`)

4. ✅ **Deve aparecer**: "Success. 1 row inserted"

---

## 🎯 Criar Perfil como Mentor

Se quiser criar como **Mentor**, use:

```sql
INSERT INTO mentoria.profiles (user_id, role, full_name)
VALUES (
  'USER_ID_AQUI',  -- Cole o UUID do usuário aqui
  'mentor',        -- Role como mentor
  'Teste Mentoria'
);
```

---

## ✅ Verificar se Funcionou

1. **Acesse**: http://localhost:3000/login
2. **Faça login** com:
   - Email: `teste.mentoria@gmail.com`
   - Senha: `Teste123!@#`
3. **Você será redirecionado** para:
   - `/student/dashboard` (se criou como aluno)
   - `/mentor/dashboard` (se criou como mentor)

---

## 🔄 Criar Perfil para Múltiplos Usuários

Se você tem vários usuários e quer criar perfis para todos:

```sql
-- Cria perfis para todos os usuários que ainda não têm perfil
INSERT INTO mentoria.profiles (user_id, role, full_name)
SELECT 
  id as user_id,
  'aluno' as role,  -- ou 'mentor'
  split_part(email, '@', 1) as full_name
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM mentoria.profiles);
```

---

## 🆘 Problemas Comuns

### Erro: "duplicate key value violates unique constraint"
- **Causa**: O perfil já existe
- **Solução**: Verifique na tabela `mentoria.profiles` se o usuário já tem perfil

### Erro: "permission denied"
- **Causa**: Permissões RLS bloqueando
- **Solução**: Execute o SQL como superuser ou desabilite temporariamente o RLS

### Erro: "violates foreign key constraint"
- **Causa**: O user_id não existe na tabela `auth.users`
- **Solução**: Verifique se o UUID está correto

---

**Boa sorte! 🚀**
