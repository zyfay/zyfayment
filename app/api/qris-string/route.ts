// app/api/qris-string/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTransaction } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID wajib" }, { status: 400 });

  const trx = getTransaction(id);
  if (!trx) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

  return NextResponse.json({ qrisString: trx.qrisString });
}
