'use server'

import { createClient } from '@supabase/supabase-js'
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
 * Cria cliente Supabase direto
 */
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Variáveis de ambiente do Supabase não configuradas')
  }

  return createClient(url, key)
}

/**
 * Faz login usando a tabela customizada de usuários
 */
export async function loginCustom(formData: FormData) {
  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString()

  // Validação básica
  if (!email || !password) {
    return { error: 'Por favor, forneça email e senha' }
  }

  const normalizedEmail = email.toLowerCase()

  try {
    // Cria cliente Supabase
    const supabase = getSupabaseClient()

    // Busca usuário - tenta sem schema primeiro, depois com schema
    let user: any = null
    let userError: any = null

    // Tenta com schema mentoria
    const result1 = await supabase
      .schema('mentoria')
      .from('users')
      .select('id, email, password_hash, role, full_name')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (result1.data) {
      user = result1.data
    } else if (result1.error) {
      userError = result1.error
      
      // Se erro de schema, tenta sem schema
      if (result1.error.message?.includes('schema') || result1.error.message?.includes('does not exist')) {
        console.log('⚠️ Tentando sem schema...')
        const result2 = await supabase
          .from('users')
          .select('id, email, password_hash, role, full_name')
          .eq('email', normalizedEmail)
          .maybeSingle()
        
        if (result2.data) {
          user = result2.data
          userError = null
        } else if (result2.error) {
          userError = result2.error
        }
      }
    }

    // Se não encontrou usuário
    if (!user) {
      if (userError) {
        console.error('Erro ao buscar usuário:', userError.message)
        
        if (userError.message?.includes('relation') || userError.message?.includes('does not exist')) {
          return { error: 'Tabela não encontrada. Execute atualizar_tabela_users.sql no Supabase' }
        }
        
        if (userError.message?.includes('schema')) {
          return { error: 'Schema não encontrado. Execute atualizar_tabela_users.sql no Supabase' }
        }
      }
      
      return { error: 'Email ou senha incorretos' }
    }

    // Verifica hash de senha
    if (!user.password_hash || typeof user.password_hash !== 'string' || user.password_hash.length < 20) {
      return { error: 'Senha não configurada. Execute criar_login_simples.sql no Supabase' }
    }

    // Verifica senha com bcrypt
    let isValidPassword = false
    try {
      isValidPassword = await bcrypt.compare(password, user.password_hash)
    } catch (bcryptErr) {
      console.error('Erro ao verificar senha:', bcryptErr)
      return { error: 'Erro ao verificar senha. Tente novamente.' }
    }

    if (!isValidPassword) {
      return { error: 'Email ou senha incorretos' }
    }

    // Cria sessão
    const cookieStore = await cookies()
    
    // Token de sessão
    const sessionToken = `${Date.now()}-${Math.random().toString(36).substring(2)}`
    cookieStore.set('custom_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    })

    // Dados do usuário
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name || null,
    }
    
    cookieStore.set('user_data', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    // Revalida rotas
    revalidatePath('/', 'layout')
    revalidatePath('/mentor/dashboard', 'layout')
    revalidatePath('/student/dashboard', 'layout')

    // Redireciona
    if (user.role === 'mentor') {
      redirect('/mentor/dashboard')
    } else if (user.role === 'aluno') {
      redirect('/student/dashboard')
    } else {
      redirect('/login')
    }
  } catch (err: any) {
    console.error('Erro crítico no login:', err)
    
    // Mensagens de erro específicas
    const errorMessage = err.message || 'Erro desconhecido'
    
    if (errorMessage.includes('Variáveis de ambiente')) {
      return { error: 'Configuração incompleta. Verifique as variáveis de ambiente na Vercel.' }
    }
    
    if (errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
      return { error: 'Tabela não encontrada. Execute atualizar_tabela_users.sql no Supabase SQL Editor.' }
    }
    
    if (errorMessage.includes('schema')) {
      return { error: 'Schema não encontrado. Execute atualizar_tabela_users.sql no Supabase SQL Editor.' }
    }
    
    return { error: `Erro: ${errorMessage}` }
  }
}

/**
 * Obtém o usuário atual da sessão customizada
 */
export async function getCurrentCustomUser(): Promise<CustomUser | null> {
  try {
    const cookieStore = await cookies()
    const userData = cookieStore.get('user_data')
    
    if (!userData?.value) {
      return null
    }

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
