// @ts-nocheck
import { MongoClient, Db, Collection } from 'mongodb'
import { IJobsService, IClientsService, Job, JobInsert, JobUpdate, ContactSubmission, ContactSubmissionInsert, ContactSubmissionUpdate } from '../types/database'
import { getDatabaseConfig } from './config'

// Cliente de MongoDB
let client: MongoClient | null = null
let db: Db | null = null

// Función para conectar a MongoDB
async function connectToMongoDB() {
  if (client) return client

  const config = getDatabaseConfig()
  const connectionString = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`
  
  try {
    client = new MongoClient(connectionString, config.options)
    await client.connect()
    db = client.db(config.database)
    console.log('Conectado a MongoDB')
    return client
  } catch (error) {
    console.error('Error conectando a MongoDB:', error)
    throw error
  }
}

// Función para obtener la colección
async function getCollection(collectionName: string): Promise<Collection> {
  if (!db) {
    await connectToMongoDB()
  }
  return db!.collection(collectionName)
}

// Implementación de JobsService para MongoDB
export class MongoDBJobsService implements IJobsService {
  // Obtener todos los trabajos
  async getAllJobs(): Promise<Job[]> {
    const collection = await getCollection('jobs')
    const jobs = await collection.find({}).sort({ created_at: -1 }).toArray()
    return jobs as Job[]
  }

  // Obtener trabajos por categoría
  async getJobsByCategory(category: string): Promise<Job[]> {
    const collection = await getCollection('jobs')
    const jobs = await collection.find({ category }).sort({ created_at: -1 }).toArray()
    return jobs as Job[]
  }

  // Obtener un trabajo por ID
  async getJobById(id: string): Promise<Job | null> {
    const collection = await getCollection('jobs')
    const job = await collection.findOne({ id })
    return job as Job | null
  }

  // Crear un nuevo trabajo
  async createJob(job: JobInsert): Promise<Job> {
    const collection = await getCollection('jobs')
    const newJob = {
      ...job,
      id: job.id || Date.now().toString(),
      created_at: job.created_at || new Date().toISOString(),
      updated_at: job.updated_at || new Date().toISOString()
    }
    
    const result = await collection.insertOne(newJob)
    return { ...newJob, _id: result.insertedId } as Job
  }

  // Actualizar un trabajo
  async updateJob(id: string, updates: JobUpdate): Promise<Job> {
    const collection = await getCollection('jobs')
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    if (!result) {
      throw new Error('Trabajo no encontrado')
    }
    
    return result as Job
  }

  // Eliminar un trabajo
  async deleteJob(id: string): Promise<void> {
    const collection = await getCollection('jobs')
    const result = await collection.deleteOne({ id })
    
    if (result.deletedCount === 0) {
      throw new Error('Trabajo no encontrado')
    }
  }

  // Obtener todas las categorías únicas
  async getCategories(): Promise<string[]> {
    const collection = await getCollection('jobs')
    const categories = await collection.distinct('category')
    return categories.sort()
  }
}

// Implementación de ClientsService para MongoDB
export class MongoDBClientsService implements IClientsService {
  // Obtener todos los contactos
  async getAllClients(): Promise<ContactSubmission[]> {
    const collection = await getCollection('contact_submissions')
    const contacts = await collection.find({}).sort({ created_at: -1 }).toArray()
    return contacts as ContactSubmission[]
  }

  // Obtener contactos por estado
  async getClientsByStatus(status: ContactSubmission['status']): Promise<ContactSubmission[]> {
    const collection = await getCollection('contact_submissions')
    const contacts = await collection.find({ status }).sort({ created_at: -1 }).toArray()
    return contacts as ContactSubmission[]
  }

  // Obtener un contacto por ID
  async getClientById(id: string): Promise<ContactSubmission | null> {
    const collection = await getCollection('contact_submissions')
    const contact = await collection.findOne({ id })
    return contact as ContactSubmission | null
  }

  // Crear un nuevo contacto
  async createClient(client: ContactSubmissionInsert): Promise<ContactSubmission> {
    const collection = await getCollection('contact_submissions')
    const newContact = {
      ...client,
      id: client.id || Date.now().toString(),
      status: client.status || 'pending',
      created_at: client.created_at || new Date().toISOString()
    }
    
    const result = await collection.insertOne(newContact)
    return { ...newContact, _id: result.insertedId } as ContactSubmission
  }

  // Actualizar un contacto
  async updateClient(id: string, updates: ContactSubmissionUpdate): Promise<ContactSubmission> {
    const collection = await getCollection('contact_submissions')
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    if (!result) {
      throw new Error('Contacto no encontrado')
    }
    
    return result as ContactSubmission
  }

  // Eliminar un contacto
  async deleteClient(id: string): Promise<void> {
    const collection = await getCollection('contact_submissions')
    const result = await collection.deleteOne({ id })
    
    if (result.deletedCount === 0) {
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
    const collection = await getCollection('contact_submissions')
    const contacts = await collection.find({}).toArray()
    
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

// Función para cerrar la conexión
export async function closeMongoDBConnection() {
  if (client) {
    await client.close()
    client = null
    db = null
  }
} 