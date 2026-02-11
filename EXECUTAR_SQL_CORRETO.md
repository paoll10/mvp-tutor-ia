# ✅ Como Executar o SQL Corretamente

## ⚠️ Erro Comum

Se você está vendo este erro:
```
ERROR: 42601: syntax error at or near "const"
LINE 8: const { createClient } = require('@supabase/supabase-js');
```

**Isso significa que você está tentando executar um arquivo JavaScript no SQL Editor!**

---

## ✅ Solução: Use o Arquivo SQL Correto

### Passo 1: Abrir o Arquivo Correto

**NÃO use:**
- ❌ `scripts/create-profile-for-user.js` (JavaScript)
- ❌ Qualquer arquivo `.js`

**USE:**
- ✅ `criar_trigger_automatico.sql` (SQL)

---

### Passo 2: Executar no Supabase

1. **Acesse**: https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz
2. **Vá em**: SQL Editor → New query
3. **Abra o arquivo**: `criar_trigger_automatico.sql`
4. **Copie TODO o conteúdo** (deve começar com `-- =============================================`)
5. **Cole no SQL Editor**
6. **Clique em "Run"** (ou `Ctrl+Enter`)

---

## 📋 Conteúdo Esperado do SQL

O arquivo SQL deve começar assim:

```sql
-- =============================================
-- CRIAR TRIGGER AUTOMÁTICO PARA PROFILES
-- Este SQL cria tudo automaticamente: schema, tabela e trigger
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- 1. Criar schema se não existir
CREATE SCHEMA IF NOT EXISTS mentoria;
```

**Se você ver `const`, `require`, `function`, etc., está no arquivo errado!**

---

## 🔍 Diferença entre Arquivos

| Arquivo | Tipo | Onde Usar |
|---------|------|-----------|
| `criar_trigger_automatico.sql` | SQL | Supabase SQL Editor ✅ |
| `scripts/create-profile-for-user.js` | JavaScript | Terminal/Node.js ❌ |

---

## ✅ Checklist

- [ ] Abri o arquivo `criar_trigger_automatico.sql`
- [ ] O conteúdo começa com `--` (comentários SQL)
- [ ] Não vejo palavras como `const`, `require`, `function`
- [ ] Estou no SQL Editor do Supabase
- [ ] Copiei TODO o conteúdo
- [ ] Cliquei em "Run"

---

**Agora execute o SQL correto e me avise se funcionou!** 🚀
