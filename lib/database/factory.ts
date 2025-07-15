import { IJobsService, IClientsService } from '../types/database'
import { getDatabaseConfig, validateDatabaseConfig } from './config'
import { SupabaseJobsService, SupabaseClientsService } from './supabase'
import { PostgreSQLJobsService, PostgreSQLClientsService } from './postgresql'

// Factory para crear servicios de base de datos
export class DatabaseServiceFactory {
  private static jobsService: IJobsService | null = null
  private static clientsService: IClientsService | null = null

  // Obtener el servicio de trabajos
  static getJobsService(): IJobsService {
    if (this.jobsService) {
      return this.jobsService
    }

    const config = getDatabaseConfig()
    
    if (!validateDatabaseConfig(config)) {
      throw new Error(`Configuración de base de datos inválida para tipo: ${config.type}`)
    }

    switch (config.type) {
      case 'postgresql':
        this.jobsService = new PostgreSQLJobsService()
        break
      case 'supabase':
        this.jobsService = new SupabaseJobsService()
        break
      // MongoDB eliminado
      default:
        throw new Error(`Tipo de base de datos no soportado: ${config.type}`)
    }

    return this.jobsService
  }

  // Obtener el servicio de clientes
  static getClientsService(): IClientsService {
    if (this.clientsService) {
      return this.clientsService
    }

    const config = getDatabaseConfig()
    
    if (!validateDatabaseConfig(config)) {
      throw new Error(`Configuración de base de datos inválida para tipo: ${config.type}`)
    }

    switch (config.type) {
      case 'postgresql':
        this.clientsService = new PostgreSQLClientsService()
        break
      case 'supabase':
        this.clientsService = new SupabaseClientsService()
        break
      // MongoDB eliminado
      default:
        throw new Error(`Tipo de base de datos no soportado: ${config.type}`)
    }

    return this.clientsService
  }

  // Reiniciar los servicios (útil para cambiar de base de datos)
  static resetServices(): void {
    this.jobsService = null
    this.clientsService = null
  }

  // Obtener información de la base de datos actual
  static getCurrentDatabaseInfo(): { type: string; config: any } {
    const config = getDatabaseConfig()
    return {
      type: config.type,
      config: {
        host: config.host,
        database: config.database,
        port: config.port
      }
    }
  }
} 