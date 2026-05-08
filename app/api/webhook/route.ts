// app/api/webhook/route.ts - Terima webhook dari Pakasir
import { NextRequest, NextResponse } from "next/server";
import { getAllTransactions, getTransaction, updateTransaction } from "@/lib/store";

// Webhook dari Pakasir (auto callback saat bayar)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[WEBHOOK] Pakasir callback:", JSON.stringify(body));

    // Format webhook Pakasir:
    // { amount, order_id, project, status, payment_method, completed_at }
    const { order_id, status, amount } = body;

    if (!order_id) {
      return NextResponse.json({ success: false, message: "order_id wajib" }, { status: 400 });
    }

    // Cari transaksi by orderId
    const all = getAllTransactions();
    const trx = all.find((t) => t.orderId === order_id);

    if (!trx) {
      return NextResponse.json({ success: false, message: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    const newStatus = status === "completed" ? "paid" : status === "expired" ? "expired" : "failed";

    const updated = updateTransaction(trx.id, {
      status: newStatus,
      paidAt: newStatus === "paid" ? new Date().toISOString() : undefined,
    });

    // Forward webhook ke merchant jika ada
    if (trx.webhookUrl && updated) {
      try {
        await fetch(trx.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionId: trx.id,
            orderId: trx.orderId,
            amount: trx.amount,
            status: newStatus,
            paidAt: updated.paidAt,
          }),
        });
      } catch (e) {
        console.error("[WEBHOOK] Forward failed:", e);
      }
    }

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err) {
    console.error("[WEBHOOK] Error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// Simulasi pembayaran sandbox (dari dashboard admin)
export async function POST_SIMULATE(req: NextRequest) {
  try {
    const { orderId, amount, adminKey } = await req.json();
    if (adminKey !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { pakasir } = await import("@/lib/zyfay");
    await pakasir.simulationPayment(orderId, amount);

    return NextResponse.json({ success: true, message: "Simulasi dikirim" });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Error simulasi" }, { status: 500 });
  }
}

// Manual confirm dari admin
export async function PATCH(req: NextRequest) {
  try {
    const { transactionId, adminKey } = await req.json();
    if (adminKey !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const trx = getTransaction(transactionId);
    if (!trx) return NextResponse.json({ success: false, message: "Tidak ditemukan" }, { status: 404 });

    const updated = updateTransaction(transactionId, {
      status: "paid",
      paidAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
