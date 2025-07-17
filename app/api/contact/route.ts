import { NextRequest, NextResponse } from 'next/server'
import { ClientsService } from '@/lib/clients-service'
import { getDatabaseConfig } from '@/lib/database/config'

export async function POST(req: NextRequest) {
  console.log('🔍 Endpoint de contacto llamado')
  
  try {
    const data = await req.json()
    console.log('📝 Datos recibidos:', JSON.stringify(data))
    
    const { name, email, phone, company, message } = data

    if (!name || !email || !phone || !message) {
      console.log('❌ Faltan campos obligatorios')
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 })
    }

    console.log('🔧 Configuración de base de datos:', getDatabaseConfig().type)

    // Guardar en la base de datos
    console.log('💾 Intentando guardar en la base de datos...')
    const result = await ClientsService.createClient({
      name,
      email,
      phone,
      company,
      message,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    
    console.log('✅ Datos guardados exitosamente:', result)

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

    console.log('🎉 Respuesta exitosa enviada')
    return NextResponse.json({ success: true, message: messageDb })
  } catch (error) {
    console.error('💥 Error en el endpoint de contacto:', error)
    console.error('💥 Stack trace:', error instanceof Error ? error.stack : 'No stack trace available')
    
    // Devolver más detalles del error en desarrollo
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    const errorDetails = process.env.NODE_ENV === 'development' ? errorMessage : 'Error interno del servidor.'
    
    return NextResponse.json({ 
      error: errorDetails,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
} 