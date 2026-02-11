import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // Redirect to next step (e.g. /reset-password)
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Also handle the "code" param which is sometimes sent by Supabase (e.g. OAuth)
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  
  // Se houver erro na URL (do Google), redireciona com o erro
  if (errorParam) {
    console.error('\n' + '='.repeat(60))
    console.error('❌ ERRO DO GOOGLE OAUTH')
    console.error('='.repeat(60))
    console.error('Erro:', errorParam)
    console.error('Descrição:', errorDescription)
    console.error('='.repeat(60) + '\n')
    
    return NextResponse.redirect(new URL(`/login?error=oauth_error&message=${encodeURIComponent(errorDescription || errorParam)}`, request.url))
  }
  
  if (code) {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('\n' + '='.repeat(60))
      console.error('❌ VARIÁVEIS DE AMBIENTE NÃO CONFIGURADAS')
      console.error('='.repeat(60))
      console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ FALTANDO')
      console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ FALTANDO')
      console.error('='.repeat(60) + '\n')
      
      return NextResponse.redirect(new URL('/login?error=config_error&message=Variáveis de ambiente não configuradas', request.url))
    }
    
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        // Log do erro para debug
        console.error('\n' + '='.repeat(60))
        console.error('❌ ERRO AO TROCAR CÓDIGO POR SESSÃO (OAuth)')
        console.error('='.repeat(60))
        console.error('\n🔴 ERRO:')
        console.error(JSON.stringify(error, null, 2))
        console.error('\n📋 CODE RECEBIDO:')
        console.error(code.substring(0, 50) + '...')
        console.error('\n🌐 URL COMPLETA:')
        console.error(request.url)
        console.error('\n🔧 VARIÁVEIS DE AMBIENTE:')
        console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configurado' : 'FALTANDO')
        console.error('='.repeat(60) + '\n')
        
        // Redireciona com o erro específico
        return NextResponse.redirect(new URL(`/login?error=auth_code_error&message=${encodeURIComponent(error.message)}`, request.url))
      }
      
      if (data && data.session) {
        // Log dos dados retornados pelo Google OAuth
        console.log('\n' + '='.repeat(60))
        console.log('✅ LOGIN COM GOOGLE BEM-SUCEDIDO (OAuth)')
        console.log('='.repeat(60))
        console.log('\n🔐 SESSION ID:')
        console.log(data.session.access_token.substring(0, 20) + '...')
        console.log('\n👤 USER ID:')
        console.log(data.user?.id)
        console.log('\n📧 USER EMAIL:')
        console.log(data.user?.email)
        console.log('='.repeat(60) + '\n')
        
        // Redireciona para página que fecha o popup
        return NextResponse.redirect(new URL('/auth/callback/success', request.url))
      }
    } catch (err: any) {
      console.error('\n' + '='.repeat(60))
      console.error('❌ EXCEÇÃO AO PROCESSAR CALLBACK')
      console.error('='.repeat(60))
      console.error('Erro:', err.message)
      console.error('Stack:', err.stack)
      console.error('='.repeat(60) + '\n')
      
      return NextResponse.redirect(new URL(`/login?error=callback_exception&message=${encodeURIComponent(err.message)}`, request.url))
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/login?error=auth_code_error', request.url))
}

