import { DatabaseServiceFactory } from './database/factory'
import type { Job, JobInsert, JobUpdate } from './types/database'

// Wrapper para mantener compatibilidad con el código existente
export class JobsService {
  // Obtener todos los trabajos
  static async getAllJobs(): Promise<Job[]> {
    const service = DatabaseServiceFactory.getJobsService()
    return service.getAllJobs()
  }

  // Obtener trabajos por categoría
  static async getJobsByCategory(category: string): Promise<Job[]> {
    const service = DatabaseServiceFactory.getJobsService()
    return service.getJobsByCategory(category)
  }

  // Obtener un trabajo por ID
  static async getJobById(id: string): Promise<Job | null> {
    const service = DatabaseServiceFactory.getJobsService()
    return service.getJobById(id)
  }

  // Crear un nuevo trabajo
  static async createJob(job: JobInsert): Promise<Job> {
    const service = DatabaseServiceFactory.getJobsService()
    return service.createJob(job)
  }

  // Actualizar un trabajo
  static async updateJob(id: string, updates: JobUpdate): Promise<Job> {
    const service = DatabaseServiceFactory.getJobsService()
    return service.updateJob(id, updates)
  }

  // Eliminar un trabajo
  static async deleteJob(id: string): Promise<void> {
    const service = DatabaseServiceFactory.getJobsService()
    return service.deleteJob(id)
  }

  // Obtener todas las categorías únicas
  static async getCategories(): Promise<string[]> {
    const service = DatabaseServiceFactory.getJobsService()
    return service.getCategories()
  }
} 