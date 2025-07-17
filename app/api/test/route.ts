import { NextResponse } from 'next/server'
import { getDatabaseConfig } from '@/lib/database/config'

export async function GET() {
  try {
    const config = getDatabaseConfig()
    
    // No mostrar información sensible en producción
    const safeConfig = {
      type: config.type,
      host: config.host,
      port: config.port,
      database: config.database,
      hasUsername: !!config.username,
      hasPassword: !!config.password,
      hasConnectionString: !!config.connectionString,
      hasAnonKey: !!config.options?.anonKey
    }
    
    return NextResponse.json({
      success: true,
      config: safeConfig,
      env: {
        DATABASE_TYPE: process.env.DATABASE_TYPE,
        NODE_ENV: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasPostgresHost: !!process.env.POSTGRES_HOST,
        hasPostgresPassword: !!process.env.POSTGRES_PASSWORD
      }
    })
  } catch (error) {
    console.error('Error en endpoint de prueba:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
} 