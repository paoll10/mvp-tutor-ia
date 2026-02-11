# 👨‍🏫 Guia Completo: Criar Mentor e Gerenciar Alunos

## 🎯 O que foi implementado

1. ✅ **Script SQL para criar usuário mentor**
2. ✅ **Página no dashboard do mentor para criar alunos**
3. ✅ **Funcionalidade para listar e deletar alunos**
4. ✅ **View SQL para mostrar emails dos alunos**

---

## 📋 Passo 1: Criar Usuário Mentor

### 1.1 Executar SQL no Supabase

1. Acesse: **https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz**
2. Vá em **SQL Editor** → **New query**
3. Abra o arquivo: `criar_mentor.sql`
4. Copie todo o conteúdo
5. Cole no SQL Editor
6. Clique em **"Run"** (ou `Ctrl+Enter`)

**OU** execute este SQL diretamente:

```sql
-- Criar usuário mentor
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'mentor@mentoria.com',
  crypt('Mentor123!@#', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"mentor","full_name":"Mentor Principal"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Criar profile do mentor
INSERT INTO mentoria.profiles (user_id, role, full_name)
SELECT 
  id as user_id,
  'mentor' as role,
  'Mentor Principal' as full_name
FROM auth.users
WHERE email = 'mentor@mentoria.com'
  AND id NOT IN (SELECT user_id FROM mentoria.profiles)
RETURNING *;
```

### 1.2 Credenciais do Mentor

Após executar o SQL:

- **Email**: `mentor@mentoria.com`
- **Senha**: `Mentor123!@#`

---

## 📋 Passo 2: Executar Migração da View (Opcional mas Recomendado)

Para ver os emails dos alunos na lista:

1. No **SQL Editor** do Supabase
2. Abra o arquivo: `migrations/013_view_students_with_email.sql`
3. Copie e execute no SQL Editor

Isso cria uma view que permite ver os emails dos alunos sem precisar de service_role.

---

## 📋 Passo 3: Desabilitar Confirmação de Email (Recomendado)

Para que os alunos criados pelo mentor possam fazer login imediatamente:

1. Acesse: **https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz**
2. Vá em **Authentication** → **Settings**
3. Em **"Email Provider"**, desmarque **"Confirm email"**
4. Clique em **"Save"**

---

## 📋 Passo 4: Fazer Login como Mentor

1. Acesse: **https://mvp-tutor-ia-78pi.vercel.app/login**
2. Digite:
   - **Email**: `mentor@mentoria.com`
   - **Senha**: `Mentor123!@#`
3. Clique em **"Entrar"**
4. Você será redirecionado para o dashboard do mentor

---

## 📋 Passo 5: Criar Alunos

### 5.1 Acessar Página de Alunos

1. No dashboard do mentor, clique em **"Alunos"** no menu lateral
2. Ou acesse diretamente: **https://mvp-tutor-ia-78pi.vercel.app/mentor/students**

### 5.2 Criar Novo Aluno

1. Clique no botão **"Criar Aluno"** (canto superior direito)
2. Preencha o formulário:
   - **Email**: Email do aluno (ex: `aluno1@exemplo.com`)
   - **Senha**: Senha do aluno (mínimo 6 caracteres)
   - **Nome Completo**: Nome do aluno (opcional)
3. Clique em **"Criar Aluno"**

### 5.3 O que acontece

- ✅ Usuário é criado no Supabase Auth
- ✅ Profile é criado automaticamente (via trigger ou manualmente)
- ✅ Aluno pode fazer login imediatamente (se confirmação de email estiver desabilitada)

---

## 📋 Passo 6: Gerenciar Alunos

### 6.1 Listar Alunos

Na página de alunos, você verá:
- Lista de todos os alunos cadastrados
- Email de cada aluno (se a view foi criada)
- Nome completo
- Data de cadastro

### 6.2 Deletar Aluno

1. Na lista de alunos, clique no ícone de **lixeira** ao lado do aluno
2. Confirme a exclusão
3. O profile do aluno será removido (o usuário permanece no auth)

---

## 🔧 Funcionalidades Implementadas

### Para o Mentor:

- ✅ **Criar alunos** com email e senha
- ✅ **Listar todos os alunos** cadastrados
- ✅ **Ver emails dos alunos** (se a view foi criada)
- ✅ **Deletar alunos** do sistema

### Para os Alunos:

- ✅ **Fazer login** com email e senha criados pelo mentor
- ✅ **Acessar cursos** usando código de convite
- ✅ **Usar o chat com IA** baseado no material do curso

---

## 📝 Exemplo de Uso

### Criar Aluno de Teste:

1. **Login como mentor**: `mentor@mentoria.com` / `Mentor123!@#`
2. **Ir em "Alunos"** no menu
3. **Criar aluno**:
   - Email: `aluno.teste@exemplo.com`
   - Senha: `Aluno123`
   - Nome: `Aluno Teste`
4. **Fazer login como aluno**:
   - Email: `aluno.teste@exemplo.com`
   - Senha: `Aluno123`

---

## 🆘 Problemas Comuns

### Erro: "Apenas mentores podem criar alunos"

**Causa**: O usuário logado não é mentor.

**Solução**: Certifique-se de estar logado como mentor (`mentor@mentoria.com`).

### Erro: "Este email já está cadastrado"

**Causa**: O email já existe no sistema.

**Solução**: Use outro email ou delete o aluno existente.

### Aluno não consegue fazer login

**Causa**: Pode ser que o email não foi confirmado.

**Solução**: 
1. Desabilite confirmação de email no Supabase (Settings → Auth → Email Provider)
2. Ou confirme o email manualmente no Supabase Dashboard

---

## ✅ Checklist

- [ ] SQL do mentor executado no Supabase
- [ ] Migração da view executada (opcional)
- [ ] Confirmação de email desabilitada (recomendado)
- [ ] Login como mentor funcionando
- [ ] Página de alunos acessível
- [ ] Criar aluno funcionando
- [ ] Listar alunos funcionando
- [ ] Deletar aluno funcionando

---

**Pronto! Agora você pode criar e gerenciar alunos facilmente pelo dashboard do mentor!** 🚀
