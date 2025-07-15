import { Pool, PoolClient } from 'pg'
import { IJobsService, IClientsService, Job, JobInsert, JobUpdate, ContactSubmission, ContactSubmissionInsert, ContactSubmissionUpdate } from '../types/database'
import { getDatabaseConfig } from './config'

// Pool de conexiones PostgreSQL
let pool: Pool | null = null

// Función para obtener la conexión a PostgreSQL
function getPostgreSQLPool(): Pool {
  if (pool) return pool

  const config = getDatabaseConfig()
  
  pool = new Pool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.username,
    password: config.password,
    ssl: config.options?.ssl || false,
    max: 20, // máximo de conexiones en el pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })

  return pool
}

// Función para ejecutar queries
async function executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
  const client = await getPostgreSQLPool().connect()
  
  try {
    const result = await client.query(query, params)
    return result.rows
  } finally {
    client.release()
  }
}

// Función para ejecutar una sola fila
async function executeQuerySingle<T>(query: string, params: any[] = []): Promise<T | null> {
  const results = await executeQuery<T>(query, params)
  return results.length > 0 ? results[0] : null
}

// Implementación de JobsService para PostgreSQL
export class PostgreSQLJobsService implements IJobsService {
  // Obtener todos los trabajos
  async getAllJobs(): Promise<Job[]> {
    const query = `
      SELECT id, title, description, image, video, link, category, 
             created_at, updated_at
      FROM jobs 
      ORDER BY created_at DESC
    `
    return executeQuery<Job>(query)
  }

  // Obtener trabajos por categoría
  async getJobsByCategory(category: string): Promise<Job[]> {
    const query = `
      SELECT id, title, description, image, video, link, category, 
             created_at, updated_at
      FROM jobs 
      WHERE category = $1
      ORDER BY created_at DESC
    `
    return executeQuery<Job>(query, [category])
  }

  // Obtener un trabajo por ID
  async getJobById(id: string): Promise<Job | null> {
    const query = `
      SELECT id, title, description, image, video, link, category, 
             created_at, updated_at
      FROM jobs 
      WHERE id = $1
    `
    return executeQuerySingle<Job>(query, [id])
  }

  // Crear un nuevo trabajo
  async createJob(job: JobInsert): Promise<Job> {
    const query = `
      INSERT INTO jobs (id, title, description, image, video, link, category, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, title, description, image, video, link, category, created_at, updated_at
    `
    
    const now = new Date().toISOString()
    const params = [
      job.id || Date.now().toString(),
      job.title,
      job.description,
      job.image,
      job.video || null,
      job.link,
      job.category,
      job.created_at || now,
      job.updated_at || now
    ]
    
    const result = await executeQuerySingle<Job>(query, params)
    if (!result) {
      throw new Error('Error al crear el trabajo')
    }
    
    return result
  }

  // Actualizar un trabajo
  async updateJob(id: string, updates: JobUpdate): Promise<Job> {
    const setClauses: string[] = []
    const params: any[] = []
    let paramIndex = 1

    // Construir dinámicamente la query de actualización
    if (updates.title !== undefined) {
      setClauses.push(`title = $${paramIndex++}`)
      params.push(updates.title)
    }
    if (updates.description !== undefined) {
      setClauses.push(`description = $${paramIndex++}`)
      params.push(updates.description)
    }
    if (updates.image !== undefined) {
      setClauses.push(`image = $${paramIndex++}`)
      params.push(updates.image)
    }
    if (updates.video !== undefined) {
      setClauses.push(`video = $${paramIndex++}`)
      params.push(updates.video)
    }
    if (updates.link !== undefined) {
      setClauses.push(`link = $${paramIndex++}`)
      params.push(updates.link)
    }
    if (updates.category !== undefined) {
      setClauses.push(`category = $${paramIndex++}`)
      params.push(updates.category)
    }

    // Siempre actualizar updated_at
    setClauses.push(`updated_at = $${paramIndex++}`)
    params.push(new Date().toISOString())

    // Agregar el ID al final
    params.push(id)

    const query = `
      UPDATE jobs 
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, title, description, image, video, link, category, created_at, updated_at
    `
    
    const result = await executeQuerySingle<Job>(query, params)
    if (!result) {
      throw new Error('Trabajo no encontrado')
    }
    
    return result
  }

  // Eliminar un trabajo
  async deleteJob(id: string): Promise<void> {
    const query = 'DELETE FROM jobs WHERE id = $1'
    const result = await executeQuery(query, [id])
    
    if (result.length === 0) {
      throw new Error('Trabajo no encontrado')
    }
  }

  // Obtener todas las categorías únicas
  async getCategories(): Promise<string[]> {
    const query = 'SELECT DISTINCT category FROM jobs ORDER BY category'
    const results = await executeQuery<{category: string}>(query)
    return results.map(row => row.category)
  }
}

// Implementación de ClientsService para PostgreSQL
export class PostgreSQLClientsService implements IClientsService {
  // Obtener todos los contactos
  async getAllClients(): Promise<ContactSubmission[]> {
    const query = `
      SELECT id, name, email, phone, company, message, status, 
             created_at, updated_at
      FROM contact_submissions 
      ORDER BY created_at DESC
    `
    return executeQuery<ContactSubmission>(query)
  }

  // Obtener contactos por estado
  async getClientsByStatus(status: ContactSubmission['status']): Promise<ContactSubmission[]> {
    const query = `
      SELECT id, name, email, phone, company, message, status, 
             created_at, updated_at
      FROM contact_submissions 
      WHERE status = $1
      ORDER BY created_at DESC
    `
    return executeQuery<ContactSubmission>(query, [status])
  }

  // Obtener un contacto por ID
  async getClientById(id: string): Promise<ContactSubmission | null> {
    const query = `
      SELECT id, name, email, phone, company, message, status, 
             created_at, updated_at
      FROM contact_submissions 
      WHERE id = $1
    `
    return executeQuerySingle<ContactSubmission>(query, [id])
  }

  // Crear un nuevo contacto
  async createClient(client: ContactSubmissionInsert): Promise<ContactSubmission> {
    const query = `
      INSERT INTO contact_submissions (id, name, email, phone, company, message, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, email, phone, company, message, status, created_at, updated_at
    `
    
    const now = new Date().toISOString()
    const params = [
      client.id || Date.now().toString(),
      client.name,
      client.email,
      client.phone || null,
      client.company || null,
      client.message,
      client.status || 'pending',
      client.created_at || now
    ]
    
    const result = await executeQuerySingle<ContactSubmission>(query, params)
    if (!result) {
      throw new Error('Error al crear el contacto')
    }
    
    return result
  }

  // Actualizar un contacto
  async updateClient(id: string, updates: ContactSubmissionUpdate): Promise<ContactSubmission> {
    const setClauses: string[] = []
    const params: any[] = []
    let paramIndex = 1

    // Construir dinámicamente la query de actualización
    if (updates.name !== undefined) {
      setClauses.push(`name = $${paramIndex++}`)
      params.push(updates.name)
    }
    if (updates.email !== undefined) {
      setClauses.push(`email = $${paramIndex++}`)
      params.push(updates.email)
    }
    if (updates.phone !== undefined) {
      setClauses.push(`phone = $${paramIndex++}`)
      params.push(updates.phone)
    }
    if (updates.company !== undefined) {
      setClauses.push(`company = $${paramIndex++}`)
      params.push(updates.company)
    }
    if (updates.message !== undefined) {
      setClauses.push(`message = $${paramIndex++}`)
      params.push(updates.message)
    }
    if (updates.status !== undefined) {
      setClauses.push(`status = $${paramIndex++}`)
      params.push(updates.status)
    }

    // Siempre actualizar updated_at
    setClauses.push(`updated_at = $${paramIndex++}`)
    params.push(new Date().toISOString())

    // Agregar el ID al final
    params.push(id)

    const query = `
      UPDATE contact_submissions 
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, name, email, phone, company, message, status, created_at, updated_at
    `
    
    const result = await executeQuerySingle<ContactSubmission>(query, params)
    if (!result) {
      throw new Error('Contacto no encontrado')
    }
    
    return result
  }

  // Eliminar un contacto
  async deleteClient(id: string): Promise<void> {
    const query = 'DELETE FROM contact_submissions WHERE id = $1'
    const result = await executeQuery(query, [id])
    
    if (result.length === 0) {
      throw new Error('Contacto no encontrado')
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
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
      FROM contact_submissions
    `
    
    const result = await executeQuerySingle<{
      total: string
      pending: string
      contacted: string
      completed: string
      rejected: string
    }>(query)
    
    if (!result) {
      return { total: 0, pending: 0, contacted: 0, completed: 0, rejected: 0 }
    }
    
    return {
      total: parseInt(result.total),
      pending: parseInt(result.pending),
      contacted: parseInt(result.contacted),
      completed: parseInt(result.completed),
      rejected: parseInt(result.rejected)
    }
  }
}

// Función para cerrar la conexión
export async function closePostgreSQLConnection() {
  if (pool) {
    await pool.end()
    pool = null
  }
} 