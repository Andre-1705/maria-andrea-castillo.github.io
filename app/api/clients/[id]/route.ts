import { NextRequest, NextResponse } from "next/server";
import { ClientsService } from "@/lib/clients-service";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await ClientsService.deleteClient(params.id);
  return NextResponse.json({ ok: true });
} 