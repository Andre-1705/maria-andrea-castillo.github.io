import { NextRequest, NextResponse } from "next/server";
import { ClientsService } from "@/lib/clients-service";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await ClientsService.deleteClient(id);
  return NextResponse.json({ ok: true });
} 