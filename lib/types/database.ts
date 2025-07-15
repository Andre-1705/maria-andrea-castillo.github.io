// Tipos comunes para todas las bases de datos
export interface Job {
  id: string
  title: string
  description: string
  image: string
  video?: string
  link: string
  category: string
  created_at: string
  updated_at: string
}

export interface JobInsert {
  id?: string
  title: string
  description: string
  image: string
  video?: string
  link: string
  category: string
  created_at?: string
  updated_at?: string
}

export interface JobUpdate {
  id?: string
  title?: string
  description?: string
  image?: string
  video?: string
  link?: string
  category?: string
  created_at?: string
  updated_at?: string
}

export interface ContactSubmission {
  id: string | number
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  status: 'pending' | 'contacted' | 'completed' | 'rejected' | 'unread'
  created_at: string
  updated_at?: string
}

export interface ContactSubmissionInsert {
  id?: string | number
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  status?: 'pending' | 'contacted' | 'completed' | 'rejected' | 'unread'
  created_at?: string
  updated_at?: string
}

export interface ContactSubmissionUpdate {
  id?: string | number
  name?: string
  email?: string
  phone?: string
  company?: string
  message?: string
  status?: 'pending' | 'contacted' | 'completed' | 'rejected' | 'unread'
  created_at?: string
  updated_at?: string
}

// Interfaces para los servicios de base de datos
export interface IJobsService {
  getAllJobs(): Promise<Job[]>
  getJobsByCategory(category: string): Promise<Job[]>
  getJobById(id: string): Promise<Job | null>
  createJob(job: JobInsert): Promise<Job>
  updateJob(id: string, updates: JobUpdate): Promise<Job>
  deleteJob(id: string): Promise<void>
  getCategories(): Promise<string[]>
}

export interface IClientsService {
  getAllClients(): Promise<ContactSubmission[]>
  getClientsByStatus(status: ContactSubmission['status']): Promise<ContactSubmission[]>
  getClientById(id: string): Promise<ContactSubmission | null>
  createClient(client: ContactSubmissionInsert): Promise<ContactSubmission>
  updateClient(id: string, updates: ContactSubmissionUpdate): Promise<ContactSubmission>
  deleteClient(id: string): Promise<void>
  updateClientStatus(id: string, status: ContactSubmission['status']): Promise<ContactSubmission>
  getClientStats(): Promise<{
    total: number
    pending: number
    contacted: number
    completed: number
    rejected: number
  }>
}

// Configuración de base de datos
export interface DatabaseConfig {
  type: 'postgresql' | 'supabase' | 'mongodb' | 'mysql' | 'sqlite'
  connectionString?: string
  host?: string
  port?: number
  database?: string
  username?: string
  password?: string
  options?: Record<string, any>
} 