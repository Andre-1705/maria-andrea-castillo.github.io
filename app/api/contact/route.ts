import { NextRequest, NextResponse } from 'next/server'
import { ClientsService } from '@/lib/clients-service'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, email, phone, company, message } = data

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 })
    }

    // Guardar en la base de datos
    await ClientsService.createClient({
      name,
      email,
      phone,
      company,
      message,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en el endpoint de contacto:', error)
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
} 