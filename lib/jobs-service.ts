import { supabase } from './supabase'
import type { Database } from './supabase'

type Job = Database['public']['Tables']['jobs']['Row']
type JobInsert = Database['public']['Tables']['jobs']['Insert']
type JobUpdate = Database['public']['Tables']['jobs']['Update']

export class JobsService {
  // Obtener todos los trabajos
  static async getAllJobs(): Promise<Job[]> {
    const { data, error } = await supabase
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
  static async getJobsByCategory(category: string): Promise<Job[]> {
    const { data, error } = await supabase
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
  static async getJobById(id: string): Promise<Job | null> {
    const { data, error } = await supabase
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
  static async createJob(job: JobInsert): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single()

    if (error) {
      console.error('Error creating job:', error)
      throw error
    }

    return data
  }

  // Actualizar un trabajo
  static async updateJob(id: string, updates: JobUpdate): Promise<Job> {
    const { data, error } = await supabase
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
  static async deleteJob(id: string): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting job:', error)
      throw error
    }
  }

  // Obtener todas las categorías únicas
  static async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
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