import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConfig } from '@/lib/database/config'

export async function GET(req: NextRequest) {
  console.log('🔍 Endpoint de diagnóstico llamado')

  const config = getDatabaseConfig()
  
  return NextResponse.json({
    message: 'Diagnóstico de configuración',
    databaseType: process.env.DATABASE_TYPE,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ No configurado',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ No configurado',
    config: {
      type: config.type,
      isSupabaseValid: !!(config.connectionString && config.options?.anonKey)
    }
  })
}
