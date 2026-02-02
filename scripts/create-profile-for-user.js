/**
 * Script para criar perfil para um usuário existente
 * 
 * Uso: node scripts/create-profile-for-user.js <email> <role>
 * Exemplo: node scripts/create-profile-for-user.js teste.mentoria@gmail.com aluno
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

async function createProfile() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('❌ Uso: node scripts/create-profile-for-user.js <email> <role>');
    console.error('   Exemplo: node scripts/create-profile-for-user.js teste.mentoria@gmail.com aluno');
    console.error('   Roles válidos: mentor, aluno');
    process.exit(1);
  }

  const email = args[0];
  const role = args[1];

  if (!['mentor', 'aluno'].includes(role)) {
    console.error('❌ Role inválido! Use "mentor" ou "aluno"');
    process.exit(1);
  }

  console.log('🔧 Carregando configurações...\n');
  
  const env = loadEnv();
  
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não encontradas no .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log(`📝 Buscando usuário: ${email}...\n`);

  try {
    // Busca o usuário pelo email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      // Se não tiver acesso admin, tenta criar via SQL direto
      console.log('⚠️  Não foi possível listar usuários (precisa de service_role key)');
      console.log('\n💡 Vamos criar o perfil via SQL direto no Supabase Dashboard:\n');
      console.log('1. Acesse: https://supabase.com/dashboard/project/yltnhioftdhfjugcibvz');
      console.log('2. Vá em SQL Editor');
      console.log('3. Execute este SQL (substitua USER_ID pelo ID do usuário):\n');
      console.log(`INSERT INTO mentoria.profiles (user_id, role, full_name)`);
      console.log(`SELECT id, '${role}', split_part(email, '@', 1)`);
      console.log(`FROM auth.users`);
      console.log(`WHERE email = '${email}';`);
      console.log('\nOu crie manualmente pelo Dashboard:\n');
      console.log('1. Vá em Authentication → Users');
      console.log('2. Encontre o usuário e copie o User ID');
      console.log('3. Vá em Table Editor → mentoria.profiles');
      console.log('4. Clique em "Insert row"');
      console.log(`5. Preencha: user_id = <User ID>, role = '${role}'`);
      console.log('6. Salve\n');
      return;
    }

    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.error(`❌ Usuário com email ${email} não encontrado!`);
      console.log('\n💡 Certifique-se de que o usuário foi criado no Supabase Auth primeiro.');
      process.exit(1);
    }

    console.log(`✅ Usuário encontrado! ID: ${user.id}\n`);
    console.log('📝 Criando perfil...\n');

    // Verifica se já existe perfil
    const { data: existingProfile } = await supabase
      .schema('mentoria')
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingProfile) {
      console.log('⚠️  Perfil já existe!');
      console.log('\n📋 Perfil atual:');
      console.log(`   User ID: ${existingProfile.user_id}`);
      console.log(`   Role: ${existingProfile.role}`);
      console.log(`   Nome: ${existingProfile.full_name || 'Não definido'}\n`);
      return;
    }

    // Cria o perfil
    const { data: profile, error: insertError } = await supabase
      .schema('mentoria')
      .from('profiles')
      .insert({
        user_id: user.id,
        role: role,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao criar perfil:', insertError.message);
      console.log('\n💡 Possíveis causas:');
      console.log('   - Permissões RLS bloqueando a inserção');
      console.log('   - Usuário não autenticado');
      console.log('\n💡 Solução: Crie o perfil via SQL Editor no Supabase:\n');
      console.log(`INSERT INTO mentoria.profiles (user_id, role, full_name)`);
      console.log(`VALUES ('${user.id}', '${role}', '${user.email?.split('@')[0] || null}');\n`);
      process.exit(1);
    }

    console.log('✅ Perfil criado com sucesso!\n');
    console.log('📋 Detalhes do perfil:');
    console.log(`   User ID: ${profile.user_id}`);
    console.log(`   Role: ${profile.role}`);
    console.log(`   Nome: ${profile.full_name || 'Não definido'}\n`);
    console.log('🚀 Agora você pode fazer login e será redirecionado para o dashboard!\n');

  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

// Executa o script
createProfile();
