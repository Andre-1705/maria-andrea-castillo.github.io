import { supabase } from './supabase'
import type { Database } from './supabase'

type Client = Database['public']['Tables']['clients']['Row']
type ClientInsert = Database['public']['Tables']['clients']['Insert']
type ClientUpdate = Database['public']['Tables']['clients']['Update']

export class ClientsService {
  // Obtener todos los clientes
  static async getAllClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching clients:', error)
      throw error
    }

    return data || []
  }

  // Obtener clientes por estado
  static async getClientsByStatus(status: Client['status']): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching clients by status:', error)
      throw error
    }

    return data || []
  }

  // Obtener un cliente por ID
  static async getClientById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching client:', error)
      throw error
    }

    return data
  }

  // Crear un nuevo cliente
  static async createClient(client: ClientInsert): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single()

    if (error) {
      console.error('Error creating client:', error)
      throw error
    }

    return data
  }

  // Actualizar un cliente
  static async updateClient(id: string, updates: ClientUpdate): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating client:', error)
      throw error
    }

    return data
  }

  // Eliminar un cliente
  static async deleteClient(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  }

  // Cambiar estado de un cliente
  static async updateClientStatus(id: string, status: Client['status']): Promise<Client> {
    return this.updateClient(id, { status })
  }

  // Obtener estadísticas de clientes
  static async getClientStats(): Promise<{
    total: number
    pending: number
    contacted: number
    completed: number
    rejected: number
  }> {
    const { data, error } = await supabase
      .from('clients')
      .select('status')

    if (error) {
      console.error('Error fetching client stats:', error)
      throw error
    }

    const clients = data || []
    const stats = {
      total: clients.length,
      pending: clients.filter(c => c.status === 'pending').length,
      contacted: clients.filter(c => c.status === 'contacted').length,
      completed: clients.filter(c => c.status === 'completed').length,
      rejected: clients.filter(c => c.status === 'rejected').length,
    }

    return stats
  }
} 