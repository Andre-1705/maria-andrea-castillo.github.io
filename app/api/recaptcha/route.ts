import { NextRequest, NextResponse } from 'next/server'

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn('⚠️ RECAPTCHA_SECRET_KEY no está configurado')
    return true // Si no está configurado, permitimos
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    })

    const data = await response.json()
    console.log('🔐 reCAPTCHA response:', {
      success: data.success,
      score: data.score,
      action: data.action,
    })

    // Retornar true si el score es >= 0.5 (< 0.5 es probablemente spam)
    return data.success && data.score >= 0.5
  } catch (error) {
    console.error('❌ Error verificando reCAPTCHA:', error)
    return true // Si hay error, permitimos para no bloquear usuarios legítimos
  }
}

export async function POST(req: NextRequest) {
  console.log('🔍 Endpoint de verificación de reCAPTCHA llamado')

  try {
    const { recaptchaToken } = await req.json()

    if (!recaptchaToken) {
      console.warn('⚠️ No se recibió token de reCAPTCHA')
      return NextResponse.json(
        { valid: true, reason: 'No token provided, but allowing' },
        { status: 200 }
      )
    }

    const isValid = await verifyRecaptcha(recaptchaToken)

    if (!isValid) {
      console.warn('❌ Verificación de reCAPTCHA falló')
      return NextResponse.json(
        { valid: false, error: 'reCAPTCHA verification failed' },
        { status: 403 }
      )
    }

    console.log('✅ reCAPTCHA válido')
    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('💥 Error en endpoint de reCAPTCHA:', error)
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
