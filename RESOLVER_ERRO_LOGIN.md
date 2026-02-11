# 🔧 Resolver Erro de Login

## ⚠️ Se está dando erro ao fazer login, siga estes passos:

### 1️⃣ Verificar se a tabela existe

Execute no **Supabase SQL Editor**:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'mentoria' 
  AND table_name = 'users';
```

**Se não retornar nada**, execute o arquivo: `atualizar_tabela_users.sql`

---

### 2️⃣ Verificar se os usuários existem

Execute no **Supabase SQL Editor**:

```sql
SELECT 
  email,
  role,
  CASE 
    WHEN password_hash IS NULL THEN '❌ SEM SENHA'
    WHEN password_hash = '' THEN '❌ SENHA VAZIA'
    WHEN length(password_hash) < 20 THEN '❌ HASH INVÁLIDO'
    ELSE '✅ OK'
  END as status
FROM mentoria.users
WHERE email IN ('mentor@mentoria.com', 'aluno@mentoria.com');
```

**Se não retornar nada**, execute o arquivo: `criar_login_simples.sql`

---

### 3️⃣ Criar tudo de uma vez (RECOMENDADO)

Execute estes SQLs **na ordem** no Supabase SQL Editor:

1. **Primeiro**: Copie e execute TODO o conteúdo de `atualizar_tabela_users.sql`
2. **Depois**: Copie e execute TODO o conteúdo de `criar_login_simples.sql`

---

### 4️⃣ Verificar os logs

Após fazer login, verifique os logs no **Vercel Dashboard**:
1. Acesse: https://vercel.com/dashboard
2. Vá em: Seu projeto → Deployments → Latest → Functions
3. Procure por logs que começam com `🔍 TENTATIVA DE LOGIN`

Os logs vão mostrar exatamente onde está o problema!

---

## 📋 Mensagens de Erro Comuns

| Mensagem | Solução |
|----------|---------|
| "Tabela não encontrada" | Execute `atualizar_tabela_users.sql` |
| "Schema não encontrado" | Execute `atualizar_tabela_users.sql` |
| "Senha não configurada" | Execute `criar_login_simples.sql` |
| "Hash de senha inválido" | Execute `criar_login_simples.sql` |
| "Email ou senha incorretos" | Verifique se executou `criar_login_simples.sql` |

---

## ✅ Credenciais de Teste

### Mentor:
- **Email**: `mentor@mentoria.com`
- **Senha**: `Mentor123!@#`

### Aluno:
- **Email**: `aluno@mentoria.com`
- **Senha**: `Aluno123!@#`

---

## 🆘 Ainda com erro?

1. Verifique os logs no Vercel (veja passo 4 acima)
2. Execute o SQL `verificar_login.sql` para diagnosticar
3. Certifique-se de que executou os SQLs na ordem correta
