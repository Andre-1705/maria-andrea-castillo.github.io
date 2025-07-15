import { DatabaseServiceFactory } from './database/factory'
import type { ContactSubmission, ContactSubmissionInsert, ContactSubmissionUpdate } from './types/database'

// Wrapper para mantener compatibilidad con el código existente
export class ClientsService {
  // Obtener todos los contactos
  static async getAllClients(): Promise<ContactSubmission[]> {
    const service = DatabaseServiceFactory.getClientsService()
    return service.getAllClients()
  }

  // Obtener contactos por estado
  static async getClientsByStatus(status: ContactSubmission['status']): Promise<ContactSubmission[]> {
    const service = DatabaseServiceFactory.getClientsService()
    return service.getClientsByStatus(status)
  }

  // Obtener un contacto por ID
  static async getClientById(id: string): Promise<ContactSubmission | null> {
    const service = DatabaseServiceFactory.getClientsService()
    return service.getClientById(id)
  }

  // Crear un nuevo contacto
  static async createClient(client: ContactSubmissionInsert): Promise<ContactSubmission> {
    const service = DatabaseServiceFactory.getClientsService()
    return service.createClient(client)
  }

  // Actualizar un contacto
  static async updateClient(id: string, updates: ContactSubmissionUpdate): Promise<ContactSubmission> {
    const service = DatabaseServiceFactory.getClientsService()
    return service.updateClient(id, updates)
  }

  // Eliminar un contacto
  static async deleteClient(id: string): Promise<void> {
    const service = DatabaseServiceFactory.getClientsService()
    return service.deleteClient(id)
  }

  // Cambiar estado de un contacto
  static async updateClientStatus(id: string, status: ContactSubmission['status']): Promise<ContactSubmission> {
    const service = DatabaseServiceFactory.getClientsService()
    return service.updateClientStatus(id, status)
  }

  // Obtener estadísticas de contactos
  static async getClientStats(): Promise<{
    total: number
    pending: number
    contacted: number
    completed: number
    rejected: number
  }> {
    const service = DatabaseServiceFactory.getClientsService()
    return service.getClientStats()
  }
} 