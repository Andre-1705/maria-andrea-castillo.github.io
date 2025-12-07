import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Protección de rutas admin - verificar token en ambos ambientes
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    // Obtener token del header Authorization (que envía el cliente)
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    // También verificar en cookies como fallback
    const cookieToken = request.cookies.get('admin_token')?.value

    // Rutas que requieren autenticación (excluir la página de login)
    if (pathname !== '/admin' && !token && !cookieToken) {
      console.log('🔒 [MIDDLEWARE] Acceso denegado a', pathname)
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
