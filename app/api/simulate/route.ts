// app/api/simulate/route.ts - Simulasi pembayaran sandbox
import { NextRequest, NextResponse } from "next/server";
import { pakasir, IS_SANDBOX } from "@/lib/zyfay";
import { getAllTransactions, updateTransaction } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    if (!IS_SANDBOX) {
      return NextResponse.json({ success: false, message: "Simulasi hanya tersedia di mode Sandbox" }, { status: 403 });
    }

    const { orderId, amount, adminKey } = await req.json();

    if (adminKey !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Kirim simulasi ke Pakasir
    await pakasir.simulationPayment(orderId, amount);

    // Langsung update status di store juga
    const all = getAllTransactions();
    const trx = all.find((t) => t.orderId === orderId);
    if (trx) {
      updateTransaction(trx.id, { status: "paid", paidAt: new Date().toISOString() });
    }

    return NextResponse.json({ success: true, message: "Simulasi pembayaran berhasil dikirim!" });
  } catch (err) {
    console.error("[SIMULATE]", err);
    return NextResponse.json({ success: false, message: "Gagal simulasi" }, { status: 500 });
  }
}
