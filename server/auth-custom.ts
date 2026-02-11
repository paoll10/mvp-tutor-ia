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
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Por favor, forneça email e senha' }
  }

  // Normaliza o email
  const normalizedEmail = email.toLowerCase().trim()

  try {
    const supabase = await createClient()
    
    // Verifica se consegue conectar ao Supabase
    if (!supabase) {
      console.error('❌ Erro: Supabase client não inicializado')
      return { error: 'Erro de conexão. Verifique as variáveis de ambiente.' }
    }

    // Busca o usuário na tabela customizada
    const { data: user, error: userError } = await supabase
      .schema('mentoria')
      .from('users')
      .select('id, email, password_hash, role, full_name')
      .eq('email', normalizedEmail)
      .maybeSingle()

    // Log detalhado para debug
    console.log('\n' + '='.repeat(60))
    console.log('🔍 TENTATIVA DE LOGIN')
    console.log('='.repeat(60))
    console.log('Email:', normalizedEmail)
    console.log('Usuário encontrado:', user ? '✅ Sim' : '❌ Não')
    
    if (userError) {
      console.error('❌ Erro do Supabase:', userError)
      console.error('Código:', userError.code)
      console.error('Mensagem:', userError.message)
      console.error('Detalhes:', userError.details)
      console.log('='.repeat(60) + '\n')
      
      // Mensagens de erro específicas
      if (userError.code === 'PGRST116' || userError.message?.includes('No rows')) {
        return { error: 'Email ou senha incorretos' }
      }
      
      if (userError.message?.includes('relation') || userError.message?.includes('does not exist')) {
        return { error: 'Tabela não encontrada. Execute: atualizar_tabela_users.sql no Supabase' }
      }
      
      if (userError.message?.includes('schema') || userError.message?.includes('permission')) {
        return { error: 'Schema não encontrado. Execute: atualizar_tabela_users.sql no Supabase' }
      }
      
      return { error: `Erro ao buscar usuário: ${userError.message || 'Erro desconhecido'}` }
    }

    if (!user) {
      console.error('❌ Usuário não encontrado no banco de dados')
      console.log('='.repeat(60) + '\n')
      return { error: 'Email ou senha incorretos' }
    }

    console.log('✅ Usuário encontrado:', {
      id: user.id,
      email: user.email,
      role: user.role,
      temHash: !!user.password_hash,
      tamanhoHash: user.password_hash?.length || 0
    })

    // Verifica se tem hash de senha
    if (!user.password_hash) {
      console.error('❌ Hash de senha não encontrado')
      console.log('='.repeat(60) + '\n')
      return { error: 'Senha não configurada. Execute: criar_login_simples.sql no Supabase' }
    }

    if (user.password_hash.length < 20) {
      console.error('❌ Hash de senha inválido (muito curto)')
      console.log('='.repeat(60) + '\n')
      return { error: 'Hash de senha inválido. Execute: criar_login_simples.sql no Supabase' }
    }

    // Verifica a senha usando bcrypt
    console.log('🔐 Verificando senha...')
    let isValidPassword = false
    
    try {
      isValidPassword = await bcrypt.compare(password, user.password_hash)
      console.log('Resultado:', isValidPassword ? '✅ Senha válida' : '❌ Senha inválida')
    } catch (bcryptError: any) {
      console.error('❌ Erro ao comparar senha:', bcryptError)
      console.log('='.repeat(60) + '\n')
      return { error: 'Erro ao verificar senha. Tente novamente.' }
    }

    if (!isValidPassword) {
      console.log('='.repeat(60) + '\n')
      return { error: 'Email ou senha incorretos' }
    }

    // Cria sessão usando cookies
    console.log('🍪 Criando sessão...')
    const cookieStore = await cookies()
    const sessionToken = generateSessionToken()
    
    // Salva a sessão
    cookieStore.set('custom_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    })

    // Salva dados do usuário no cookie
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    }
    
    cookieStore.set('user_data', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    console.log('✅ Sessão criada com sucesso!')
    console.log('Redirecionando para:', user.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard')
    console.log('='.repeat(60) + '\n')

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
    console.error('\n' + '='.repeat(60))
    console.error('❌ ERRO CRÍTICO NO LOGIN')
    console.error('='.repeat(60))
    console.error('Erro:', err.message)
    console.error('Stack:', err.stack)
    console.error('='.repeat(60) + '\n')
    
    // Mensagens de erro mais específicas
    if (err.message?.includes('relation') || err.message?.includes('does not exist')) {
      return { error: 'Tabela não encontrada. Execute: atualizar_tabela_users.sql no Supabase SQL Editor' }
    }
    
    if (err.message?.includes('schema')) {
      return { error: 'Schema "mentoria" não encontrado. Execute: atualizar_tabela_users.sql no Supabase SQL Editor' }
    }
    
    if (err.message?.includes('connection') || err.message?.includes('network')) {
      return { error: 'Erro de conexão com o banco de dados. Verifique as variáveis de ambiente.' }
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
