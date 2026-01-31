import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Rotas públicas (não precisam de autenticação)
const PUBLIC_ROUTES = ['/login', '/auth', '/forgot-password', '/reset-password']

// Rotas que não precisam de profile (mas precisam de autenticação)
const NO_PROFILE_ROUTES = ['/onboarding', '/auth']

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

  const pathname = request.nextUrl.pathname

  // Verifica se é rota pública
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route)) || pathname === '/'

  // IMPORTANT: You *must* run the getUser method in the middleware
  // to maintain auth session (refreshing tokens, etc.)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Se NÃO houver usuário
  if (!user) {
    // E a rota NÃO for pública
    if (!isPublicRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // Se HOUVER usuário logado
  // Verifica se tem profile cadastrado
  const { data: profile } = await supabase
    .schema('mentoria')
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  const hasProfile = !!profile
  const isOnboarding = pathname.startsWith('/onboarding')
  const isNoProfileRoute = NO_PROFILE_ROUTES.some(route => pathname.startsWith(route))

  // Se NÃO tem profile e NÃO está no onboarding → vai pro onboarding
  if (!hasProfile && !isNoProfileRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/onboarding'
    return NextResponse.redirect(url)
  }

  // Se TEM profile e está no onboarding → vai pro dashboard correto
  if (hasProfile && isOnboarding) {
    const url = request.nextUrl.clone()
    url.pathname = profile.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard'
    return NextResponse.redirect(url)
  }

  // Se está tentando acessar login/raiz e já está logado com profile
  if (hasProfile && (pathname.startsWith('/login') || pathname === '/')) {
    const url = request.nextUrl.clone()
    url.pathname = profile.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
