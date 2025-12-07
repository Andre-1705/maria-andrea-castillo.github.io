import { NextRequest, NextResponse } from 'next/server'

// Credenciales permitidas
const ADMIN_CREDENTIALS = {
  email: 'mariaandreacastilloarregui@gmail.com',
  password: 'admin123'
}

// Se usa un secreto para firmar el token. Si no hay env, se cae al password.
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || 'fallback-secret-admin'
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 días

const encoder = new TextEncoder()

async function sign(message: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(TOKEN_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  return bufferToBase64(signature)
}

function bufferToBase64(buffer: ArrayBuffer) {
  // Compatible con runtime edge / node sin Buffer
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('📧 Intento de login con email:', email)

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos', success: false },
        { status: 400 }
      )
    }

    const isValidEmail = email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase()
    const isValidPassword = password === ADMIN_CREDENTIALS.password

    console.log('🔐 Email válido:', isValidEmail, 'Password válida:', isValidPassword)

    if (!isValidEmail || !isValidPassword) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos', success: false },
        { status: 401 }
      )
    }

    // Crear token firmado: payload usa email fijo + timestamp
    const timestamp = Date.now()
    const message = `${ADMIN_CREDENTIALS.email}:${timestamp}`
    const signature = await sign(message)
    const token = `${timestamp}.${signature}`

    console.log('✅ Login exitoso para:', email)

    const response = NextResponse.json(
      { 
        success: true,
        token,
        email,
        message: 'Autenticación exitosa'
      },
      { status: 200 }
    )

    // Set cookie httpOnly para que el middleware pueda validar
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: TOKEN_TTL_MS / 1000,
    })

    // (Opcional) guardar email para UI si se quiere leer en cliente
    response.cookies.set('admin_email', ADMIN_CREDENTIALS.email, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: TOKEN_TTL_MS / 1000,
    })

    return response
  } catch (error: any) {
    console.error('❌ Error en login:', error?.message || error)
    return NextResponse.json(
      { error: 'Error del servidor: ' + (error?.message || 'Unknown'), success: false },
      { status: 500 }
    )
  }
}
