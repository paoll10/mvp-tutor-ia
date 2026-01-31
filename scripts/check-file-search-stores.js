/**
 * Script para verificar os File Search Stores no Google
 * 
 * Uso: npm run check:stores
 * 
 * Este script lista todos os File Search Stores e seus documentos
 * para verificar se os uploads estão funcionando corretamente.
 */

const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log('\n🔍 Verificando File Search Stores...\n');
  console.log('=' .repeat(60));

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY não encontrada no .env.local');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    // Lista todos os stores
    console.log('\n📦 FILE SEARCH STORES:\n');
    
    const storesPager = await ai.fileSearchStores.list({ config: { pageSize: 100 } });
    let storesCount = 0;
    
    for await (const store of storesPager) {
      storesCount++;
      console.log(`\n┌─ Store #${storesCount}`);
      console.log(`│  Nome: ${store.displayName || '(sem nome)'}`);
      console.log(`│  ID: ${store.name}`);
      console.log(`│  Criado em: ${store.createTime || 'N/A'}`);
      
      // Lista documentos do store
      try {
        const docsPager = await ai.fileSearchStores.documents.list({ parent: store.name });
        let docsCount = 0;
        
        console.log(`│`);
        console.log(`│  📄 Documentos:`);
        
        for await (const doc of docsPager) {
          docsCount++;
          console.log(`│     ${docsCount}. ${doc.displayName || '(sem nome)'}`);
          console.log(`│        ID: ${doc.name}`);
        }
        
        if (docsCount === 0) {
          console.log(`│     (nenhum documento)`);
        }
        
        console.log(`│`);
        console.log(`└─ Total: ${docsCount} documento(s)`);
        
      } catch (err) {
        console.log(`│  ⚠️  Erro ao listar documentos: ${err.message}`);
        console.log(`└─`);
      }
    }

    if (storesCount === 0) {
      console.log('   (nenhum store encontrado)');
      console.log('\n💡 Dica: Crie um curso e faça upload de materiais para criar um store.');
    }

    console.log('\n' + '=' .repeat(60));
    console.log(`\n✅ Total de stores: ${storesCount}\n`);

  } catch (error) {
    console.error('\n❌ Erro ao conectar com Google File Search:');
    console.error(error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 Dica: Verifique se a GEMINI_API_KEY está correta no .env.local');
    }
    
    process.exit(1);
  }
}

main();
