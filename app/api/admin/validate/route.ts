import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = 'mariaandreacastilloarregui@gmail.com'
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || 'fallback-secret-admin'
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 días
const encoder = new TextEncoder()

function base64ToUint8(base64: string) {
  // Node runtime no tiene atob; usar Buffer cuando esté disponible
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'))
  }
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
  const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(message))

  return isValid
}

export async function GET(request: NextRequest) {
  const cookieToken = request.cookies.get('admin_token')?.value
  if (!cookieToken) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const valid = await verifyToken(cookieToken)
  if (!valid) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  return NextResponse.json({ success: true, email: ADMIN_EMAIL }, { status: 200 })
}
