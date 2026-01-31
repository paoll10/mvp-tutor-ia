'use server';

import { createClient } from '@/utils/supabase/server';
import { getGeminiClient, DEFAULT_MODEL } from '@/lib/gemini/client';

/**
 * Interface de uma mensagem de chat
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: ChatSource[];
}

/**
 * Interface de uma fonte citada
 */
export interface ChatSource {
  title: string;
  snippet?: string;
}

/**
 * Interface da resposta do chat
 */
export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}

/**
 * Faz uma pergunta ao tutor de IA do curso
 */
export async function askQuestion(
  courseId: string,
  question: string
): Promise<ChatResponse> {
  const supabase = await createClient();

  // Verifica autenticação
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  // Verifica se o usuário é membro do curso
  const { data: membership } = await supabase
    .schema('mentoria')
    .from('course_members')
    .select('id')
    .eq('course_id', courseId)
    .eq('user_id', user.id)
    .single();

  if (!membership) {
    throw new Error('Você não tem acesso a este curso');
  }

  // Busca o curso e seu file_search_store_id
  const { data: course } = await supabase
    .schema('mentoria')
    .from('courses')
    .select('id, name, file_search_store_id')
    .eq('id', courseId)
    .single();

  if (!course) {
    throw new Error('Curso não encontrado');
  }

  // Log para debug
  console.log('[Chat] Dados do curso:', {
    id: course.id,
    name: course.name,
    file_search_store_id: course.file_search_store_id || 'NÃO DEFINIDO',
  });

  // Prepara a resposta
  let answer: string;
  const sources: ChatSource[] = [];

  try {
    const client = getGeminiClient();

    // Se o curso tem File Search Store, usa RAG
    if (course.file_search_store_id) {
      console.log(`[Chat] Usando File Search Store: ${course.file_search_store_id}`);
      
      // Gera resposta com grounding no File Search Store
      const response = await client.models.generateContent({
        model: DEFAULT_MODEL,
        contents: [
          {
            role: 'user',
            parts: [{ text: question }],
          },
        ],
        config: {
          tools: [
            {
              fileSearch: {
                fileSearchStoreNames: [course.file_search_store_id],
              },
            },
          ],
          systemInstruction: `Você é um tutor de IA que responde perguntas EXCLUSIVAMENTE com base nos documentos fornecidos através do File Search.

REGRAS OBRIGATÓRIAS:
1. Use APENAS as informações recuperadas dos documentos do File Search para responder.
2. NÃO invente informações. NÃO use conhecimento externo.
3. Se o File Search não retornar informações relevantes, responda: "Não encontrei informações sobre isso nos materiais do curso."
4. Sempre que citar informações, mencione o nome do documento de origem.
5. Responda em português brasileiro de forma didática.
6. O nome do curso é "${course.name}" - use isso apenas para contexto, não invente conteúdo baseado no nome.

IMPORTANTE: Você deve basear sua resposta APENAS nos chunks de texto retornados pelo File Search. Se nenhum chunk relevante foi retornado, diga que não encontrou a informação.`,
        },
      });

      // Log para debug
      console.log('[Chat] Resposta recebida. Verificando grounding metadata...');
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      console.log('[Chat] Grounding metadata:', JSON.stringify(groundingMetadata, null, 2));

      // Extrai o texto da resposta
      const textPart = response.candidates?.[0]?.content?.parts?.find(
        (part) => 'text' in part
      );
      answer = textPart && 'text' in textPart ? textPart.text || '' : '';

      // Extrai as fontes do grounding metadata
      if (groundingMetadata?.groundingChunks) {
        console.log(`[Chat] Encontrados ${groundingMetadata.groundingChunks.length} grounding chunks`);
        
        // Usa um Set para evitar duplicatas de títulos
        const seenTitles = new Set<string>();
        
        for (const chunk of groundingMetadata.groundingChunks) {
          if (chunk.retrievedContext) {
            const title = chunk.retrievedContext.title || 'Material do curso';
            
            // Evita duplicar fontes com o mesmo título
            if (!seenTitles.has(title)) {
              seenTitles.add(title);
              sources.push({
                title,
                snippet: chunk.retrievedContext.text?.substring(0, 300),
              });
            }
          }
        }
      }

      // Se não encontrou grounding chunks, verifica se há chunks em outra estrutura
      if (sources.length === 0) {
        console.log('[Chat] Nenhum grounding chunk encontrado.');
        
        // Verifica se há retrievalQueries (indica que o file search foi acionado)
        if (groundingMetadata?.retrievalQueries) {
          console.log('[Chat] Retrieval queries encontradas:', groundingMetadata.retrievalQueries);
          sources.push({
            title: 'Materiais do curso',
            snippet: 'Busca realizada nos documentos do curso',
          });
        } else {
          // Se não há nenhuma metadata de grounding, pode ser que o file search não funcionou
          console.log('[Chat] AVISO: Nenhum metadata de grounding encontrado. O File Search pode não estar funcionando.');
        }
      }
    } else {
      // Se não tem File Search Store, usa apenas o modelo
      const response = await client.models.generateContent({
        model: DEFAULT_MODEL,
        contents: [
          {
            role: 'user',
            parts: [{ text: question }],
          },
        ],
        config: {
          systemInstruction: `Você é um tutor de IA do curso "${course.name}".

Infelizmente, não há materiais carregados neste curso ainda.
Responda de forma geral, mas avise que a resposta não está baseada nos materiais do curso.
Responda sempre em português brasileiro.`,
        },
      });

      const textPart = response.candidates?.[0]?.content?.parts?.find(
        (part) => 'text' in part
      );
      answer = textPart && 'text' in textPart ? textPart.text || '' : '';

      // Adiciona aviso de que não há materiais
      if (!answer.includes('não há materiais') && !answer.includes('sem materiais')) {
        sources.push({
          title: 'Aviso',
          snippet: 'Este curso ainda não possui materiais carregados. A resposta é baseada no conhecimento geral.',
        });
      }
    }
  } catch (error) {
    console.error('Erro ao chamar Gemini:', error);
    throw new Error('Erro ao processar sua pergunta. Tente novamente.');
  }

  // Remove quebras de linha extras e limpa a resposta
  answer = answer.trim();

  if (!answer) {
    answer = 'Desculpe, não consegui gerar uma resposta. Tente reformular sua pergunta.';
  }

  return { answer, sources };
}
