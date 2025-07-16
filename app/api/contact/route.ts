import { NextRequest, NextResponse } from 'next/server'
import { ClientsService } from '@/lib/clients-service'
import { getDatabaseConfig } from '@/lib/database/config'

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

    // Detectar motor de base de datos
    const dbType = getDatabaseConfig().type
    let messageDb = ''
    if (dbType === 'supabase') {
      messageDb = '¡Inserción exitosa en Supabase!'
    } else if (dbType === 'postgresql') {
      messageDb = '¡Inserción exitosa en PostgreSQL!'
    } else {
      messageDb = '¡Inserción exitosa!'
    }

    return NextResponse.json({ success: true, message: messageDb })
  } catch (error) {
    console.error('Error en el endpoint de contacto:', error)
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
} 