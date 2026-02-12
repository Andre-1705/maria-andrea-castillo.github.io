import { DatabaseConfig } from '../types/database'

// Configuración segura que no falla en Vercel
const defaultConfig: DatabaseConfig = {
  type: 'supabase', // Cambiar a Supabase por defecto (más estable)
  connectionString: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
}

// Función para obtener la configuración actual (simple y segura para Vercel)
export function getDatabaseConfig(): DatabaseConfig {
  // Siempre usar Supabase en producción
  return {
    type: 'supabase',
    connectionString: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    options: {
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    }
  }
}

// Función para validar la configuración (simple)
export function validateDatabaseConfig(config: DatabaseConfig): boolean {
  // Solo validar que existan las variables de Supabase
  return !!(config.connectionString && config.options?.anonKey)
} 