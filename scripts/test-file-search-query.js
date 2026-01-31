/**
 * Script para testar uma query no File Search Store
 * 
 * Uso: node scripts/test-file-search-query.js
 * 
 * Este script testa se o File Search está funcionando corretamente
 * fazendo uma query direta no store especificado.
 */

const fs = require('fs');
const path = require('path');

// Carrega variáveis do .env.local manualmente
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ Arquivo .env.local não encontrado');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      process.env[key] = value;
    }
  }
}

loadEnvFile();

// Store ID para testar - altere conforme necessário
const STORE_ID = 'fileSearchStores/course919c5061efd948ea948f3-z03yt25ns1q2';
const TEST_QUERY = 'O que você sabe sobre os documentos disponíveis?';

async function main() {
  console.log('\n🧪 Testando File Search Query...\n');
  console.log('=' .repeat(60));

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY não encontrada no .env.local');
    process.exit(1);
  }

  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey });

  console.log(`\n📦 Store: ${STORE_ID}`);
  console.log(`❓ Query: ${TEST_QUERY}\n`);

  try {
    // Faz a query usando o File Search
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: TEST_QUERY }],
        },
      ],
      config: {
        tools: [
          {
            fileSearch: {
              fileSearchStoreNames: [STORE_ID],
            },
          },
        ],
        systemInstruction: `Você é um assistente que DEVE responder APENAS com base nos documentos fornecidos pelo File Search.
        
REGRAS:
1. Use APENAS informações dos documentos retornados pelo File Search.
2. NÃO invente informações.
3. Se nenhum documento relevante foi encontrado, diga claramente.
4. Liste os nomes dos documentos que você encontrou.`,
      },
    });

    console.log('📝 RESPOSTA DO MODELO:\n');
    console.log('-'.repeat(60));
    
    const textPart = response.candidates?.[0]?.content?.parts?.find(
      (part) => 'text' in part
    );
    const answer = textPart && 'text' in textPart ? textPart.text : '(sem resposta)';
    console.log(answer);
    
    console.log('\n' + '-'.repeat(60));

    // Mostra o grounding metadata
    console.log('\n📊 GROUNDING METADATA:\n');
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    
    if (groundingMetadata) {
      console.log(JSON.stringify(groundingMetadata, null, 2));
      
      if (groundingMetadata.groundingChunks) {
        console.log(`\n✅ Encontrados ${groundingMetadata.groundingChunks.length} grounding chunks`);
        
        for (let i = 0; i < groundingMetadata.groundingChunks.length; i++) {
          const chunk = groundingMetadata.groundingChunks[i];
          console.log(`\n   Chunk #${i + 1}:`);
          if (chunk.retrievedContext) {
            console.log(`   - Título: ${chunk.retrievedContext.title || '(sem título)'}`);
            console.log(`   - Texto: ${chunk.retrievedContext.text?.substring(0, 100)}...`);
          }
        }
      } else {
        console.log('\n⚠️  Nenhum grounding chunk encontrado');
      }
      
      if (groundingMetadata.retrievalQueries) {
        console.log('\n📝 Retrieval queries:', groundingMetadata.retrievalQueries);
      }
    } else {
      console.log('⚠️  Nenhum grounding metadata encontrado na resposta');
      console.log('\n🔍 Resposta completa para debug:');
      console.log(JSON.stringify(response.candidates?.[0], null, 2));
    }

    console.log('\n' + '=' .repeat(60));
    console.log('\n✅ Teste concluído!\n');

  } catch (error) {
    console.error('\n❌ Erro ao fazer query:');
    console.error(error);
    process.exit(1);
  }
}

main();
