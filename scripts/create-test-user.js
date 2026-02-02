/**
 * Script para criar um usuário de teste no Supabase
 * 
 * Uso: node scripts/create-test-user.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Carrega variáveis de ambiente do .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ Arquivo .env.local não encontrado!');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};

  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  return env;
}

async function createTestUser() {
  console.log('🔧 Carregando configurações...\n');
  
  const env = loadEnv();
  
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não encontradas no .env.local');
    process.exit(1);
  }

  // Para criar usuário, precisamos usar a service_role key
  // Mas vamos tentar criar via signup primeiro
  const supabase = createClient(supabaseUrl, supabaseKey);

  const testEmail = 'teste.mentoria@gmail.com';
  const testPassword = 'Teste123!@#';

  console.log('📝 Criando usuário de teste...\n');
  console.log(`   Email: ${testEmail}`);
  console.log(`   Senha: ${testPassword}\n`);

  try {
    // Tenta criar o usuário
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: `${supabaseUrl.replace('/rest/v1', '')}/auth/callback`,
        data: {
          role: 'aluno'
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('⚠️  Usuário já existe!');
        console.log('\n✅ Credenciais de teste:');
        console.log(`   Email: ${testEmail}`);
        console.log(`   Senha: ${testPassword}\n`);
        console.log('💡 Você pode usar essas credenciais para fazer login.\n');
        return;
      }
      throw error;
    }

    if (data.user) {
      console.log('✅ Usuário criado com sucesso!\n');
      console.log('📋 Credenciais de teste:');
      console.log(`   Email: ${testEmail}`);
      console.log(`   Senha: ${testPassword}\n`);
      
      if (data.user.email_confirmed_at) {
        console.log('✅ Email confirmado automaticamente!\n');
        console.log('🚀 Você já pode fazer login com essas credenciais.\n');
      } else {
        console.log('⚠️  IMPORTANTE: Você precisa confirmar o email antes de fazer login.');
        console.log('💡 Para desabilitar confirmação de email (desenvolvimento):');
        console.log('   1. Acesse: https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz');
        console.log('   2. Vá em Authentication → Settings');
        console.log('   3. Em "Email Provider", desmarque "Confirm email"');
        console.log('   4. Salve as alterações\n');
      }
    }
  } catch (err) {
    console.error('❌ Erro ao criar usuário:', err.message);
    console.log('\n💡 Alternativa: Crie o usuário manualmente no Supabase Dashboard:');
    console.log('   1. Acesse: https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz');
    console.log('   2. Vá em Authentication → Users');
    console.log('   3. Clique em "Add user" → "Create new user"');
    console.log(`   4. Email: ${testEmail}`);
    console.log(`   5. Password: ${testPassword}`);
    console.log('   6. Marque "Auto Confirm User"');
    console.log('   7. Clique em "Create user"\n');
    process.exit(1);
  }
}

// Executa o script
createTestUser();
