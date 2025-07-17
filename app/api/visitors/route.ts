import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") === "contacts" ? "contacts" : "visitors";
  const { data, error } = await supabase
    .from("counters")
    .select("count")
    .eq("type", type)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = row not found
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: data?.count ?? 0 });
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") === "contacts" ? "contacts" : "visitors";

  // Intentar incrementar el contador, o crearlo si no existe
  let { data, error } = await supabase
    .from("counters")
    .update({ count: supabase.rpc('increment', { x: 1 }) })
    .eq("type", type)
    .select()
    .single();

  if (error) {
    // Si no existe, crearlo
    const { data: insertData, error: insertError } = await supabase
      .from("counters")
      .insert({ type, count: 1 })
      .select()
      .single();
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    return NextResponse.json({ count: insertData.count });
  }

  return NextResponse.json({ count: data.count });
} 