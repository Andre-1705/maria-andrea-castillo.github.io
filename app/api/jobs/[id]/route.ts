import { NextRequest, NextResponse } from "next/server"
import { JobsService } from "@/lib/jobs-service"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const job = await JobsService.getJobById(params.id)
  if (!job) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json(job)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await JobsService.deleteJob(params.id)
  return NextResponse.json({ ok: true })
} 