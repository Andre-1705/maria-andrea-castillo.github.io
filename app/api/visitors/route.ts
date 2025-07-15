import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "lib", "visitors.json");

function getType(req: NextRequest) {
  // Intenta obtener el tipo de la query (?type=contacts) o del body
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  return type === "contacts" ? "contacts" : "visitors";
}

export async function GET(req: NextRequest) {
  const type = getType(req);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(data);
    const count = json[type] || 0;
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const type = getType(req);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(data);
    json[type] = (json[type] || 0) + 1;
    await fs.writeFile(filePath, JSON.stringify(json, null, 2), "utf-8");
    return NextResponse.json({ count: json[type] });
  } catch (error) {
    // Si el archivo no existe, lo crea
    const json = { visitors: 0, contacts: 0 };
    json[type] = 1;
    await fs.writeFile(filePath, JSON.stringify(json, null, 2), "utf-8");
    return NextResponse.json({ count: 1 });
  }
} 