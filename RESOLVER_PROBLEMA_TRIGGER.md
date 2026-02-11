# 🔧 Resolver: Trigger Não Está Funcionando

## 🔍 Passo 1: Diagnosticar o Problema

Execute este SQL no Supabase para verificar o que está acontecendo:

```sql
-- Verificar se o trigger existe
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Verificar usuários sem perfil
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'role' as role_metadata,
  u.created_at
FROM auth.users u
LEFT JOIN mentoria.profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL
ORDER BY u.created_at DESC
LIMIT 5;
```

---

## ✅ Solução Rápida: Criar Perfil Manualmente

Se o trigger não está funcionando, crie o perfil manualmente:

### Passo 1: Obter o User ID

1. Acesse: **https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz**
2. Vá em **Authentication** → **Users**
3. Encontre o usuário: `teste@exemplo.com`
4. **Copie o User ID** (UUID)

### Passo 2: Criar Perfil via SQL

1. Vá em **SQL Editor** → **New query**
2. Execute este SQL (substitua `USER_ID_AQUI` pelo UUID copiado):

```sql
-- Criar perfil manualmente
INSERT INTO mentoria.profiles (user_id, role, full_name)
VALUES (
  'USER_ID_AQUI',  -- Cole o UUID do usuário aqui
  'aluno',         -- ou 'mentor' se for mentor
  'teste'          -- Nome do usuário
)
ON CONFLICT (user_id) DO NOTHING;
```

---

## 🔧 Solução Definitiva: Recriar o Trigger

Se o trigger não existe ou não está funcionando, execute novamente:

1. **SQL Editor** → **New query**
2. Abra: `criar_trigger_automatico.sql`
3. Copie e execute TODO o conteúdo

---

## 🆘 Verificar Erros Comuns

### Erro: "permission denied"

**Causa**: Políticas RLS bloqueando.

**Solução**: Execute este SQL para verificar as políticas:

```sql
-- Verificar políticas RLS
SELECT * FROM pg_policies 
WHERE tablename = 'profiles' 
AND schemaname = 'mentoria';
```

Se não houver política de INSERT, execute a migração `008_rls_policies.sql`.

### Erro: "schema mentoria does not exist"

**Causa**: Schema não foi criado.

**Solução**: Execute novamente o SQL `criar_trigger_automatico.sql` (a primeira parte cria o schema).

### Trigger não executa

**Causa**: Trigger pode não estar ativo ou função com erro.

**Solução**: 

1. Verifique se a função existe:
```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'mentoria'
  AND routine_name = 'handle_new_user';
```

2. Se não existir, execute novamente o SQL `criar_trigger_automatico.sql`.

---

## 📋 Checklist de Verificação

- [ ] Schema `mentoria` existe
- [ ] Tabela `profiles` existe
- [ ] Função `handle_new_user` existe
- [ ] Trigger `on_auth_user_created` existe
- [ ] Políticas RLS estão ativas
- [ ] Perfil foi criado manualmente (se necessário)

---

**Execute o diagnóstico e me diga o que encontrou!** 🔍
