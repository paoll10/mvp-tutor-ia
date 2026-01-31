-- =============================================
-- MIGRAÇÃO 009: ALTERAÇÕES PARA FLUXO DE CRIAÇÃO DE CURSO
-- Adiciona status em courses e metadados em materials
-- =============================================

-- =============================================
-- PARTE 1: TABELA COURSES
-- Adiciona campo status para controlar o fluxo de criação
-- =============================================

-- Status do curso:
-- 'draft' = Mentor está criando/adicionando materiais (código NÃO visível)
-- 'published' = Curso finalizado, código de convite liberado

ALTER TABLE mentoria.courses 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft' 
CHECK (status IN ('draft', 'published'));

-- Comentário:
-- O curso começa como 'draft' e só vira 'published' após:
-- 1. Ter pelo menos 1 material com status 'ready'
-- 2. Mentor clicar em "Finalizar Curso"

-- =============================================
-- PARTE 2: TABELA MATERIALS
-- Adiciona metadados para integração com Vertex AI
-- =============================================

-- Tamanho do arquivo em bytes
ALTER TABLE mentoria.materials 
ADD COLUMN IF NOT EXISTS file_size_bytes bigint;

-- Tipo MIME do arquivo (sempre application/pdf no MVP)
ALTER TABLE mentoria.materials 
ADD COLUMN IF NOT EXISTS mime_type text DEFAULT 'application/pdf';

-- Nome original do arquivo enviado pelo mentor
ALTER TABLE mentoria.materials 
ADD COLUMN IF NOT EXISTS original_filename text;

-- Comentários:
-- file_size_bytes: útil para validações e exibição
-- mime_type: preparado para suportar outros tipos no futuro
-- original_filename: preserva o nome original do arquivo

-- =============================================
-- ÍNDICE ADICIONAL
-- =============================================

-- Índice para buscar cursos por status (útil para listar apenas publicados)
CREATE INDEX IF NOT EXISTS idx_courses_status ON mentoria.courses(status);
