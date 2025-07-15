import { NextRequest, NextResponse } from "next/server"
import { ClientsService } from "@/lib/clients-service"

export async function GET(req: NextRequest) {
  const clients = await ClientsService.getAllClients()
  return NextResponse.json(clients)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const client = await ClientsService.createClient(data)
  return NextResponse.json(client)
} 