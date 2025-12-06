import { NextRequest, NextResponse } from 'next/server'

// Credenciales de admin hardcodeadas como fallback
const ADMIN_CREDENTIALS = {
  email: 'mariaandreacastilloarregui@gmail.com',
  password: 'admin123'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('📧 Intento de login con email:', email)

    // Validación básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos', success: false },
        { status: 400 }
      )
    }

    // Verificar credenciales
    const isValidEmail = email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase()
    const isValidPassword = password === ADMIN_CREDENTIALS.password

    console.log('🔐 Email válido:', isValidEmail, 'Password válida:', isValidPassword)

    if (!isValidEmail || !isValidPassword) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos', success: false },
        { status: 401 }
      )
    }

    // Crear token simple
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    console.log('✅ Login exitoso para:', email)

    return NextResponse.json(
      { 
        success: true, 
        token,
        email,
        message: 'Autenticación exitosa'
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('❌ Error en login:', error?.message || error)
    return NextResponse.json(
      { error: 'Error del servidor: ' + (error?.message || 'Unknown'), success: false },
      { status: 500 }
    )
  }
}
