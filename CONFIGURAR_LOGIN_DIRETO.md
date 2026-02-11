# ✅ Configurar Login Direto para Mentor/Aluno

## 🎯 O que foi implementado

Agora quando você faz login:
- ✅ **Mentor** → Vai direto para `/mentor/dashboard`
- ✅ **Aluno** → Vai direto para `/student/dashboard`
- ✅ **Sem profile** → Vai para `/onboarding` para criar o profile

---

## 📋 Passo 1: Criar Schema e Tabelas (OBRIGATÓRIO)

Execute este SQL no Supabase:

1. **Acesse**: https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz
2. **Vá em**: SQL Editor → New query
3. **Abra o arquivo**: `criar_trigger_automatico.sql`
4. **Copie TODO o conteúdo** e execute

Isso cria:
- ✅ Schema `mentoria`
- ✅ Tabela `profiles`
- ✅ Trigger automático para criar profiles

---

## 📋 Passo 2: Criar Perfil do Mentor

Execute este SQL no Supabase:

1. **SQL Editor** → New query
2. **Abra o arquivo**: `criar_mentor.sql`
3. **Copie TODO o conteúdo** e execute

Isso cria:
- ✅ Usuário mentor: `mentor@mentoria.com` / `Mentor123!@#`
- ✅ Profile do mentor

---

## 📋 Passo 3: Criar Perfil de Aluno (Opcional)

Se você já tem um usuário aluno criado, crie o profile:

1. **SQL Editor** → New query
2. Execute este SQL (substitua `EMAIL_DO_ALUNO` pelo email):

```sql
-- Criar profile para aluno existente
INSERT INTO mentoria.profiles (user_id, role, full_name)
SELECT 
  id as user_id,
  'aluno' as role,
  split_part(email, '@', 1) as full_name
FROM auth.users
WHERE email = 'EMAIL_DO_ALUNO'
  AND id NOT IN (SELECT user_id FROM mentoria.profiles)
ON CONFLICT (user_id) DO NOTHING;
```

---

## ✅ Testar

1. **Login como Mentor**:
   - Email: `mentor@mentoria.com`
   - Senha: `Mentor123!@#`
   - **Resultado**: Deve ir direto para `/mentor/dashboard`

2. **Login como Aluno**:
   - Use as credenciais do aluno
   - **Resultado**: Deve ir direto para `/student/dashboard`

---

## 🆘 Se Ainda Der Erro "Invalid schema: mentoria"

Execute novamente o SQL `criar_trigger_automatico.sql` no Supabase.

---

**Pronto! Agora o login redireciona direto para a área correta!** 🚀
