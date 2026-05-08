// app/api/check-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTransaction, updateTransaction } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const transactionId = searchParams.get("id");

  if (!transactionId) {
    return NextResponse.json({ success: false, message: "Transaction ID wajib diisi" }, { status: 400 });
  }

  const trx = getTransaction(transactionId);
  if (!trx) {
    return NextResponse.json({ success: false, message: "Transaksi tidak ditemukan" }, { status: 404 });
  }

  // Auto expire jika sudah lewat 30 menit
  if (trx.status === "pending" && new Date() > new Date(trx.expiredAt)) {
    updateTransaction(transactionId, { status: "expired" });
    trx.status = "expired";
  }

  return NextResponse.json({
    success: true,
    data: {
      transactionId: trx.id,
      orderId: trx.orderId,
      amount: trx.amount,
      status: trx.status,
      customerName: trx.customerName,
      description: trx.description,
      createdAt: trx.createdAt,
      expiredAt: trx.expiredAt,
      paidAt: trx.paidAt || null,
    },
  });
}
