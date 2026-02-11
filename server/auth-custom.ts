'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

/**
 * Faz login usando a tabela customizada de usuários
 */
export async function loginCustom(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string // 'mentor' ou 'aluno'

  if (!email || !password) {
    return { error: 'Por favor, forneça email e senha' }
  }

  if (!role || !['mentor', 'aluno'].includes(role)) {
    return { error: 'Por favor, selecione um perfil (Mentor ou Aluno)' }
  }

  try {
    // Busca o usuário na tabela customizada
    const { data: user, error: userError } = await supabase
      .schema('mentoria')
      .from('users')
      .select('id, email, password_hash, role, full_name')
      .eq('email', email.toLowerCase().trim())
      .eq('role', role)
      .single()

    if (userError || !user) {
      return { error: 'Email ou senha incorretos' }
    }

    // Verifica a senha usando a função SQL
    const { data: isValid, error: verifyError } = await supabase.rpc('verify_password', {
      p_password: password,
      p_hash: user.password_hash
    })

    if (verifyError || !isValid) {
      return { error: 'Email ou senha incorretos' }
    }

    // Cria uma sessão customizada usando cookies
    const cookieStore = await cookies()
    cookieStore.set('custom_user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })
    cookieStore.set('custom_user_role', user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })
    cookieStore.set('custom_user_email', user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    revalidatePath('/', 'layout')

    // Redireciona para o dashboard correto
    if (user.role === 'mentor') {
      redirect('/mentor/dashboard')
    } else {
      redirect('/student/dashboard')
    }
  } catch (err: any) {
    console.error('Erro no login customizado:', err)
    return { error: 'Erro ao fazer login. Tente novamente.' }
  }
}

/**
 * Cria um novo usuário na tabela customizada
 */
export async function signupCustom(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string
  const fullName = formData.get('full_name') as string | null

  if (!email || !password) {
    return { error: 'Por favor, forneça email e senha' }
  }

  if (!role || !['mentor', 'aluno'].includes(role)) {
    return { error: 'Por favor, selecione um perfil (Mentor ou Aluno)' }
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
    // Hash da senha usando a função SQL
    const { data: passwordHash, error: hashError } = await supabase.rpc('hash_password', {
      p_password: password
    })

    if (hashError || !passwordHash) {
      return { error: 'Erro ao processar senha. Tente novamente.' }
    }

    // Insere o usuário na tabela customizada
    const { error: insertError } = await supabase
      .schema('mentoria')
      .from('users')
      .insert({
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        role: role,
        full_name: fullName || email.split('@')[0],
      })

    if (insertError) {
      if (insertError.code === '23505') {
        return { error: 'Este email já está cadastrado' }
      }
      return { error: insertError.message }
    }

    revalidatePath('/', 'layout')
    
    // Faz login automaticamente após criar conta
    return await loginCustom(formData)
  } catch (err: any) {
    console.error('Erro ao criar usuário:', err)
    return { error: 'Erro ao criar conta. Tente novamente.' }
  }
}
