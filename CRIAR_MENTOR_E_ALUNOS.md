# 👨‍🏫 Criar Mentor e Gerenciar Alunos

## 🎯 O que foi implementado

1. ✅ **Script SQL para criar usuário mentor**
2. ✅ **Página no dashboard do mentor para criar alunos**
3. ✅ **Funcionalidade para listar e deletar alunos**

---

## 📋 Passo 1: Criar Usuário Mentor

### 1.1 Executar SQL no Supabase

1. Acesse: **https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz**
2. Vá em **SQL Editor** → **New query**
3. Abra o arquivo: `criar_mentor.sql`
4. Copie todo o conteúdo
5. Cole no SQL Editor
6. Clique em **"Run"** (ou `Ctrl+Enter`)

### 1.2 Credenciais do Mentor

Após executar o SQL, você terá:

- **Email**: `mentor@mentoria.com`
- **Senha**: `Mentor123!@#`

---

## 📋 Passo 2: Fazer Login como Mentor

1. Acesse: **https://mvp-tutor-ia-78pi.vercel.app/login**
2. Digite:
   - **Email**: `mentor@mentoria.com`
   - **Senha**: `Mentor123!@#`
3. Clique em **"Entrar"**
4. Você será redirecionado para o dashboard do mentor

---

## 📋 Passo 3: Criar Alunos

### 3.1 Acessar Página de Alunos

1. No dashboard do mentor, clique em **"Alunos"** no menu lateral
2. Ou acesse diretamente: **https://mvp-tutor-ia-78pi.vercel.app/mentor/students**

### 3.2 Criar Novo Aluno

1. Clique no botão **"Criar Aluno"** (canto superior direito)
2. Preencha o formulário:
   - **Email**: Email do aluno (ex: `aluno1@exemplo.com`)
   - **Senha**: Senha do aluno (mínimo 6 caracteres)
   - **Nome Completo**: Nome do aluno (opcional)
3. Clique em **"Criar Aluno"**

### 3.3 O que acontece

- ✅ Usuário é criado no Supabase Auth
- ✅ Profile é criado automaticamente
- ✅ Email é confirmado automaticamente (sem precisar verificar)
- ✅ Aluno pode fazer login imediatamente

---

## 📋 Passo 4: Gerenciar Alunos

### 4.1 Listar Alunos

Na página de alunos, você verá:
- Lista de todos os alunos cadastrados
- Email de cada aluno
- Nome completo
- Data de cadastro

### 4.2 Deletar Aluno

1. Na lista de alunos, clique no ícone de **lixeira** ao lado do aluno
2. Confirme a exclusão
3. O aluno será removido do sistema

---

## 🔧 Funcionalidades Implementadas

### Para o Mentor:

- ✅ **Criar alunos** com email e senha
- ✅ **Listar todos os alunos** cadastrados
- ✅ **Deletar alunos** do sistema
- ✅ **Ver informações** dos alunos (nome, email, data de cadastro)

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

**Solução**: O sistema confirma automaticamente, mas se não funcionar, verifique no Supabase Dashboard → Authentication → Users.

---

## ✅ Checklist

- [ ] SQL do mentor executado no Supabase
- [ ] Login como mentor funcionando
- [ ] Página de alunos acessível
- [ ] Criar aluno funcionando
- [ ] Listar alunos funcionando
- [ ] Deletar aluno funcionando

---

**Pronto! Agora você pode criar e gerenciar alunos facilmente pelo dashboard do mentor!** 🚀
