import { NextRequest, NextResponse } from "next/server"
import { ClientsService } from "@/lib/clients-service"

export async function GET(req: NextRequest) {
  const stats = await ClientsService.getClientStats()
  return NextResponse.json(stats)
} 