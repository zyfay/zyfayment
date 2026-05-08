// app/api/create-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pakasir, MERCHANT_NAME, MERCHANT_NMID, IS_SANDBOX } from "@/lib/zyfay";
import { createTransaction } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, customerName, customerEmail, description, orderId, webhookUrl, metadata } = body;

    if (!amount || amount < 100) {
      return NextResponse.json({ success: false, message: "Minimal pembayaran Rp 100" }, { status: 400 });
    }
    if (!customerName) {
      return NextResponse.json({ success: false, message: "customerName wajib diisi" }, { status: 400 });
    }

    const generatedOrderId = orderId || `ZY-${Date.now()}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Buat payment via Pakasir
    const payment = await pakasir.createPayment(
      "qris",
      generatedOrderId,
      amount,
      `${appUrl}/pay/success?order_id=${generatedOrderId}`
    );

    // Pakasir return payment_number (QRIS string) dan expired_at
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = payment as any;
    const qrisString = p?.payment?.payment_number || p?.payment_number || "";
    const expiredAt = p?.payment?.expired_at || p?.expired_at || new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const fee = p?.payment?.fee || p?.fee || 0;
    const totalPayment = p?.payment?.total_payment || p?.total_payment || amount;

    // Simpan ke store
    const trx = createTransaction({
      orderId: generatedOrderId,
      amount,
      customerName,
      customerEmail: customerEmail || "",
      description: description || "Pembayaran",
      qrisString,
      webhookUrl,
      metadata,
    });

    return NextResponse.json({
      success: true,
      sandbox: IS_SANDBOX,
      data: {
        transactionId: trx.id,
        orderId: generatedOrderId,
        amount,
        fee,
        totalPayment,
        status: "pending",
        qrisString,
        paymentUrl: `${appUrl}/pay/${trx.id}`,
        pakasirUrl: `https://app.pakasir.com/pay/zyfay-official/${totalPayment}?order_id=${generatedOrderId}&qris_only=1`,
        merchantName: MERCHANT_NAME,
        nmid: MERCHANT_NMID,
        expiredAt,
        createdAt: trx.createdAt,
      },
    });
  } catch (err) {
    console.error("[CREATE-PAYMENT]", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
