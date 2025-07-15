import { NextRequest, NextResponse } from "next/server";
import { ClientsService } from "@/lib/clients-service";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { status } = await req.json();
  const updated = await ClientsService.updateClientStatus(params.id, status);
  return NextResponse.json(updated);
} 