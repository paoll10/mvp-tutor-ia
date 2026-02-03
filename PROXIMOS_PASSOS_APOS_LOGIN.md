# 🚀 Próximos Passos Após Configurar Login com Google

Agora que você configurou o login com Google, vamos testar e usar todas as funcionalidades do sistema!

---

## ✅ O que já está configurado

- ✅ Supabase configurado
- ✅ Migrações executadas
- ✅ Gemini API Key configurada
- ✅ Google OAuth configurado
- ✅ Servidor rodando (`npm run dev`)

---

## 🎯 Passo 1: Testar o Login com Google

### 1.1 Fazer Login

1. **Acesse**: http://localhost:3000/login
2. **Clique no botão "Google"**
3. **Selecione sua conta Google** (ou faça login)
4. **Autorize o acesso**
5. A janela popup fechará automaticamente

### 1.2 Onboarding (Primeira Vez)

Se for seu primeiro login, você será redirecionado para o **Onboarding**:

1. **Escolha seu perfil**:
   - **Mentor/Professor**: Para criar cursos e enviar materiais
   - **Aluno**: Para entrar em cursos e usar o chat com IA

2. **Clique em "Continuar"**

3. Você será redirecionado para o dashboard correspondente

---

## 🎓 Passo 2: Se Você Escolheu "Mentor"

### 2.1 Dashboard do Mentor

Após o onboarding, você verá o **Dashboard do Mentor** em `/mentor/dashboard`

**O que você pode fazer:**
- Ver todos os seus cursos
- Criar novos cursos
- Gerenciar cursos existentes

### 2.2 Criar Seu Primeiro Curso

1. **Clique em "Criar Novo Curso"** (botão no topo ou card vazio)

2. **Preencha os dados do curso**:
   - **Nome do curso**: Ex: "Introdução ao JavaScript"
   - **Descrição**: Ex: "Curso básico de programação JavaScript"
   - Clique em **"Continuar"**

3. **Adicionar Materiais (PDFs)**:
   - Arraste PDFs para a área de upload
   - Ou clique para selecionar arquivos
   - Aguarde o processamento (status: Processing → Ready)
   - ⚠️ **IMPORTANTE**: Aguarde todos os materiais ficarem "Ready" antes de continuar

4. **Finalizar Curso**:
   - Clique em **"Finalizar Curso"**
   - O curso será publicado e você receberá um **código de convite**
   - ⚠️ **COPIE O CÓDIGO!** Você precisará dele para testar como aluno

### 2.3 Gerenciar Curso

Após criar, você pode:
- Ver o código de convite
- Adicionar mais materiais
- Ver status dos materiais
- Ver membros do curso

---

## 👨‍🎓 Passo 3: Se Você Escolheu "Aluno"

### 3.1 Dashboard do Aluno

Após o onboarding, você verá o **Dashboard do Aluno** em `/student/dashboard`

**O que você pode fazer:**
- Ver cursos que você está inscrito
- Entrar em novos cursos usando código de convite

### 3.2 Entrar em um Curso

1. **Obtenha o código de convite** do mentor
2. **Cole o código** no campo "Entrar em um Curso"
3. **Clique em "Entrar"**
4. O curso aparecerá na sua lista

### 3.3 Usar o Chat com IA

1. **Clique em um curso** da sua lista
2. Você será redirecionado para a página do chat
3. **Faça uma pergunta** sobre o material do curso
4. A IA responderá baseada nos PDFs enviados pelo mentor
5. Você verá as **fontes** (trechos dos PDFs) usadas na resposta

---

## 🔄 Passo 4: Testar o Fluxo Completo

### 4.1 Criar Conta como Mentor

1. Faça logout (se estiver logado)
2. Faça login novamente (com Google ou email)
3. Escolha **"Mentor"** no onboarding
4. Crie um curso de teste
5. Adicione um PDF de teste
6. Finalize o curso
7. **Anote o código de convite**

### 4.2 Criar Conta como Aluno

1. Faça logout
2. Crie uma **nova conta** (ou use outra conta Google)
3. Escolha **"Aluno"** no onboarding
4. Use o código de convite do curso criado
5. Entre no curso
6. Teste o chat com IA

---

## 🧪 Passo 5: Testar Funcionalidades Específicas

### 5.1 Upload de PDFs (Mentor)

**Teste:**
- Upload de PDF pequeno (< 1MB)
- Upload de PDF grande (> 5MB)
- Múltiplos PDFs ao mesmo tempo
- Verificar status de processamento

**O que verificar:**
- Status muda de "Processing" para "Ready"
- Se der erro, verificar mensagem de erro

### 5.2 Chat com IA (Aluno)

**Teste:**
- Pergunta simples sobre o conteúdo
- Pergunta complexa que requer múltiplos trechos
- Pergunta sobre algo que não está no material
- Verificar se as fontes aparecem corretamente

**O que verificar:**
- Resposta é relevante ao material
- Fontes são exibidas
- Se não encontrar, IA informa que não encontrou no material

### 5.3 Código de Convite (Mentor)

**Teste:**
- Código aparece apenas quando curso está publicado
- Código pode ser copiado
- Código funciona para entrar no curso

---

## 📋 Checklist de Testes

Marque conforme for testando:

### Login e Autenticação
- [ ] Login com Google funciona
- [ ] Onboarding aparece no primeiro login
- [ ] Perfil é criado corretamente
- [ ] Redirecionamento funciona (mentor → `/mentor/dashboard`, aluno → `/student/dashboard`)

### Funcionalidades do Mentor
- [ ] Dashboard do mentor carrega
- [ ] Criar curso funciona
- [ ] Upload de PDF funciona
- [ ] Status de processamento atualiza
- [ ] Finalizar curso funciona
- [ ] Código de convite aparece
- [ ] Gerenciar curso funciona

### Funcionalidades do Aluno
- [ ] Dashboard do aluno carrega
- [ ] Entrar em curso com código funciona
- [ ] Lista de cursos aparece
- [ ] Acessar chat do curso funciona
- [ ] Chat com IA responde
- [ ] Fontes aparecem nas respostas

### Integrações
- [ ] Gemini API funciona (chat responde)
- [ ] File Search funciona (busca nos PDFs)
- [ ] Supabase salva dados corretamente

---

## 🆘 Problemas Comuns

### Erro: "Não encontrei isso no material"
- **Causa**: A pergunta não está nos PDFs enviados
- **Solução**: Normal! A IA só responde baseado no material. Tente perguntar algo que está nos PDFs.

### Erro: "Material ainda está processando"
- **Causa**: PDF ainda está sendo indexado no Google File Search
- **Solução**: Aguarde alguns minutos e recarregue a página

### Erro: "Código de convite inválido"
- **Causa**: Código digitado incorretamente ou curso não está publicado
- **Solução**: Verifique se o código está correto e se o curso está publicado

### Chat não responde
- **Causa**: Pode ser problema com Gemini API ou File Search
- **Solução**: 
  1. Verifique se `GEMINI_API_KEY` está no `.env.local`
  2. Verifique se os materiais estão com status "Ready"
  3. Verifique os logs do servidor

---

## 🎉 Próximos Passos Avançados

Após testar tudo:

1. **Adicionar mais materiais** aos cursos
2. **Testar com múltiplos alunos** no mesmo curso
3. **Explorar o histórico de conversas**
4. **Personalizar cursos** com diferentes materiais
5. **Testar em produção** (quando fizer deploy)

---

## 📚 Recursos Adicionais

- **Documentação completa**: Veja `GUIA_CONFIGURACAO.md`
- **Estrutura do projeto**: Veja `README.md`
- **Scripts úteis**: 
  - `npm run check:stores` - Verifica File Search Stores
  - `npm run test:google` - Testa Google OAuth

---

**Boa sorte testando! 🚀**
