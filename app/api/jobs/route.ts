import { NextRequest, NextResponse } from "next/server"
import { JobsService } from "@/lib/jobs-service"
import jobsData from "@/app/jobs/jobs-data"

export async function GET(req: NextRequest) {
  try {
    // Intentar obtener trabajos de la base de datos
    const jobs = await JobsService.getAllJobs()
    return NextResponse.json(jobs)
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