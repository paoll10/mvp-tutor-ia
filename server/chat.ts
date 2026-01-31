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

  // Prepara a resposta
  let answer: string;
  const sources: ChatSource[] = [];

  try {
    const client = getGeminiClient();

    // Se o curso tem File Search Store, usa RAG
    if (course.file_search_store_id) {
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
                fileSearchStoreIds: [course.file_search_store_id],
              },
            },
          ],
          systemInstruction: `Você é um tutor de IA especializado no curso "${course.name}".

REGRAS:
1. Responda APENAS com base nos materiais do curso fornecidos.
2. Se a informação não estiver nos materiais, diga que não encontrou a resposta nos materiais disponíveis.
3. Seja didático e use exemplos quando possível.
4. Responda sempre em português brasileiro.
5. Mantenha as respostas concisas mas completas.
6. Quando citar informações dos materiais, indique de qual documento veio.`,
        },
      });

      // Extrai o texto da resposta
      const textPart = response.candidates?.[0]?.content?.parts?.find(
        (part) => 'text' in part
      );
      answer = textPart && 'text' in textPart ? textPart.text || '' : '';

      // Extrai as fontes do grounding metadata
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      
      if (groundingMetadata?.groundingChunks) {
        for (const chunk of groundingMetadata.groundingChunks) {
          if (chunk.retrievedContext) {
            sources.push({
              title: chunk.retrievedContext.title || 'Material do curso',
              snippet: chunk.retrievedContext.text?.substring(0, 200),
            });
          }
        }
      }

      // Se não encontrou grounding chunks, tenta outra estrutura
      if (sources.length === 0 && groundingMetadata?.retrievalQueries) {
        // Adiciona indicação de que usou RAG
        sources.push({
          title: 'Materiais do curso',
          snippet: 'Resposta baseada nos PDFs do curso',
        });
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
