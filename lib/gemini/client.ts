import { GoogleGenAI } from '@google/genai';

// Singleton para o cliente Gemini
let geminiClient: GoogleGenAI | null = null;

/**
 * Retorna uma instância do cliente GoogleGenAI
 * Usa singleton para reutilizar a mesma instância
 */
export function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não está configurada nas variáveis de ambiente');
    }

    geminiClient = new GoogleGenAI({ apiKey });
  }

  return geminiClient;
}

/**
 * Modelo padrão para geração de conteúdo
 */
export const DEFAULT_MODEL = 'gemini-2.5-flash';

/**
 * Configurações padrão de chunking para File Search
 */
export const DEFAULT_CHUNKING_CONFIG = {
  whiteSpaceConfig: {
    maxTokensPerChunk: 500,
    maxOverlapTokens: 50,
  },
};
