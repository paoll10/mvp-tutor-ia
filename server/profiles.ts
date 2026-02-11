'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type UserRole = 'mentor' | 'aluno'

export interface Profile {
  user_id: string
  role: UserRole
  full_name: string | null
  created_at: string
}

/**
 * Verifica se o usuário atual tem um profile cadastrado
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .schema('mentoria')
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !profile) {
    return null
  }

  return profile as Profile
}

/**
 * Verifica se o usuário tem profile (retorna boolean)
 */
export async function hasProfile(): Promise<boolean> {
  const profile = await getProfile()
  return profile !== null
}

/**
 * Cria o profile do usuário com o role selecionado
 */
export async function createProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Usuário não autenticado' }
  }

  const role = formData.get('role') as UserRole
  const fullName = formData.get('full_name') as string | null

  if (!role || !['mentor', 'aluno'].includes(role)) {
    return { error: 'Selecione um perfil válido (Mentor ou Aluno)' }
  }

  // Verifica se já existe profile
  const existingProfile = await getProfile()
  if (existingProfile) {
    return { error: 'Você já possui um perfil cadastrado' }
  }

  // Cria o profile
  const { error } = await supabase
    .schema('mentoria')
    .from('profiles')
    .insert({
      user_id: user.id,
      role: role,
      full_name: fullName || user.user_metadata?.full_name || user.email?.split('@')[0] || null,
    })

  if (error) {
    console.error('Erro ao criar profile:', error)
    console.error('Detalhes do erro:', JSON.stringify(error, null, 2))
    
    // Mensagem de erro mais específica
    let errorMessage = 'Erro ao criar perfil. Tente novamente.'
    
    if (error.code === '23505') {
      errorMessage = 'Você já possui um perfil cadastrado.'
    } else if (error.code === '42501' || error.message.includes('permission')) {
      errorMessage = 'Erro de permissão. Verifique as políticas RLS no Supabase.'
    } else if (error.message) {
      errorMessage = `Erro: ${error.message}`
    }
    
    return { error: errorMessage }
  }

  revalidatePath('/', 'layout')
  
  // Redireciona baseado no role
  if (role === 'mentor') {
    redirect('/mentor/dashboard')
  } else {
    redirect('/student/dashboard')
  }
}

/**
 * Retorna a URL de redirecionamento baseada no role do usuário
 */
export async function getRedirectByRole(): Promise<string> {
  const profile = await getProfile()
  
  if (!profile) {
    return '/onboarding'
  }

  if (profile.role === 'mentor') {
    return '/mentor/dashboard'
  }

  return '/student/dashboard'
}

