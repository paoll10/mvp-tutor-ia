'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Student {
  user_id: string
  email: string
  full_name: string | null
  role: 'aluno'
  created_at: string
}

/**
 * Cria um novo aluno (usuário + profile)
 */
export async function createStudent(formData: FormData) {
  const supabase = await createClient()
  
  // Verifica se o usuário atual é mentor
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Usuário não autenticado' }
  }

  const { data: profile } = await supabase
    .schema('mentoria')
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!profile || profile.role !== 'mentor') {
    return { error: 'Apenas mentores podem criar alunos' }
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string | null

  if (!email || !password) {
    return { error: 'Email e senha são obrigatórios' }
  }

  // Valida formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: 'Email inválido' }
  }

  // Valida senha (mínimo 6 caracteres)
  if (password.length < 6) {
    return { error: 'Senha deve ter no mínimo 6 caracteres' }
  }

  try {
    // Cria o usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'aluno',
          full_name: fullName || email.split('@')[0],
        },
        emailRedirectTo: undefined, // Não envia email de confirmação
      },
    })

    if (authError) {
      // Se o usuário já existe, tenta fazer login para verificar
      if (authError.message.includes('already registered')) {
        return { error: 'Este email já está cadastrado' }
      }
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: 'Erro ao criar usuário' }
    }

    // Aguarda um pouco para o trigger executar (se existir)
    await new Promise(resolve => setTimeout(resolve, 500))

    // Verifica se o profile foi criado pelo trigger
    const { data: existingProfile } = await supabase
      .schema('mentoria')
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single()

    // Se não foi criado, cria manualmente
    if (!existingProfile) {
      const { error: profileError } = await supabase
        .schema('mentoria')
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          role: 'aluno',
          full_name: fullName || email.split('@')[0],
        })

      if (profileError) {
        console.error('Erro ao criar profile:', profileError)
        return { error: 'Erro ao criar perfil do aluno' }
      }
    }

    // Nota: Para confirmar email automaticamente, você precisa:
    // 1. Desabilitar confirmação de email no Supabase (Settings → Auth → Email Provider)
    // 2. Ou usar service_role key (não recomendado no frontend)
    // Por enquanto, o aluno precisará confirmar o email ou você pode desabilitar a confirmação

    revalidatePath('/mentor/students')
    
    return { 
      success: 'Aluno criado com sucesso!',
      student: {
        email,
        full_name: fullName || email.split('@')[0],
      }
    }
  } catch (error: any) {
    console.error('Erro ao criar aluno:', error)
    return { error: error.message || 'Erro ao criar aluno' }
  }
}

/**
 * Lista todos os alunos
 */
export async function listStudents(): Promise<Student[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  // Verifica se é mentor
  const { data: profile } = await supabase
    .schema('mentoria')
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!profile || profile.role !== 'mentor') {
    return []
  }

  // Busca todos os alunos usando a view (que inclui email)
  const { data: students, error } = await supabase
    .schema('mentoria')
    .from('students_with_email')
    .select('user_id, email, full_name, role, created_at')
    .order('created_at', { ascending: false })

  if (error || !students) {
    // Se a view não existir, tenta buscar sem email
    const { data: studentsWithoutEmail } = await supabase
      .schema('mentoria')
      .from('profiles')
      .select('user_id, role, full_name, created_at')
      .eq('role', 'aluno')
      .order('created_at', { ascending: false })

    if (!studentsWithoutEmail) {
      return []
    }

    return studentsWithoutEmail.map(student => ({
      ...student,
      email: 'Ver no Dashboard',
    })) as Student[]
  }

  return students as Student[]
}

/**
 * Deleta um aluno
 */
export async function deleteStudent(userId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Usuário não autenticado' }
  }

  // Verifica se é mentor
  const { data: profile } = await supabase
    .schema('mentoria')
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!profile || profile.role !== 'mentor') {
    return { error: 'Apenas mentores podem deletar alunos' }
  }

  // Deleta apenas o profile (o usuário permanece no auth)
  // Para deletar o usuário completamente, você precisa usar service_role
  const { error } = await supabase
    .schema('mentoria')
    .from('profiles')
    .delete()
    .eq('user_id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/mentor/students')
  return { success: 'Aluno deletado com sucesso' }
}
