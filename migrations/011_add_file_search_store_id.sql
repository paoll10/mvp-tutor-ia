-- =============================================
-- MIGRAÇÃO 011: ADICIONA FILE_SEARCH_STORE_ID NA TABELA COURSES
-- Armazena o ID do File Search Store do Gemini para cada curso
-- =============================================

-- Adiciona coluna para armazenar o ID do File Search Store
ALTER TABLE mentoria.courses
ADD COLUMN IF NOT EXISTS file_search_store_id text;

-- Comentário:
-- file_search_store_id: ID completo do store no Gemini
-- Exemplo: "fileSearchStores/abc123xyz"
-- Cada curso tem seu próprio store para isolar os materiais

-- Índice para busca rápida (caso necessário)
CREATE INDEX IF NOT EXISTS idx_courses_file_search_store 
ON mentoria.courses(file_search_store_id) 
WHERE file_search_store_id IS NOT NULL;
