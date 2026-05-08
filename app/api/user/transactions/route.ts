import { NextRequest, NextResponse } from "next/server";
import { getAllTransactions } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ success: false, message: "Email diperlukan" }, { status: 400 });
  }

  const all = getAllTransactions();
  const userTransactions = all.filter(
    (t) => t.customerEmail.toLowerCase() === email.toLowerCase()
  );

  if (userTransactions.length === 0) {
    return NextResponse.json({ success: false, message: "Tidak ada transaksi untuk email ini" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: userTransactions });
}
