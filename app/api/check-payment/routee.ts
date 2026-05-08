// app/api/check-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTransaction } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID transaksi wajib diisi" },
        { status: 400 }
      );
    }

    const trx = getTransaction(id);

    if (!trx) {
      return NextResponse.json(
        { success: false, message: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cek apakah sudah expired
    const isExpired =
      trx.status === "expired" ||
      (trx.status === "pending" && new Date(trx.expiredAt) < new Date());

    const status = isExpired ? "expired" : trx.status;

    return NextResponse.json({
      success: true,
      data: {
        transactionId: trx.id,
        orderId: trx.orderId,
        amount: trx.amount,
        status,
        customerName: trx.customerName,
        description: trx.description,
        expiredAt: trx.expiredAt,
        paidAt: trx.paidAt ?? null,
        createdAt: trx.createdAt,
      },
    });
  } catch (err) {
    console.error("[CHECK-PAYMENT]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
