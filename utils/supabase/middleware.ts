import { NextResponse, type NextRequest } from 'next/server'

// Rotas públicas (não precisam de autenticação)
const PUBLIC_ROUTES = ['/login', '/auth', '/forgot-password', '/reset-password']

// Interface para usuário customizado
interface CustomUser {
  id: string
  email: string
  role: 'mentor' | 'aluno'
  full_name: string | null
}

/**
 * Obtém o usuário atual dos cookies
 */
function getCurrentUser(request: NextRequest): CustomUser | null {
  const userData = request.cookies.get('user_data')
  
  if (!userData?.value) {
    return null
  }

  try {
    return JSON.parse(userData.value) as CustomUser
  } catch {
    return null
  }
}

export async function updateSession(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname
    
    // Verifica se é rota pública
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route)) || pathname === '/'
    
    // Obtém o usuário dos cookies
    const user = getCurrentUser(request)
    
    // Se NÃO houver usuário logado
    if (!user) {
      // E a rota NÃO for pública → redireciona para login
      if (!isPublicRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }
      // Se for rota pública, permite acesso
      return NextResponse.next({ request })
    }
    
    // Se HOUVER usuário logado
    
    // Se está tentando acessar login → redireciona para dashboard correto
    if (pathname.startsWith('/login') || pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = user.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard'
      return NextResponse.redirect(url)
    }
    
    // Se está tentando acessar área do mentor mas é aluno → redireciona
    if (pathname.startsWith('/mentor') && user.role !== 'mentor') {
      const url = request.nextUrl.clone()
      url.pathname = '/student/dashboard'
      return NextResponse.redirect(url)
    }
    
    // Se está tentando acessar área do aluno mas é mentor → redireciona
    if (pathname.startsWith('/student') && user.role !== 'aluno') {
      const url = request.nextUrl.clone()
      url.pathname = '/mentor/dashboard'
      return NextResponse.redirect(url)
    }
    
    // Permite acesso
    return NextResponse.next({ request })
  } catch (error) {
    console.error('Erro no middleware:', error)
    // Em caso de erro, redireciona para login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
}
