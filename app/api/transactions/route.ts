// app/api/transactions/route.ts
import { NextResponse } from "next/server";
import { getAllTransactions } from "@/lib/store";

export async function GET() {
  const all = getAllTransactions();
  return NextResponse.json({ success: true, data: all });
}
