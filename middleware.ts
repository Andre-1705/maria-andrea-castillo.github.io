import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Rutas que necesitan protección
  if (pathname.startsWith('/admin/dashboard')) {
    // En desarrollo, permitir acceso; en producción, verificar token
    if (process.env.NODE_ENV === 'production') {
      const token = request.cookies.get('admin_token')?.value
      
      if (!token) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
