'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { 
  getOrCreateFileSearchStore, 
  uploadFileToStore,
  deleteDocument,
  listStoreDocuments,
} from '@/lib/gemini/file-search';

/**
 * Interface do Material
 */
export interface Material {
  id: string;
  course_id: string;
  created_by: string;
  title: string;
  status: 'processing' | 'ready' | 'error';
  google_file_id: string | null;
  error_message: string | null;
  file_size_bytes: number | null;
  mime_type: string | null;
  original_filename: string | null;
  created_at: string;
}

/**
 * Lista os materiais de um curso
 */
export async function listCourseMaterials(courseId: string): Promise<Material[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: materials, error } = await supabase
    .schema('mentoria')
    .from('materials')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao listar materiais:', error);
    return [];
  }

  return materials as Material[];
}

/**
 * Faz upload de um material (PDF) para o curso
 */
export async function uploadMaterial(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Usuário não autenticado' };
  }

  const courseId = formData.get('course_id') as string;
  const file = formData.get('file') as File;

  if (!courseId) {
    return { error: 'ID do curso não fornecido' };
  }

  if (!file || !(file instanceof File)) {
    return { error: 'Arquivo não fornecido' };
  }

  // Valida o tipo do arquivo
  if (file.type !== 'application/pdf') {
    return { error: 'Apenas arquivos PDF são aceitos' };
  }

  // Valida o tamanho (máximo 50MB)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return { error: 'O arquivo deve ter no máximo 50MB' };
  }

  // Verifica se o usuário é dono do curso
  const { data: course } = await supabase
    .schema('mentoria')
    .from('courses')
    .select('id')
    .eq('id', courseId)
    .eq('owner_id', user.id)
    .single();

  if (!course) {
    return { error: 'Curso não encontrado ou você não tem permissão' };
  }

  // Cria o registro do material no banco (status: processing)
  const { data: material, error: insertError } = await supabase
    .schema('mentoria')
    .from('materials')
    .insert({
      course_id: courseId,
      created_by: user.id,
      title: file.name.replace(/\.pdf$/i, ''),
      status: 'processing',
      file_size_bytes: file.size,
      mime_type: file.type,
      original_filename: file.name,
    })
    .select()
    .single();

  if (insertError) {
    console.error('Erro ao criar material:', insertError);
    return { error: 'Erro ao criar material. Tente novamente.' };
  }

  // Processa o upload em background (não bloqueia a resposta)
  processMaterialUpload(material.id, courseId, file).catch(console.error);

  revalidatePath(`/mentor/courses/${courseId}/materials`);

  return { 
    success: true, 
    material: {
      id: material.id,
      title: material.title,
      status: 'processing',
    },
  };
}

/**
 * Processa o upload do material para o Gemini File Search
 * Roda em background
 */
async function processMaterialUpload(materialId: string, courseId: string, file: File) {
  const supabase = await createClient();

  try {
    // Obtém ou cria o File Search Store do curso
    const store = await getOrCreateFileSearchStore(`course-${courseId}`);

    if (!store.name) {
      throw new Error('Store name não disponível');
    }

    // Converte o File para Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Faz upload para o Gemini
    const result = await uploadFileToStore(
      store.name,
      buffer,
      file.name,
      file.name.replace(/\.pdf$/i, '')
    );

    if (!result.success) {
      throw new Error(result.error || 'Erro no upload');
    }

    // Atualiza o material com sucesso
    await supabase
      .schema('mentoria')
      .from('materials')
      .update({
        status: 'ready',
        google_file_id: result.documentName || null,
      })
      .eq('id', materialId);

    console.log(`Material ${materialId} processado com sucesso`);

  } catch (error) {
    console.error(`Erro ao processar material ${materialId}:`, error);

    // Atualiza o material com erro
    await supabase
      .schema('mentoria')
      .from('materials')
      .update({
        status: 'error',
        error_message: error instanceof Error ? error.message : 'Erro desconhecido',
      })
      .eq('id', materialId);
  }
}

/**
 * Deleta um material
 */
export async function deleteMaterial(materialId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Usuário não autenticado' };
  }

  // Busca o material
  const { data: material } = await supabase
    .schema('mentoria')
    .from('materials')
    .select('*, courses!inner(owner_id)')
    .eq('id', materialId)
    .single();

  if (!material) {
    return { error: 'Material não encontrado' };
  }

  // Verifica permissão
  if (material.courses?.owner_id !== user.id) {
    return { error: 'Você não tem permissão para deletar este material' };
  }

  // Remove do Gemini File Search se existir
  if (material.google_file_id) {
    await deleteDocument(material.google_file_id);
  }

  // Remove do banco
  const { error } = await supabase
    .schema('mentoria')
    .from('materials')
    .delete()
    .eq('id', materialId);

  if (error) {
    console.error('Erro ao deletar material:', error);
    return { error: 'Erro ao deletar material. Tente novamente.' };
  }

  revalidatePath(`/mentor/courses/${material.course_id}/materials`);

  return { success: true };
}

/**
 * Reprocessa um material com erro
 */
export async function retryMaterial(materialId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Usuário não autenticado' };
  }

  // Busca o material
  const { data: material } = await supabase
    .schema('mentoria')
    .from('materials')
    .select('*, courses!inner(owner_id)')
    .eq('id', materialId)
    .eq('status', 'error')
    .single();

  if (!material) {
    return { error: 'Material não encontrado ou não está com erro' };
  }

  // Atualiza status para processing
  await supabase
    .schema('mentoria')
    .from('materials')
    .update({
      status: 'processing',
      error_message: null,
    })
    .eq('id', materialId);

  revalidatePath(`/mentor/courses/${material.course_id}/materials`);

  return { success: true, message: 'Material será reprocessado em breve' };
}

/**
 * Conta materiais prontos de um curso
 */
export async function countReadyMaterials(courseId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .schema('mentoria')
    .from('materials')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', courseId)
    .eq('status', 'ready');

  if (error) {
    console.error('Erro ao contar materiais:', error);
    return 0;
  }

  return count || 0;
}
