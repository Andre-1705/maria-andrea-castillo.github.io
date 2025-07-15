import { DatabaseConfig } from '../types/database'

// Configuración por defecto
const defaultConfig: DatabaseConfig = {
  type: 'postgresql', // Cambiado a PostgreSQL por defecto
  // Configuración para PostgreSQL
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DATABASE || 'portfolio',
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  // Configuración para Supabase
  connectionString: process.env.NEXT_PUBLIC_SUPABASE_URL,
  // Configuración para MongoDB
  // host: process.env.MONGODB_HOST || 'localhost',
  // port: parseInt(process.env.MONGODB_PORT || '27017'),
  // database: process.env.MONGODB_DATABASE || 'portfolio',
  // username: process.env.MONGODB_USERNAME,
  // password: process.env.MONGODB_PASSWORD,
  // Configuración para MySQL
  // host: process.env.MYSQL_HOST || 'localhost',
  // port: parseInt(process.env.MYSQL_PORT || '3306'),
  // database: process.env.MYSQL_DATABASE || 'portfolio',
  // username: process.env.MYSQL_USERNAME,
  // password: process.env.MYSQL_PASSWORD,
  // Configuración para SQLite
  // database: process.env.SQLITE_DATABASE || './database.sqlite',
}

// Función para obtener la configuración actual
export function getDatabaseConfig(): DatabaseConfig {
  const dbType = process.env.DATABASE_TYPE || defaultConfig.type
  
  switch (dbType) {
    case 'postgresql':
      return {
        type: 'postgresql',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        database: process.env.POSTGRES_DATABASE || 'portfolio',
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        options: {
          ssl: process.env.POSTGRES_SSL === 'true',
          connectionString: process.env.POSTGRES_CONNECTION_STRING
        }
      }
    
    case 'supabase':
      return {
        type: 'supabase',
        connectionString: process.env.NEXT_PUBLIC_SUPABASE_URL,
        options: {
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      }
    
    case 'mongodb':
      return {
        type: 'mongodb',
        host: process.env.MONGODB_HOST || 'localhost',
        port: parseInt(process.env.MONGODB_PORT || '27017'),
        database: process.env.MONGODB_DATABASE || 'portfolio',
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      }
    
    case 'mysql':
      return {
        type: 'mysql',
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        database: process.env.MYSQL_DATABASE || 'portfolio',
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        options: {
          dialect: 'mysql'
        }
      }
    
    case 'sqlite':
      return {
        type: 'sqlite',
        database: process.env.SQLITE_DATABASE || './database.sqlite',
        options: {
          dialect: 'sqlite',
          storage: process.env.SQLITE_DATABASE || './database.sqlite'
        }
      }
    
    default:
      return defaultConfig
  }
}

// Función para validar la configuración
export function validateDatabaseConfig(config: DatabaseConfig): boolean {
  switch (config.type) {
    case 'postgresql':
      return !!(config.host && config.database && config.username && config.password)
    
    case 'supabase':
      return !!(config.connectionString && config.options?.anonKey)
    
    case 'mongodb':
      return !!(config.host && config.database)
    
    case 'mysql':
      return !!(config.host && config.database && config.username && config.password)
    
    case 'sqlite':
      return !!config.database
    
    default:
      return false
  }
} 