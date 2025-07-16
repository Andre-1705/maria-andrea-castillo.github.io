import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") === "contacts" ? "contacts" : "visitors";
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT count FROM counters WHERE type = $1", [type]);
    const count = result.rows[0]?.count ?? 0;
    return NextResponse.json({ count });
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") === "contacts" ? "contacts" : "visitors";
  const client = await pool.connect();
  try {
    await client.query(
      "INSERT INTO counters (type, count) VALUES ($1, 1) ON CONFLICT (type) DO UPDATE SET count = counters.count + 1",
      [type]
    );
    const result = await client.query("SELECT count FROM counters WHERE type = $1", [type]);
    const count = result.rows[0]?.count ?? 0;
    return NextResponse.json({ count });
  } finally {
    client.release();
  }
} 