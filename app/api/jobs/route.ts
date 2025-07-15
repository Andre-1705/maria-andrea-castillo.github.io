import { NextRequest, NextResponse } from "next/server"
import { JobsService } from "@/lib/jobs-service"

export async function GET(req: NextRequest) {
  // Obtener todos los trabajos agrupados por categoría
  const categories = await JobsService.getCategories()
  const jobsByCategory: Record<string, any[]> = {}
  for (const category of categories) {
    jobsByCategory[category] = await JobsService.getJobsByCategory(category)
  }
  return NextResponse.json(jobsByCategory)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const job = await JobsService.createJob(data)
  return NextResponse.json(job)
} 