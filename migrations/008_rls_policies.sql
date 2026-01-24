-- =============================================
-- MIGRAÇÃO 008: POLÍTICAS DE SEGURANÇA (RLS POLICIES)
-- Define quem pode ver/editar o quê
-- =============================================

-- ============================================
-- PROFILES: usuário vê/edita só o próprio perfil
-- ============================================
create policy "profiles_select_own" on mentoria.profiles 
  for select to authenticated 
  using (user_id = auth.uid());

create policy "profiles_insert_own" on mentoria.profiles 
  for insert to authenticated 
  with check (user_id = auth.uid());

create policy "profiles_update_own" on mentoria.profiles 
  for update to authenticated 
  using (user_id = auth.uid());

-- ============================================
-- COURSES: mentor vê/edita só os cursos dele
-- ============================================
create policy "courses_select_owner" on mentoria.courses 
  for select to authenticated 
  using (owner_id = auth.uid());

create policy "courses_insert_owner" on mentoria.courses 
  for insert to authenticated 
  with check (owner_id = auth.uid());

create policy "courses_update_owner" on mentoria.courses 
  for update to authenticated 
  using (owner_id = auth.uid());

create policy "courses_delete_owner" on mentoria.courses 
  for delete to authenticated 
  using (owner_id = auth.uid());

-- ============================================
-- COURSE_MEMBERS: usuário vê só os vínculos dele
-- ============================================
create policy "course_members_select_own" on mentoria.course_members 
  for select to authenticated 
  using (user_id = auth.uid());

create policy "course_members_insert" on mentoria.course_members 
  for insert to authenticated 
  with check (
    exists (select 1 from mentoria.courses c where c.id = course_id and c.owner_id = auth.uid()) 
    OR user_id = auth.uid()
  );

-- ============================================
-- MATERIALS: mentor vê os dele, aluno vê dos cursos que participa
-- ============================================
create policy "materials_select_owner" on mentoria.materials 
  for select to authenticated 
  using (exists (select 1 from mentoria.courses c where c.id = materials.course_id and c.owner_id = auth.uid()));

create policy "materials_select_members" on mentoria.materials 
  for select to authenticated 
  using (exists (select 1 from mentoria.course_members cm where cm.course_id = materials.course_id and cm.user_id = auth.uid()));

create policy "materials_insert_owner" on mentoria.materials 
  for insert to authenticated 
  with check (exists (select 1 from mentoria.courses c where c.id = course_id and c.owner_id = auth.uid()));

create policy "materials_update_owner" on mentoria.materials 
  for update to authenticated 
  using (exists (select 1 from mentoria.courses c where c.id = materials.course_id and c.owner_id = auth.uid()));

create policy "materials_delete_owner" on mentoria.materials 
  for delete to authenticated 
  using (exists (select 1 from mentoria.courses c where c.id = materials.course_id and c.owner_id = auth.uid()));

-- ============================================
-- CONVERSATIONS: usuário vê só as conversas dele
-- ============================================
create policy "conversations_select_own" on mentoria.conversations 
  for select to authenticated 
  using (user_id = auth.uid());

create policy "conversations_insert_own" on mentoria.conversations 
  for insert to authenticated 
  with check (user_id = auth.uid());

-- ============================================
-- MESSAGES: usuário vê só mensagens das conversas dele
-- ============================================
create policy "messages_select_own" on mentoria.messages 
  for select to authenticated 
  using (exists (select 1 from mentoria.conversations conv where conv.id = messages.conversation_id and conv.user_id = auth.uid()));

create policy "messages_insert_own" on mentoria.messages 
  for insert to authenticated 
  with check (exists (select 1 from mentoria.conversations conv where conv.id = messages.conversation_id and conv.user_id = auth.uid()));

