'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

// Interface para usuário customizado
export interface CustomUser {
  id: string
  email: string
  role: 'mentor' | 'aluno'
  full_name: string | null
}

/**
 * Faz login usando a tabela customizada de usuários
 */
export async function loginCustom(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Por favor, forneça email e senha' }
  }

  try {
    // Normaliza o email
    const normalizedEmail = email.toLowerCase().trim()
    
    // Busca o usuário na tabela customizada
    const { data: user, error: userError } = await supabase
      .schema('mentoria')
      .from('users')
      .select('id, email, password_hash, role, full_name')
      .eq('email', normalizedEmail)
      .maybeSingle()

    // Log para debug
    console.log('🔍 Buscando usuário:', normalizedEmail)
    
    if (userError) {
      console.error('❌ Erro ao buscar usuário:', userError)
      // Se o erro for de schema/tabela não encontrada, retorna mensagem específica
      if (userError.message?.includes('does not exist') || userError.message?.includes('schema')) {
        return { error: 'Tabela de usuários não encontrada. Execute o SQL de criação primeiro.' }
      }
      return { error: `Erro ao buscar usuário: ${userError.message}` }
    }

    if (!user) {
      console.error('❌ Usuário não encontrado:', normalizedEmail)
      return { error: 'Email ou senha incorretos' }
    }

    console.log('✅ Usuário encontrado:', user.email, user.role)

    // Verifica se tem hash de senha
    if (!user.password_hash || user.password_hash.length < 20) {
      console.error('❌ Hash de senha inválido para usuário:', user.email)
      return { error: 'Senha não configurada corretamente. Execute o SQL de criação de usuários.' }
    }

    // Verifica a senha usando bcrypt
    const isValidPassword = await verifyPassword(password, user.password_hash)

    console.log('🔐 Verificação de senha:', isValidPassword ? '✅ Válida' : '❌ Inválida')

    if (!isValidPassword) {
      return { error: 'Email ou senha incorretos' }
    }

    // Cria sessão usando cookies
    const cookieStore = await cookies()
    const sessionToken = generateSessionToken()
    
    // Salva a sessão (você pode criar uma tabela de sessões se quiser)
    cookieStore.set('custom_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    })

    // Salva dados do usuário no cookie (criptografado seria melhor)
    cookieStore.set('user_data', JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    revalidatePath('/', 'layout')
    revalidatePath('/mentor/dashboard', 'layout')
    revalidatePath('/student/dashboard', 'layout')

    // Redireciona baseado no role
    if (user.role === 'mentor') {
      redirect('/mentor/dashboard')
    } else if (user.role === 'aluno') {
      redirect('/student/dashboard')
    } else {
      redirect('/login')
    }
  } catch (err: any) {
    console.error('❌ Erro no login customizado:', err)
    console.error('Stack:', err.stack)
    
    // Mensagens de erro mais específicas
    if (err.message?.includes('relation') || err.message?.includes('does not exist')) {
      return { error: 'Tabela de usuários não encontrada. Execute o SQL de criação primeiro.' }
    }
    
    if (err.message?.includes('schema')) {
      return { error: 'Schema "mentoria" não encontrado. Execute o SQL de criação primeiro.' }
    }
    
    return { error: `Erro ao fazer login: ${err.message || 'Erro desconhecido'}` }
  }
}

/**
 * Verifica a senha usando bcrypt
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash)
  } catch (err) {
    console.error('Erro ao verificar senha:', err)
    return false
  }
}

/**
 * Gera um token de sessão
 */
function generateSessionToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

/**
 * Obtém o usuário atual da sessão customizada
 */
export async function getCurrentCustomUser(): Promise<CustomUser | null> {
  const cookieStore = await cookies()
  const userData = cookieStore.get('user_data')
  
  if (!userData?.value) {
    return null
  }

  try {
    return JSON.parse(userData.value) as CustomUser
  } catch {
    return null
  }
}

/**
 * Faz logout
 */
export async function logoutCustom() {
  const cookieStore = await cookies()
  cookieStore.delete('custom_session')
  cookieStore.delete('user_data')
  revalidatePath('/', 'layout')
  redirect('/login')
}
