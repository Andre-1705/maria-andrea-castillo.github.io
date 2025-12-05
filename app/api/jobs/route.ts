import { NextRequest, NextResponse } from "next/server"
import { JobsService } from "@/lib/jobs-service"
import jobsData from "@/app/jobs/jobs-data"
import fs from "fs/promises"
import path from "path"

export async function GET(req: NextRequest) {
  try {
    // Intentar obtener trabajos de la base de datos
    const jobs = await JobsService.getAllJobs()
    
    // Combinar con trabajos subidos recientemente
    try {
      const jobsDbPath = path.join(process.cwd(), 'lib', 'jobs-db.json')
      const data = await fs.readFile(jobsDbPath, 'utf-8')
      const uploadedJobs = JSON.parse(data)
      
      // Combinar trabajos
      const combined: Record<string, any[]> = { ...jobs }
      for (const category in uploadedJobs) {
        if (combined[category]) {
          combined[category] = [...uploadedJobs[category], ...combined[category]]
        } else {
          combined[category] = uploadedJobs[category]
        }
      }
      return NextResponse.json(combined)
    } catch (e) {
      // Si no existe jobs-db, solo devolver los de la BD
      return NextResponse.json(jobs)
    }
  } catch (error) {
    // Si falla, devolver los datos del archivo JSON
    console.log("Usando datos del archivo JSON como fallback")
    return NextResponse.json(jobsData)
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