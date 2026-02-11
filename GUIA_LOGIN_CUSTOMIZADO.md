# 🔐 Sistema de Login Customizado - Tabela do Supabase

## 🎯 O que foi criado

Sistema de login que usa uma tabela customizada no Supabase em vez do Supabase Auth:
- ✅ Tabela `mentoria.users` para armazenar usuários
- ✅ Login direto por email/senha
- ✅ Senhas criptografadas com bcrypt
- ✅ Redirecionamento direto: Mentor → `/mentor/dashboard`, Aluno → `/student/dashboard`
- ✅ Sem onboarding

---

## 📋 Passo 1: Criar Tabela de Usuários

Execute este SQL no Supabase:

1. **Acesse**: https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz
2. **Vá em**: SQL Editor → New query
3. **Abra o arquivo**: `migrations/014_create_users_table.sql`
4. **Copie TODO o conteúdo** e execute

Isso cria a tabela `mentoria.users`.

---

## 📋 Passo 2: Gerar Hashes de Senha

### Opção 1: Usar o Script Node.js

1. **No terminal**, execute:

```bash
# Gerar hash para senha do mentor
node scripts/generate-password-hash.js "Mentor123!@#"

# Gerar hash para senha do aluno
node scripts/generate-password-hash.js "Aluno123!@#"
```

2. **Copie os hashes gerados** (serão strings longas começando com `$2a$10$...`)

### Opção 2: Usar Online (temporário para teste)

Use um gerador de bcrypt online:
- https://bcrypt-generator.com/
- Senha: `Mentor123!@#` → copie o hash
- Senha: `Aluno123!@#` → copie o hash

---

## 📋 Passo 3: Criar Usuários no Supabase

1. **SQL Editor** → New query
2. **Abra o arquivo**: `criar_usuarios_login_custom.sql`
3. **Substitua** `SUBSTITUA_PELO_HASH_DO_MENTOR` pelo hash gerado para o mentor
4. **Substitua** `SUBSTITUA_PELO_HASH_DO_ALUNO` pelo hash gerado para o aluno
5. **Execute o SQL**

**OU** execute este SQL diretamente (substitua os hashes):

```sql
-- Criar usuário mentor
INSERT INTO mentoria.users (email, password_hash, role, full_name)
VALUES (
  'mentor@mentoria.com',
  'HASH_DO_MENTOR_AQUI', -- Cole o hash gerado
  'mentor',
  'Mentor Principal'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash;

-- Criar usuário aluno
INSERT INTO mentoria.users (email, password_hash, role, full_name)
VALUES (
  'aluno@mentoria.com',
  'HASH_DO_ALUNO_AQUI', -- Cole o hash gerado
  'aluno',
  'Aluno Teste'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash;
```

---

## 📋 Passo 4: Testar o Login

1. **Aguarde o deploy** na Vercel (alguns minutos)
2. **Acesse**: https://mvp-tutor-ia-78pi.vercel.app/login
3. **Login como Mentor**:
   - Email: `mentor@mentoria.com`
   - Senha: `Mentor123!@#`
   - **Resultado**: Deve ir direto para `/mentor/dashboard`

4. **Login como Aluno**:
   - Email: `aluno@mentoria.com`
   - Senha: `Aluno123!@#`
   - **Resultado**: Deve ir direto para `/student/dashboard`

---

## 🔧 Como Funciona

1. **Login**: Verifica email/senha na tabela `mentoria.users`
2. **Verificação**: Compara senha com hash usando bcrypt
3. **Sessão**: Cria cookie com dados do usuário
4. **Redirecionamento**: Vai direto para o dashboard correto

---

## ✅ Credenciais Padrão

### Mentor:
- **Email**: `mentor@mentoria.com`
- **Senha**: `Mentor123!@#`

### Aluno:
- **Email**: `aluno@mentoria.com`
- **Senha**: `Aluno123!@#`

---

## 🆘 Problemas Comuns

### Erro: "Email ou senha incorretos"

**Causa**: Hash da senha não está correto.

**Solução**: 
1. Gere o hash novamente usando o script
2. Atualize o hash no SQL
3. Execute o SQL novamente

### Erro: "relation mentoria.users does not exist"

**Causa**: Tabela não foi criada.

**Solução**: Execute o SQL `migrations/014_create_users_table.sql`.

---

## 📝 Criar Novos Usuários

Para criar novos usuários:

1. **Gere o hash da senha**:
```bash
node scripts/generate-password-hash.js "SenhaDoUsuario"
```

2. **Execute este SQL** (substitua os valores):
```sql
INSERT INTO mentoria.users (email, password_hash, role, full_name)
VALUES (
  'email@exemplo.com',
  'HASH_GERADO_AQUI',
  'mentor', -- ou 'aluno'
  'Nome do Usuário'
);
```

---

**Pronto! Agora você tem um sistema de login customizado usando tabela do Supabase!** 🚀
