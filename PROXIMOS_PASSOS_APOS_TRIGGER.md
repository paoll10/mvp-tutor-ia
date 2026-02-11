# ✅ Próximos Passos Após Executar o Trigger

## 🎉 O que foi configurado

Após executar o SQL `criar_trigger_automatico.sql`, você tem:

1. ✅ Schema `mentoria` criado
2. ✅ Tabela `profiles` criada
3. ✅ Trigger automático ativo
4. ✅ Função que converte `'student'` para `'aluno'` automaticamente

---

## 📋 Próximos Passos

### 1. Verificar se o Trigger Funcionou

Execute este SQL no Supabase para verificar:

```sql
-- Verificar se o trigger foi criado
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**Resultado esperado**: Deve retornar 1 linha com o trigger.

---

### 2. Verificar Usuários Existentes

Execute este SQL para ver se os perfis foram criados:

```sql
-- Ver todos os perfis criados
SELECT 
  p.user_id,
  p.role,
  p.full_name,
  u.email
FROM mentoria.profiles p
JOIN auth.users u ON u.id = p.user_id
ORDER BY p.created_at DESC;
```

**Resultado esperado**: Deve mostrar todos os usuários com seus perfis.

---

### 3. Testar Criando um Novo Usuário

1. **Acesse**: https://mvp-tutor-ia-78pi.vercel.app/login
2. **Clique em**: "Criar uma conta"
3. **Preencha**:
   - Email: `teste@exemplo.com`
   - Senha: `Teste123`
   - Role: Escolha "Aluno" ou "Mentor"
4. **Clique em**: "Cadastrar"

**O que deve acontecer**:
- ✅ Usuário criado no Supabase Auth
- ✅ Profile criado automaticamente pelo trigger
- ✅ Redirecionamento para o dashboard correto

---

### 4. Verificar se o Profile Foi Criado Automaticamente

Após criar o usuário, execute este SQL:

```sql
-- Verificar o último usuário criado
SELECT 
  u.email,
  u.raw_user_meta_data->>'role' as role_metadata,
  p.role as role_profile,
  p.full_name
FROM auth.users u
LEFT JOIN mentoria.profiles p ON u.id = p.user_id
WHERE u.email = 'teste@exemplo.com';
```

**Resultado esperado**: Deve mostrar o usuário com o profile criado automaticamente.

---

## 🔧 Se Algo Não Funcionar

### Problema: Trigger não criou o profile

**Solução**: Crie manualmente via SQL:

```sql
-- Criar profile manualmente (substitua USER_ID pelo ID do usuário)
INSERT INTO mentoria.profiles (user_id, role, full_name)
VALUES (
  'USER_ID_AQUI',  -- Cole o UUID do usuário
  'aluno',         -- ou 'mentor'
  'Nome do Usuário'
)
ON CONFLICT (user_id) DO NOTHING;
```

### Problema: Erro "Invalid schema: mentoria"

**Solução**: Execute novamente o SQL `criar_trigger_automatico.sql` (a primeira parte cria o schema).

### Problema: Erro "violates check constraint"

**Solução**: O trigger já está configurado para converter `'student'` para `'aluno'`. Se ainda der erro, verifique se executou o SQL completo.

---

## ✅ Checklist Final

- [ ] Trigger criado e ativo
- [ ] Perfis de usuários existentes criados
- [ ] Teste de criação de novo usuário funcionando
- [ ] Profile criado automaticamente pelo trigger
- [ ] Redirecionamento funcionando corretamente

---

## 🚀 Próximo: Criar Usuário Mentor

Agora que o trigger está funcionando, você pode:

1. **Criar usuário mentor** usando o SQL `criar_mentor.sql`
2. **Fazer login** como mentor
3. **Criar alunos** pelo dashboard do mentor

---

**Tudo funcionando? Me avise e seguimos para os próximos passos!** 🎉
