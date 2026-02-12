import { NextRequest, NextResponse } from "next/server"
import { JobsService } from "@/lib/jobs-service"
import jobsData from "@/app/jobs/jobs-data"
import jobsDbJson from "@/lib/jobs-db.json"

export async function GET(req: NextRequest) {
  try {
    // Primero obtener trabajos de Supabase (viene como array)
    let dbJobsArray: any[] = []
    try {
      dbJobsArray = await JobsService.getAllJobs()
    } catch (error) {
      console.error("Error fetching jobs from DB:", error)
    }
    
    // Combinar trabajos: primero los subidos localmente, luego los de BD
    const combined: Record<string, any[]> = {}
    
    // 1. Cargar trabajos subidos localmente desde jobs-db.json
    try {
      const uploadedJobs = jobsDbJson as Record<string, any[]>
      
      for (const category in uploadedJobs) {
        if (!combined[category]) {
          combined[category] = []
        }
        combined[category] = [...uploadedJobs[category]]
      }
    } catch (e) {
      console.log("Error loading jobs-db.json:", e)
    }
    
    // 2. Agregar trabajos de la base de datos (agrupar por categoría)
    if (Array.isArray(dbJobsArray) && dbJobsArray.length > 0) {
      for (const job of dbJobsArray) {
        const category = job.category || 'Otros'
        if (!combined[category]) {
          combined[category] = []
        }
        combined[category].push(job)
      }
    }
    
    // 3. Si no hay trabajos, usar fallback de jobsData
    if (Object.keys(combined).length === 0) {
      console.log("Usando datos del archivo JSON como fallback")
      // jobsData viene como array, necesitamos agruparlo
      const fallback: Record<string, any[]> = {}
      for (const job of jobsData) {
        const category = job.category || 'Otros'
        if (!fallback[category]) {
          fallback[category] = []
        }
        fallback[category].push(job)
      }
      return NextResponse.json(fallback)
    }
    
    return NextResponse.json(combined)
  } catch (error) {
    console.error("Error in jobs GET:", error)
    // Si todo falla, devolver jobsData agrupado
    const fallback: Record<string, any[]> = {}
    for (const job of jobsData) {
      const category = job.category || 'Otros'
      if (!fallback[category]) {
        fallback[category] = []
      }
      fallback[category].push(job)
    }
    return NextResponse.json(fallback)
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const job = await JobsService.createJob(data)
    return NextResponse.json({ success: true, job })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error al crear el trabajo' }, { status: 400 })
  }
} 