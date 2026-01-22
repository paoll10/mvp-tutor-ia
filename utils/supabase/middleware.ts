import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: You *must* run the getUser method in the middleware
  // to maintain auth session (refreshing tokens, etc.)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Se NÃO houver usuário
  if (!user) {
    // E a rota NÃO for pública (login, cadastro, recuperação de senha, auth callback)
    if (
      !request.nextUrl.pathname.startsWith('/login') &&
      !request.nextUrl.pathname.startsWith('/onboarding') && 
      !request.nextUrl.pathname.startsWith('/auth') &&
      !request.nextUrl.pathname.startsWith('/forgot-password') &&
      !request.nextUrl.pathname.startsWith('/reset-password') &&
      request.nextUrl.pathname !== '/'
    ) {
      // Redireciona para login
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  } 
  // Se HOUVER usuário
  else {
    // E tentar acessar a página de login ou a raiz (que redireciona pra login)
    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname === '/') {
      // Redireciona para a home logada (painel do aluno por padrão)
      const url = request.nextUrl.clone()
      url.pathname = '/student/history'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
