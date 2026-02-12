import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = 'mariaandreacastilloarregui@gmail.com'
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || 'fallback-secret-admin'
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 días
const encoder = new TextEncoder()

function base64ToUint8(base64: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

async function verifyToken(token: string) {
  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [timestampStr, signatureB64] = parts
  const timestamp = Number(timestampStr)
  if (!timestamp || Number.isNaN(timestamp)) return false

  const now = Date.now()
  if (now - timestamp > TOKEN_TTL_MS) return false

  const message = `${ADMIN_EMAIL}:${timestamp}`

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(TOKEN_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  const signatureBytes = base64ToUint8(signatureB64)
  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    signatureBytes,
    encoder.encode(message)
  )

  return isValid
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Solo protegemos rutas distintas al formulario de login
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (pathname === '/admin') {
      return NextResponse.next()
    }

    // Obtener token de Authorization Bearer o cookie
    const authHeader = request.headers.get('authorization')
    const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
    const cookieToken = request.cookies.get('admin_token')?.value
    const token = bearer || cookieToken

    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    const valid = await verifyToken(token)
    if (!valid) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
