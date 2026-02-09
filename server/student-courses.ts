'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Interface do Curso para Aluno
 */
export interface StudentCourse {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
  joined_at: string;
}

/**
 * Entra em um curso usando o código de convite
 */
export async function joinCourseByCode(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Usuário não autenticado' };
  }

  const code = (formData.get('code') as string)?.toUpperCase().trim();

  if (!code || code.length < 6) {
    return { error: 'Código de convite inválido' };
  }

  // Busca o curso pelo código
  const { data: course, error: courseError } = await supabase
    .schema('mentoria')
    .from('courses')
    .select('id, name, status')
    .eq('invite_code', code)
    .single();

  if (courseError || !course) {
    return { error: 'Curso não encontrado. Verifique o código e tente novamente.' };
  }

  // Verifica se o curso está publicado
  if (course.status !== 'published') {
    return { error: 'Este curso ainda não está disponível para alunos.' };
  }

  // Verifica se já é membro
  const { data: existingMember } = await supabase
    .schema('mentoria')
    .from('course_members')
    .select('id')
    .eq('course_id', course.id)
    .eq('user_id', user.id)
    .single();

  if (existingMember) {
    return { error: 'Você já está inscrito neste curso.', courseId: course.id };
  }

  // Adiciona como membro
  const { error: memberError } = await supabase
    .schema('mentoria')
    .from('course_members')
    .insert({
      course_id: course.id,
      user_id: user.id,
      role: 'aluno',
    });

  if (memberError) {
    console.error('Erro ao entrar no curso:', memberError);
    return { error: 'Erro ao entrar no curso. Tente novamente.' };
  }

  revalidatePath('/student/dashboard');
  revalidatePath('/student/courses');

  return { 
    success: true, 
    courseId: course.id,
    courseName: course.name,
  };
}

/**
 * Lista os cursos do aluno
 */
export async function listStudentCourses(): Promise<StudentCourse[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // Busca os cursos que o aluno participa
  const { data: memberships, error } = await supabase
    .schema('mentoria')
    .from('course_members')
    .select(`
      created_at,
      courses:course_id (
        id,
        name,
        description,
        owner_id,
        created_at
      )
    `)
    .eq('user_id', user.id)
    .eq('role', 'aluno')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao listar cursos do aluno:', error);
    return [];
  }

  // Formata os dados
  // O Supabase tipa joins com alias como array, mas retorna objeto em runtime
  return memberships.map((m) => {
    const course = m.courses as unknown as {
      id: string;
      name: string;
      description: string | null;
      owner_id: string;
      created_at: string;
    };
    return {
      id: course.id,
      name: course.name,
      description: course.description,
      owner_id: course.owner_id,
      created_at: course.created_at,
      joined_at: m.created_at,
    };
  });
}

/**
 * Busca um curso específico do aluno
 */
export async function getStudentCourse(courseId: string): Promise<StudentCourse | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Verifica se o aluno é membro do curso
  const { data: membership, error } = await supabase
    .schema('mentoria')
    .from('course_members')
    .select(`
      created_at,
      courses:course_id (
        id,
        name,
        description,
        owner_id,
        created_at
      )
    `)
    .eq('course_id', courseId)
    .eq('user_id', user.id)
    .eq('role', 'aluno')
    .single();

  if (error || !membership) {
    return null;
  }

  // O Supabase tipa joins com alias como array, mas retorna objeto em runtime
  const course = membership.courses as unknown as {
    id: string;
    name: string;
    description: string | null;
    owner_id: string;
    created_at: string;
  };
  return {
    id: course.id,
    name: course.name,
    description: course.description,
    owner_id: course.owner_id,
    created_at: course.created_at,
    joined_at: membership.created_at,
  };
}

/**
 * Sai de um curso
 */
export async function leaveCourse(courseId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Usuário não autenticado' };
  }

  const { error } = await supabase
    .schema('mentoria')
    .from('course_members')
    .delete()
    .eq('course_id', courseId)
    .eq('user_id', user.id)
    .eq('role', 'aluno');

  if (error) {
    console.error('Erro ao sair do curso:', error);
    return { error: 'Erro ao sair do curso. Tente novamente.' };
  }

  revalidatePath('/student/dashboard');
  revalidatePath('/student/courses');

  return { success: true };
}
