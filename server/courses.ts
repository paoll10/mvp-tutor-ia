'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getOrCreateFileSearchStore } from '@/lib/gemini/file-search';

/**
 * Interface do Curso
 */
export interface Course {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  invite_code: string;
  status: 'draft' | 'published';
  created_at: string;
}

/**
 * Gera um código de convite único de 8 caracteres
 */
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Cria um novo curso (status: draft)
 */
export async function createCourse(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Usuário não autenticado' };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string | null;

  if (!name || name.trim().length < 3) {
    return { error: 'O nome do curso deve ter pelo menos 3 caracteres' };
  }

  // Gera código de convite único
  let inviteCode = generateInviteCode();
  let attempts = 0;
  const maxAttempts = 10;

  // Verifica se o código já existe
  while (attempts < maxAttempts) {
    const { data: existing } = await supabase
      .schema('mentoria')
      .from('courses')
      .select('id')
      .eq('invite_code', inviteCode)
      .single();

    if (!existing) break;
    inviteCode = generateInviteCode();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    return { error: 'Erro ao gerar código de convite. Tente novamente.' };
  }

  // Cria o curso no banco
  const { data: course, error } = await supabase
    .schema('mentoria')
    .from('courses')
    .insert({
      owner_id: user.id,
      name: name.trim(),
      description: description?.trim() || null,
      invite_code: inviteCode,
      status: 'draft',
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar curso:', error);
    return { error: 'Erro ao criar curso. Tente novamente.' };
  }

  // Cria o File Search Store para o curso e salva o ID
  try {
    const store = await getOrCreateFileSearchStore(`course-${course.id}`);
    
    // Atualiza o curso com o ID do store
    if (store.name) {
      await supabase
        .schema('mentoria')
        .from('courses')
        .update({ file_search_store_id: store.name })
        .eq('id', course.id);
      
      console.log(`Store ${store.name} vinculado ao curso ${course.id}`);
    }
  } catch (err) {
    console.error('Erro ao criar File Search Store:', err);
    // Não falha a criação do curso, apenas loga o erro
  }

  // Adiciona o mentor como membro do curso
  await supabase
    .schema('mentoria')
    .from('course_members')
    .insert({
      course_id: course.id,
      user_id: user.id,
      role: 'mentor',
    });

  revalidatePath('/mentor/dashboard');
  
  // Redireciona para a página de upload de materiais
  redirect(`/mentor/courses/${course.id}/materials`);
}

/**
 * Lista os cursos do mentor logado
 */
export async function listMentorCourses(): Promise<Course[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: courses, error } = await supabase
    .schema('mentoria')
    .from('courses')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao listar cursos:', error);
    return [];
  }

  return courses as Course[];
}

/**
 * Busca um curso pelo ID
 */
export async function getCourseById(courseId: string): Promise<Course | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: course, error } = await supabase
    .schema('mentoria')
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .eq('owner_id', user.id)
    .single();

  if (error) {
    console.error('Erro ao buscar curso:', error);
    return null;
  }

  return course as Course;
}

/**
 * Atualiza as informações do curso
 */
export async function updateCourse(courseId: string, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Usuário não autenticado' };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string | null;

  if (!name || name.trim().length < 3) {
    return { error: 'O nome do curso deve ter pelo menos 3 caracteres' };
  }

  const { error } = await supabase
    .schema('mentoria')
    .from('courses')
    .update({
      name: name.trim(),
      description: description?.trim() || null,
    })
    .eq('id', courseId)
    .eq('owner_id', user.id);

  if (error) {
    console.error('Erro ao atualizar curso:', error);
    return { error: 'Erro ao atualizar curso. Tente novamente.' };
  }

  revalidatePath(`/mentor/courses/${courseId}`);
  return { success: true };
}

/**
 * Publica o curso (muda status para 'published')
 * Só pode publicar se tiver pelo menos 1 material pronto
 */
export async function publishCourse(courseId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Usuário não autenticado' };
  }

  // Verifica se tem materiais prontos
  const { data: materials } = await supabase
    .schema('mentoria')
    .from('materials')
    .select('id')
    .eq('course_id', courseId)
    .eq('status', 'ready');

  if (!materials || materials.length === 0) {
    return { error: 'O curso precisa ter pelo menos 1 material processado para ser publicado' };
  }

  // Atualiza o status
  const { data: course, error } = await supabase
    .schema('mentoria')
    .from('courses')
    .update({ status: 'published' })
    .eq('id', courseId)
    .eq('owner_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao publicar curso:', error);
    return { error: 'Erro ao publicar curso. Tente novamente.' };
  }

  revalidatePath(`/mentor/courses/${courseId}`);
  revalidatePath('/mentor/dashboard');

  return { success: true, course };
}

/**
 * Deleta um curso
 */
export async function deleteCourse(courseId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Usuário não autenticado' };
  }

  const { error } = await supabase
    .schema('mentoria')
    .from('courses')
    .delete()
    .eq('id', courseId)
    .eq('owner_id', user.id);

  if (error) {
    console.error('Erro ao deletar curso:', error);
    return { error: 'Erro ao deletar curso. Tente novamente.' };
  }

  revalidatePath('/mentor/dashboard');
  redirect('/mentor/dashboard');
}
