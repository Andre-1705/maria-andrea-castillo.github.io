import { NextRequest, NextResponse } from "next/server"
import { JobsService } from "@/lib/jobs-service"
import fs from 'fs/promises'
import path from 'path'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await JobsService.getJobById(id)
  if (!job) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json(job)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    // Intentar eliminar de la base de datos
    try {
      await JobsService.deleteJob(id)
    } catch (e) {
      console.log('No se encontró en la base de datos, intentando en JSON')
    }
    
    // Eliminar del archivo JSON local
    const jobsFilePath = path.join(process.cwd(), 'lib', 'jobs-db.json')
    try {
      const data = await fs.readFile(jobsFilePath, 'utf-8')
      const jobs = JSON.parse(data)
      
      let found = false
      for (const category in jobs) {
        const index = jobs[category].findIndex((job: any) => job.id === id)
        if (index !== -1) {
          jobs[category].splice(index, 1)
          found = true
          break
        }
      }
      
      if (found) {
        await fs.writeFile(jobsFilePath, JSON.stringify(jobs, null, 2))
      }
    } catch (e) {
      console.log('No se encontró en el archivo JSON')
    }
    
    return NextResponse.json({ ok: true, success: true })
  } catch (error: any) {
    console.error('Error deleting job:', error)
    return NextResponse.json({ error: error.message, success: false }, { status: 500 })
  }
} 