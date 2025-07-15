import 'dotenv/config'
import fs from 'fs'
import path from 'path'
// @ts-ignore
import csv from 'csv-parser'
import { JobsService } from '../lib/jobs-service'

console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST)
console.log('POSTGRES_DATABASE:', process.env.POSTGRES_DATABASE)
console.log('POSTGRES_USERNAME:', process.env.POSTGRES_USERNAME)
console.log('POSTGRES_PASSWORD:', process.env.POSTGRES_PASSWORD)
console.log('DATABASE_TYPE:', process.env.DATABASE_TYPE)

async function migrateJobs() {
  console.log('🚀 Iniciando migración de trabajos desde jobs-data.csv...')

  const jobs: any[] = []
  const csvPath = path.join(__dirname, '../jobs-data.csv')

  // Leer el CSV y guardar los datos en un array
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row: any) => jobs.push(row))
      .on('end', resolve)
      .on('error', reject)
  })

  console.log(`🔎 Total de trabajos a migrar: ${jobs.length}`)

  for (const job of jobs) {
    try {
      console.log(`⏳ Insertando: ${job.title}`)
      await JobsService.createJob({
        id: job.id,
        title: job.title,
        description: job.description,
        image: job.image,
        video: job.video,
        link: job.link,
        category: job.category,
        created_at: job.created_at || new Date().toISOString(),
        updated_at: job.updated_at || new Date().toISOString(),
      })
      console.log(`✅ Trabajo migrado: ${job.title}`)
    } catch (error) {
      console.error(`❌ Error migrando trabajo ${job.title}:`, error)
    }
  }

  console.log('🎉 Migración completada exitosamente!')
}

if (require.main === module) {
  migrateJobs()
}

export { migrateJobs } 