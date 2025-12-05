// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import { IJobsService, IClientsService, Job, JobInsert, JobUpdate, ContactSubmission, ContactSubmissionInsert, ContactSubmissionUpdate } from '../types/database'
import { getDatabaseConfig } from './config'

// Solo inicializa Supabase si el tipo es 'supabase'
let supabase: ReturnType<typeof createClient> | null = null
const config = getDatabaseConfig()
if (config.type === 'supabase') {
  const supabaseUrl = config.connectionString!
  const supabaseAnonKey = config.options!.anonKey!
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

function getSupabase() {
  if (!supabase) throw new Error('Supabase no está configurado. Verifica tu DATABASE_TYPE.')
  return supabase
}

// Implementación de JobsService para Supabase
export class SupabaseJobsService implements IJobsService {
  // Obtener todos los trabajos
  async getAllJobs(): Promise<Job[]> {
    const { data, error } = await getSupabase()
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching jobs:', error)
      throw error
    }

    return data || []
  }

  // Obtener trabajos por categoría
  async getJobsByCategory(category: string): Promise<Job[]> {
    const { data, error } = await getSupabase()
      .from('jobs')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching jobs by category:', error)
      throw error
    }

    return data || []
  }

  // Obtener un trabajo por ID
  async getJobById(id: string): Promise<Job | null> {
    const { data, error } = await getSupabase()
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching job by id:', error)
      throw error
    }

    return data
  }

  // Crear un nuevo trabajo
  async createJob(job: JobInsert): Promise<Job> {
    const { data, error } = await getSupabase()
      .from('jobs')
      .insert([job])
      .select()
      .single()

    if (error) {
      console.error('Error creating job:', error)
      throw error
    }

    return data
  }

  // Actualizar un trabajo
  async updateJob(id: string, updates: JobUpdate): Promise<Job> {
    const { data, error } = await getSupabase()
      .from('jobs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating job:', error)
      throw error
    }

    return data
  }

  // Eliminar un trabajo
  async deleteJob(id: string): Promise<void> {
    const { error } = await getSupabase()
      .from('jobs')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting job:', error)
      throw error
    }
  }

  // Obtener todas las categorías únicas
  async getCategories(): Promise<string[]> {
    const { data, error } = await getSupabase()
      .from('jobs')
      .select('category')
      .order('category')

    if (error) {
      console.error('Error fetching categories:', error)
      throw error
    }

    const categories = [...new Set(data?.map(job => job.category) || [])]
    return categories
  }
}

// Implementación de ClientsService para Supabase
export class SupabaseClientsService implements IClientsService {
  // Obtener todos los contactos
  async getAllClients(): Promise<ContactSubmission[]> {
    const { data, error } = await getSupabase()
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contacts:', error)
      throw error
    }

    return data || []
  }

  // Obtener contactos por estado
  async getClientsByStatus(status: ContactSubmission['status']): Promise<ContactSubmission[]> {
    const { data, error } = await getSupabase()
      .from('contact_submissions')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contacts by status:', error)
      throw error
    }

    return data || []
  }

  // Obtener un contacto por ID
  async getClientById(id: string): Promise<ContactSubmission | null> {
    const { data, error } = await getSupabase()
      .from('contact_submissions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching contact:', error)
      throw error
    }

    return data
  }

  // Crear un nuevo contacto
  async createClient(client: ContactSubmissionInsert): Promise<ContactSubmission> {
    const { name, email, phone, company, message, status } = client;
    const insertObj: any = { 
      name, 
      email, 
      phone, 
      company, 
      message,
      status: status || 'pending' // Default a 'pending' si no se especifica
    };
    const { data, error } = await getSupabase()
      .from('contact_submissions')
      .insert(insertObj)
      .select()
      .single()

    if (error) {
      console.error('Error creating contact:', JSON.stringify(error), error)
      throw error
    }

    return data
  }

  // Actualizar un contacto
  async updateClient(id: string, updates: ContactSubmissionUpdate): Promise<ContactSubmission> {
    const { data, error } = await getSupabase()
      .from('contact_submissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating contact:', error)
      throw error
    }

    return data
  }

  // Eliminar un contacto
  async deleteClient(id: string): Promise<void> {
    const { error } = await getSupabase()
      .from('contact_submissions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting contact:', error)
      throw error
    }
  }

  // Cambiar estado de un contacto
  async updateClientStatus(id: string, status: ContactSubmission['status']): Promise<ContactSubmission> {
    return this.updateClient(id, { status })
  }

  // Obtener estadísticas de contactos
  async getClientStats(): Promise<{
    total: number
    pending: number
    contacted: number
    completed: number
    rejected: number
  }> {
    const { data, error } = await getSupabase()
      .from('contact_submissions')
      .select('status')

    if (error) {
      console.error('Error fetching contact stats:', error)
      throw error
    }

    const contacts = data || []
    const stats = {
      total: contacts.length,
      pending: contacts.filter(c => c.status === 'pending').length,
      contacted: contacts.filter(c => c.status === 'contacted').length,
      completed: contacts.filter(c => c.status === 'completed').length,
      rejected: contacts.filter(c => c.status === 'rejected').length,
    }

    return stats
  }
} 