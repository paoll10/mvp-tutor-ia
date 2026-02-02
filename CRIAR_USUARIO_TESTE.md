# 👤 Criar Usuário de Teste - MentorIA

## 📋 Credenciais de Teste

Use estas credenciais para fazer login no sistema:

```
Email: teste.mentoria@gmail.com
Senha: Teste123!@#
```

---

## 🚀 Como Criar o Usuário

### Opção 1: Criar pelo Supabase Dashboard (Recomendado)

1. **Acesse o Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz
   - Faça login se necessário

2. **Vá em Authentication → Users**
   - No menu lateral, clique em **"Authentication"**
   - Depois clique em **"Users"**

3. **Criar Novo Usuário**
   - Clique no botão **"Add user"** (canto superior direito)
   - Selecione **"Create new user"**

4. **Preencher Dados**
   - **Email**: `teste.mentoria@gmail.com`
   - **Password**: `Teste123!@#`
   - ⚠️ **IMPORTANTE**: Marque a opção **"Auto Confirm User"** (para não precisar confirmar email)
   - Deixe os outros campos como estão

5. **Criar**
   - Clique em **"Create user"**
   - ✅ Pronto! O usuário foi criado

---

### Opção 2: Criar pela Interface do Projeto

1. **Acesse a página de login**
   - URL: http://localhost:3000/login

2. **Criar Conta**
   - Clique em **"Criar uma conta"** (ou alterne para modo de cadastro)
   - Preencha:
     - **Email**: `teste.mentoria@gmail.com`
     - **Senha**: `Teste123!@#`
     - **Perfil**: Escolha "Aluno" ou "Mentor"
   - Clique em **"Cadastrar"**

3. **Confirmar Email** (se necessário)
   - Verifique o email enviado pelo Supabase
   - Clique no link de confirmação

---

## ⚙️ Desabilitar Confirmação de Email (Desenvolvimento)

Para não precisar confirmar email a cada cadastro:

1. **Acesse o Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz

2. **Vá em Authentication → Settings**
   - No menu lateral, clique em **"Authentication"**
   - Depois clique em **"Settings"**

3. **Desabilitar Confirmação**
   - Role até a seção **"Auth Providers"**
   - Clique em **"Email"**
   - Desmarque a opção **"Confirm email"**
   - Clique em **"Save"**

Agora todos os novos usuários serão confirmados automaticamente!

---

## ✅ Testar o Login

Após criar o usuário:

1. Acesse: http://localhost:3000/login
2. Preencha:
   - **Email**: `teste.mentoria@gmail.com`
   - **Senha**: `Teste123!@#`
3. Clique em **"Entrar"**
4. Você será redirecionado para o onboarding
5. Escolha se é **Mentor** ou **Aluno**

---

## 🔐 Outras Credenciais de Teste

Se quiser criar mais usuários de teste, use este padrão:

```
Email: teste1.mentoria@gmail.com
Senha: Teste123!@#

Email: teste2.mentoria@gmail.com
Senha: Teste123!@#
```

Ou use qualquer email válido que você tenha acesso.

---

**Boa sorte! 🚀**
