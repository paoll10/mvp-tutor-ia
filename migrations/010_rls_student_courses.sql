-- =============================================
-- MIGRAÇÃO 010: RLS PARA ALUNOS ACESSAREM CURSOS
-- Permite que alunos busquem cursos publicados e vejam cursos onde são membros
-- =============================================

-- =============================================
-- PARTE 1: POLÍTICAS PARA TABELA COURSES
-- =============================================

-- Alunos podem ver cursos publicados (para buscar por invite_code)
CREATE POLICY "courses_select_published" ON mentoria.courses
  FOR SELECT
  USING (status = 'published');

-- =============================================
-- PARTE 2: POLÍTICAS PARA TABELA COURSE_MEMBERS
-- =============================================

-- Usuário pode ver suas próprias inscrições
CREATE POLICY "members_select_own" ON mentoria.course_members
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuário pode se inscrever em cursos (inserir como aluno)
CREATE POLICY "members_insert_student" ON mentoria.course_members
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND role = 'aluno'
  );

-- Usuário pode sair de cursos (deletar própria inscrição)
CREATE POLICY "members_delete_own" ON mentoria.course_members
  FOR DELETE
  USING (auth.uid() = user_id AND role = 'aluno');

-- Mentor pode ver membros dos seus cursos
CREATE POLICY "members_select_mentor" ON mentoria.course_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mentoria.courses c 
      WHERE c.id = course_id 
      AND c.owner_id = auth.uid()
    )
  );

-- =============================================
-- VERIFICAÇÃO
-- =============================================

-- Lista todas as políticas criadas
-- SELECT schemaname, tablename, policyname FROM pg_policies 
-- WHERE schemaname = 'mentoria';
