import { NextRequest, NextResponse } from "next/server";
import { ClientsService } from "@/lib/clients-service";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();
  const updated = await ClientsService.updateClientStatus(id, status);
  return NextResponse.json(updated);
} 