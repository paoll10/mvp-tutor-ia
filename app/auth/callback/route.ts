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
  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data) {
      // Log dos dados retornados pelo Google OAuth
      console.log('\n' + '='.repeat(60))
      console.log('📧 DADOS DO LOGIN COM GOOGLE (OAuth)')
      console.log('='.repeat(60))
      console.log('\n🔐 SESSION:')
      console.log(JSON.stringify(data.session, null, 2))
      console.log('\n👤 USER:')
      console.log(JSON.stringify(data.user, null, 2))
      console.log('\n📋 USER METADATA (dados do Google):')
      console.log(JSON.stringify(data.user?.user_metadata, null, 2))
      console.log('\n🆔 IDENTITIES (provedores vinculados):')
      console.log(JSON.stringify(data.user?.identities, null, 2))
      console.log('='.repeat(60) + '\n')
      
      // Redireciona para página que fecha o popup
      return NextResponse.redirect(new URL('/auth/callback/success', request.url))
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/login?error=auth_code_error', request.url))
}

