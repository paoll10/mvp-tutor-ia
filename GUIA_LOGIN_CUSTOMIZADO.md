# 🔐 Sistema de Login Customizado - Tabela do Supabase

## 🎯 O que foi implementado

Sistema de login usando tabela customizada do Supabase, sem depender do Supabase Auth:

1. ✅ **Tabela `mentoria.users`** para armazenar usuários
2. ✅ **Funções SQL** para hash e verificação de senha
3. ✅ **Login direto** para mentor ou aluno
4. ✅ **Sem onboarding** - vai direto para o dashboard correto

---

## 📋 Passo 1: Criar Tabela e Funções

Execute estes SQLs no Supabase **NA ORDEM**:

### 1.1 Criar Tabela de Usuários

1. **SQL Editor** → **New query**
2. Abra: `migrations/014_create_users_table.sql`
3. Copie e execute TODO o conteúdo

### 1.2 Criar Funções de Hash

1. **SQL Editor** → **New query**
2. Abra: `migrations/015_hash_password_function.sql`
3. Copie e execute TODO o conteúdo

---

## 📋 Passo 2: Criar Usuários Iniciais

1. **SQL Editor** → **New query**
2. Abra: `criar_usuarios_iniciais.sql`
3. Copie e execute TODO o conteúdo

Isso cria:
- ✅ **Mentor**: `mentor@mentoria.com` / `Mentor123!@#`
- ✅ **Aluno**: `aluno@mentoria.com` / `Aluno123!@#`

---

## 📋 Passo 3: Testar Login

1. **Aguarde o deploy** na Vercel (alguns minutos)
2. **Acesse**: https://mvp-tutor-ia-78pi.vercel.app/login
3. **Teste como Mentor**:
   - Selecione "Mentor"
   - Email: `mentor@mentoria.com`
   - Senha: `Mentor123!@#`
   - **Resultado**: Deve ir direto para `/mentor/dashboard`

4. **Teste como Aluno**:
   - Selecione "Aluno"
   - Email: `aluno@mentoria.com`
   - Senha: `Aluno123!@#`
   - **Resultado**: Deve ir direto para `/student/dashboard`

---

## 🔧 Como Funciona

1. **Login**: Verifica email e senha na tabela `mentoria.users`
2. **Verificação**: Usa função SQL `verify_password` para verificar senha
3. **Sessão**: Cria cookies customizados com user_id e role
4. **Redirecionamento**: Vai direto para o dashboard correto

---

## ✅ Credenciais de Teste

### Mentor:
- **Email**: `mentor@mentoria.com`
- **Senha**: `Mentor123!@#`
- **Dashboard**: `/mentor/dashboard`

### Aluno:
- **Email**: `aluno@mentoria.com`
- **Senha**: `Aluno123!@#`
- **Dashboard**: `/student/dashboard`

---

## 🆘 Se Algo Não Funcionar

### Erro: "function hash_password does not exist"

**Solução**: Execute o SQL `migrations/015_hash_password_function.sql`

### Erro: "relation mentoria.users does not exist"

**Solução**: Execute o SQL `migrations/014_create_users_table.sql`

### Login não funciona

**Solução**: Verifique se os usuários foram criados:
```sql
SELECT email, role FROM mentoria.users;
```

---

**Pronto! Agora você tem login customizado funcionando!** 🚀
