import 'dotenv/config'
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
import fs from 'fs/promises'
import { JobsService } from '../lib/jobs-service'

async function migrateJobs() {
  console.log('🚀 Iniciando migración de trabajos a Supabase...')

  // Leer datos desde jobs-data.json
  let INITIAL_JOBS = {}
  try {
    const data = await fs.readFile('./jobs-data.json', 'utf-8')
    INITIAL_JOBS = JSON.parse(data)
  } catch (err) {
    console.error('❌ No se pudo leer jobs-data.json:', err)
    return
  }

  if (!INITIAL_JOBS || Object.keys(INITIAL_JOBS).length === 0) {
    console.error('❌ No se encontraron datos de ejemplo en jobs-data.json.')
    return
  }

  let total = 0
  for (const [category, jobs] of Object.entries(INITIAL_JOBS)) {
    console.log(`📁 Categoría: ${category} - ${Array.isArray(jobs) ? jobs.length : 0} trabajos`)
    total += Array.isArray(jobs) ? jobs.length : 0
  }
  console.log(`🔎 Total de trabajos a migrar: ${total}`)

  try {
    // Migrar trabajos por categoría
    for (const [category, jobs] of Object.entries(INITIAL_JOBS)) {
      if (!Array.isArray(jobs) || jobs.length === 0) {
        console.warn(`⚠️  No hay trabajos en la categoría: ${category}`)
        continue
      }
      console.log(`➡️  Migrando categoría: ${category}`)
      
      for (const job of jobs as any[]) {
        try {
          console.log(`⏳ Insertando: ${job.title}`)
          await JobsService.createJob({
            id: job.id,
            title: job.title,
            description: job.description,
            image: job.image,
            video: job.video,
            link: job.link,
            category: category,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          console.log(`✅ Trabajo migrado: ${job.title}`)
        } catch (error) {
          console.error(`❌ Error migrando trabajo ${job.title}:`, error)
        }
      }
    }

    console.log('🎉 Migración completada exitosamente!')
  } catch (error) {
    console.error('💥 Error durante la migración:', error)
  }
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
  migrateJobs()
}

export { migrateJobs } 