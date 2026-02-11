'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Please provide both email and password' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    revalidatePath('/', 'layout')
    
    // Tenta buscar o profile, mas não quebra se der erro
    try {
      const { data: profile, error: profileError } = await supabase
        .schema('mentoria')
        .from('profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .maybeSingle() // Usa maybeSingle() em vez de single() para não dar erro se não encontrar

      // Se tem profile e não há erro, redireciona para o dashboard correto
      if (profile && !profileError && profile.role) {
        if (profile.role === 'mentor') {
          redirect('/mentor/dashboard')
        } else if (profile.role === 'aluno') {
          redirect('/student/dashboard')
        }
      }
    } catch (err: any) {
      // Ignora erro silenciosamente - o middleware vai tratar
      console.error('Erro ao buscar profile (não crítico):', err?.message || err)
    }
    
    // Sempre redireciona para raiz - o middleware vai verificar o profile e redirecionar
    redirect('/')
  } else {
    revalidatePath('/', 'layout')
    redirect('/')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string

  if (!email || !password) {
    return { error: 'Por favor, forneça email e senha' }
  }

  // Converte 'student' para 'aluno' e 'mentor' para 'mentor'
  const profileRole = role === 'mentor' ? 'mentor' : 'aluno'

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: profileRole, // Passa o role no user_metadata
        full_name: email.split('@')[0], // Nome padrão baseado no email
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // O trigger no banco cria o profile automaticamente
  // Mas vamos verificar se foi criado (caso o trigger não tenha executado)
  if (data.user) {
    // Aguarda um pouco para o trigger executar
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Verifica se o profile foi criado
    const { data: profile } = await supabase
      .schema('mentoria')
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single()

    // Se não foi criado, cria manualmente
    if (!profile) {
      await supabase
        .schema('mentoria')
        .from('profiles')
        .insert({
          user_id: data.user.id,
          role: profileRole,
          full_name: email.split('@')[0],
        })
    }
  }

  revalidatePath('/', 'layout')
  
  // Se o email foi confirmado automaticamente, redireciona
  if (data.user?.email_confirmed_at) {
    redirect('/')
  }
  
  // Caso contrário, pede para verificar o email
  return { success: 'Verifique seu email para confirmar a conta.' }
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const origin = (await headers()).get('origin')

  if (!email) {
    return { error: 'Please provide an email' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Check your email for the password reset link.' }
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  
  if (!password) {
    return { error: 'Please provide a password' }
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/login?message=password_updated')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
