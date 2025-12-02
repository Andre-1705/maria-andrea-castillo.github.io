import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Faltan variables de entorno de Supabase (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)"
    );
  }
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") === "contacts" ? "contacts" : "visitors";
    const { data, error } = await supabase
      .from("counters")
      .select("count")
      .eq("type", type)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ count: data?.count ?? 0 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") === "contacts" ? "contacts" : "visitors";

    // Obtener el contador actual
    const { data: existing, error: getError } = await supabase
      .from("counters")
      .select("count")
      .eq("type", type)
      .maybeSingle();

    if (getError) {
      return NextResponse.json({ error: getError.message }, { status: 500 });
    }

    if (!existing) {
      // Crear registro inicial
      const { data: insertData, error: insertError } = await supabase
        .from("counters")
        .insert({ type, count: 1 })
        .select("count")
        .single();
      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
      return NextResponse.json({ count: insertData.count });
    }

    // Incrementar contador existente
    const newCount = (existing.count ?? 0) + 1;
    const { data: updateData, error: updateError } = await supabase
      .from("counters")
      .update({ count: newCount })
      .eq("type", type)
      .select("count")
      .single();
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ count: updateData.count });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error interno" }, { status: 500 });
  }
}