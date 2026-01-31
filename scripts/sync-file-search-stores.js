/**
 * Script para sincronizar File Search Stores com o banco de dados
 * 
 * Este script:
 * 1. Lista todos os stores do Gemini
 * 2. Extrai o course_id do nome do store
 * 3. Atualiza a tabela courses com o file_search_store_id
 * 
 * Uso: npm run sync:stores
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Carrega variáveis de ambiente do .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ Arquivo .env.local não encontrado!');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    process.env[key] = value;
  }
}

loadEnv();

// Verifica variáveis necessárias
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY não encontrada no .env.local');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrada no .env.local');
  console.error('   Adicione SUPABASE_SERVICE_ROLE_KEY para este script funcionar.');
  process.exit(1);
}

async function main() {
  console.log('\n🔄 Sincronizando File Search Stores com o banco de dados...\n');

  // Importa o SDK do Gemini
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  // Cria cliente Supabase com service role (bypass RLS)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    db: { schema: 'mentoria' }
  });

  // Lista os stores do Gemini
  console.log('📦 Buscando stores do Gemini...\n');
  
  const stores = [];
  const pager = await ai.fileSearchStores.list({ config: { pageSize: 20 } });
  
  for await (const store of pager) {
    stores.push(store);
  }

  console.log(`   Encontrados ${stores.length} store(s)\n`);

  if (stores.length === 0) {
    console.log('⚠️  Nenhum store encontrado.');
    return;
  }

  // Processa cada store
  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const store of stores) {
    const displayName = store.displayName || '';
    const storeId = store.name || '';

    // Extrai o course_id do displayName (formato: course-{uuid})
    const match = displayName.match(/^course-(.+)$/);
    
    if (!match) {
      console.log(`⏭️  Pulando store "${displayName}" - não é um curso`);
      skipped++;
      continue;
    }

    const courseId = match[1];
    console.log(`🔍 Processando: ${displayName}`);
    console.log(`   Course ID: ${courseId}`);
    console.log(`   Store ID: ${storeId}`);

    // Verifica se o curso existe
    const { data: course, error: findError } = await supabase
      .from('courses')
      .select('id, name, file_search_store_id')
      .eq('id', courseId)
      .single();

    if (findError || !course) {
      console.log(`   ❌ Curso não encontrado no banco\n`);
      notFound++;
      continue;
    }

    // Verifica se já tem o store_id
    if (course.file_search_store_id === storeId) {
      console.log(`   ✅ Já sincronizado\n`);
      skipped++;
      continue;
    }

    // Atualiza o curso
    const { error: updateError } = await supabase
      .from('courses')
      .update({ file_search_store_id: storeId })
      .eq('id', courseId);

    if (updateError) {
      console.log(`   ❌ Erro ao atualizar: ${updateError.message}\n`);
      continue;
    }

    console.log(`   ✅ Atualizado com sucesso!\n`);
    updated++;
  }

  // Resumo
  console.log('═'.repeat(50));
  console.log('\n📊 RESUMO:\n');
  console.log(`   ✅ Atualizados: ${updated}`);
  console.log(`   ⏭️  Pulados: ${skipped}`);
  console.log(`   ❌ Não encontrados: ${notFound}`);
  console.log('\n✨ Sincronização concluída!\n');
}

main().catch(console.error);
