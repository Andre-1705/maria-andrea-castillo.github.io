import { NextRequest, NextResponse } from "next/server"
import { JobsService } from "@/lib/jobs-service"

export async function GET(req: NextRequest) {
  // Obtener todos los trabajos
  const jobs = await JobsService.getAllJobs()
  return NextResponse.json(jobs)
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