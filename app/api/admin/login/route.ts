import { NextRequest, NextResponse } from 'next/server'

// Credenciales de admin (en producción, usar Supabase Auth)
const ADMIN_EMAILS = [
  'mariaandreacastilloarregui@gmail.com'
]

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validación básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos', success: false },
        { status: 400 }
      )
    }

    // Verificar credenciales (en producción, usar Supabase Auth)
    const isValidEmail = ADMIN_EMAILS.includes(email.toLowerCase())
    const isValidPassword = password === ADMIN_PASSWORD

    if (!isValidEmail || !isValidPassword) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos', success: false },
        { status: 401 }
      )
    }

    // Crear token simple (en producción, usar JWT)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    return NextResponse.json(
      { 
        success: true, 
        token,
        email,
        message: 'Autenticación exitosa'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error del servidor', success: false },
      { status: 500 }
    )
  }
}
