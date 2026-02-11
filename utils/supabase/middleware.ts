import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Rotas públicas (não precisam de autenticação)
const PUBLIC_ROUTES = ['/login', '/auth', '/forgot-password', '/reset-password']

// Rotas que não precisam de profile (mas precisam de autenticação)
const NO_PROFILE_ROUTES = ['/onboarding', '/auth']

export async function updateSession(request: NextRequest) {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Variáveis de ambiente não configuradas')
      // Se não tiver variáveis, permite acesso às rotas públicas
      const pathname = request.nextUrl.pathname
      const PUBLIC_ROUTES = ['/login', '/auth', '/forgot-password', '/reset-password']
      const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route)) || pathname === '/'
      
      if (!isPublicRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }
      
      return NextResponse.next({ request })
    }

    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

  // Verifica se há sessão customizada (login via tabela)
  const customUserId = request.cookies.get('custom_user_id')?.value
  const customUserRole = request.cookies.get('custom_user_role')?.value as 'mentor' | 'aluno' | undefined

  // Se houver sessão customizada, redireciona direto para o dashboard
  if (customUserId && customUserRole) {
    if (pathname.startsWith('/login') || pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = customUserRole === 'mentor' ? '/mentor/dashboard' : '/student/dashboard'
      return NextResponse.redirect(url)
    }
    // Permite acesso às rotas do role correto
    if (customUserRole === 'mentor' && pathname.startsWith('/mentor')) {
      return supabaseResponse
    }
    if (customUserRole === 'aluno' && (pathname.startsWith('/student') || pathname.startsWith('/student-course'))) {
      return supabaseResponse
    }
    // Se tentar acessar rota de outro role, redireciona para o dashboard correto
    if ((customUserRole === 'mentor' && !pathname.startsWith('/mentor')) || 
        (customUserRole === 'aluno' && !pathname.startsWith('/student') && !pathname.startsWith('/student-course'))) {
      const url = request.nextUrl.clone()
      url.pathname = customUserRole === 'mentor' ? '/mentor/dashboard' : '/student/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // IMPORTANT: You *must* run the getUser method in the middleware
  // to maintain auth session (refreshing tokens, etc.)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Se NÃO houver usuário (nem customizado nem Supabase Auth)
  if (!user && !customUserId) {
    // E a rota NÃO for pública
    if (!isPublicRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  const isOnboarding = pathname.startsWith('/onboarding')
  const isNoProfileRoute = NO_PROFILE_ROUTES.some(route => pathname.startsWith(route))

  // Se já está no onboarding, permite acesso (evita loop)
  if (isOnboarding) {
    return supabaseResponse
  }

  // Se HOUVER usuário logado
  // Verifica se tem profile cadastrado
  let profile: { role: string } | null = null
  let hasProfile = false
  
  try {
    const { data, error } = await supabase
      .schema('mentoria')
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erro ao buscar profile:', error)
      // Se o schema não existir, permite acesso ao onboarding
      if (error.message?.includes('schema') || error.message?.includes('does not exist')) {
        // Não redireciona aqui, apenas permite que continue
        hasProfile = false
        profile = null
      }
    } else if (data) {
      profile = data
      hasProfile = true
    }
  } catch (err) {
    console.error('Erro ao verificar profile:', err)
    // Em caso de erro, permite acesso ao onboarding
    hasProfile = false
    profile = null
  }

  // Se NÃO tem profile e NÃO está no onboarding → vai pro onboarding
  if (!hasProfile && !isNoProfileRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/onboarding'
    return NextResponse.redirect(url)
  }

  // Se TEM profile e está no onboarding → vai pro dashboard correto
  if (hasProfile && profile && isOnboarding) {
    const url = request.nextUrl.clone()
    url.pathname = profile.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard'
    return NextResponse.redirect(url)
  }

  // Se está tentando acessar login/raiz e já está logado com profile
  if (hasProfile && profile && (pathname.startsWith('/login') || pathname === '/')) {
    const url = request.nextUrl.clone()
    url.pathname = profile.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard'
    return NextResponse.redirect(url)
  }

    return supabaseResponse
  } catch (error) {
    console.error('Erro no middleware:', error)
    // Em caso de erro, tenta redirecionar para login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
}
