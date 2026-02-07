import { getGeminiClient, DEFAULT_CHUNKING_CONFIG } from './client';
import type { FileSearchStore } from '@google/genai';

/**
 * Interface para o resultado do upload de arquivo
 */
export interface UploadResult {
  success: boolean;
  documentName?: string;
  error?: string;
}

/**
 * Interface para busca no File Search
 */
export interface SearchResult {
  text: string;
  sources: Array<{
    title: string;
    snippet: string;
  }>;
}

/**
 * Cria um novo File Search Store para um curso
 * @param displayName Nome do store (geralmente o ID do curso)
 * @returns O store criado
 */
export async function createFileSearchStore(displayName: string): Promise<FileSearchStore> {
  const client = getGeminiClient();
  
  const store = await client.fileSearchStores.create({
    config: { displayName },
  });

  console.log(`File Search Store criado: ${store.name}`);
  return store;
}

/**
 * Busca um File Search Store pelo displayName
 * @param displayName Nome do store para buscar
 * @returns O store encontrado ou null
 */
export async function findFileSearchStore(displayName: string): Promise<FileSearchStore | null> {
  const client = getGeminiClient();
  
  try {
    const pager = await client.fileSearchStores.list({ config: { pageSize: 20 } });
    let page = pager.page;
    
    while (true) {
      for (const store of page) {
        if (store.displayName === displayName) {
          return store;
        }
      }
      
      if (!pager.hasNextPage()) break;
      page = await pager.nextPage();
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar File Search Store:', error);
    return null;
  }
}

/**
 * Obtém ou cria um File Search Store
 * @param displayName Nome do store
 * @returns O store existente ou um novo
 */
export async function getOrCreateFileSearchStore(displayName: string): Promise<FileSearchStore> {
  const existingStore = await findFileSearchStore(displayName);
  
  if (existingStore) {
    console.log(`File Search Store encontrado: ${existingStore.name}`);
    return existingStore;
  }
  
  return createFileSearchStore(displayName);
}

/**
 * Faz upload de um arquivo para o File Search Store
 * @param storeName Nome do store (ex: fileSearchStores/xxx)
 * @param fileBuffer Buffer do arquivo
 * @param fileName Nome do arquivo
 * @param displayName Nome para exibição
 * @returns Resultado do upload
 */
export async function uploadFileToStore(
  storeName: string,
  fileBuffer: Buffer,
  fileName: string,
  displayName: string
): Promise<UploadResult> {
  const client = getGeminiClient();

  try {
    // Copia Buffer para um ArrayBuffer puro (evita ArrayBufferLike do Node.js)
    const arrayBuffer = new ArrayBuffer(fileBuffer.byteLength);
    new Uint8Array(arrayBuffer).set(fileBuffer);
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    
    // Cria um File object
    const file = new File([blob], fileName, { type: 'application/pdf' });

    // Inicia o upload
    let operation = await client.fileSearchStores.uploadToFileSearchStore({
      file: file,
      fileSearchStoreName: storeName,
      config: {
        displayName,
        chunkingConfig: DEFAULT_CHUNKING_CONFIG,
      },
    });

    // Aguarda o processamento
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      operation = await client.operations.get({ operation });
    }

    console.log(`Arquivo processado: ${displayName}`);
    console.log('Operation response:', JSON.stringify(operation, null, 2));

    // Tenta obter o nome do documento de várias formas
    const documentName = 
      operation.response?.name || 
      operation.result?.name ||
      // @ts-expect-error - estrutura pode variar
      operation.response?.document?.name ||
      // @ts-expect-error - estrutura pode variar
      operation.metadata?.document?.name ||
      null;

    console.log(`Document name extraído: ${documentName}`);

    return {
      success: true,
      documentName,
    };
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Lista todos os documentos de um File Search Store
 * @param storeName Nome do store
 * @returns Lista de documentos
 */
export async function listStoreDocuments(storeName: string) {
  const client = getGeminiClient();
  
  try {
    const documents: Array<{ name: string; displayName: string }> = [];
    const pager = await client.fileSearchStores.documents.list({ parent: storeName });
    
    for await (const doc of pager) {
      documents.push({
        name: doc.name || '',
        displayName: doc.displayName || '',
      });
    }
    
    return documents;
  } catch (error) {
    console.error('Erro ao listar documentos:', error);
    return [];
  }
}

/**
 * Remove um documento do File Search Store
 * @param documentName Nome completo do documento
 */
export async function deleteDocument(documentName: string): Promise<boolean> {
  const client = getGeminiClient();
  
  try {
    await client.fileSearchStores.documents.delete({
      name: documentName,
      config: { force: true },
    });
    
    console.log(`Documento removido: ${documentName}`);
    return true;
  } catch (error) {
    console.error('Erro ao remover documento:', error);
    return false;
  }
}

/**
 * Remove um File Search Store completo
 * @param storeName Nome do store
 */
export async function deleteFileSearchStore(storeName: string): Promise<boolean> {
  const client = getGeminiClient();
  
  try {
    await client.fileSearchStores.delete({
      name: storeName,
      config: { force: true },
    });
    
    console.log(`File Search Store removido: ${storeName}`);
    return true;
  } catch (error) {
    console.error('Erro ao remover store:', error);
    return false;
  }
}
