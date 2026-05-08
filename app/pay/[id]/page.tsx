"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import QRCode from "qrcode";

interface Transaction {
  transactionId: string;
  orderId: string;
  amount: number;
  status: string;
  customerName: string;
  description: string;
  qrisString?: string;
  expiredAt: string;
  paidAt?: string;
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function useCountdown(expiredAt: string) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff = new Date(expiredAt).getTime() - Date.now();
      setRemaining(Math.max(0, diff));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiredAt]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return { minutes, seconds, expired: remaining === 0 };
}

export default function PaymentPage() {
  const params = useParams();
  const id = params.id as string;

  const [trx, setTrx] = useState<Transaction | null>(null);
  const [qrisImg, setQrisImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  // Load transaksi
  useEffect(() => {
    fetch(`/api/check-payment?id=${id}`)
      .then((r) => r.json())
      .then(async (res) => {
        if (res.success) {
          setTrx(res.data);
        } else {
          setError("Transaksi tidak ditemukan");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Generate QR image dari QRIS string
  useEffect(() => {
    if (!trx) return;
    // Ambil qrisString dari create-payment response yang disimpan
    fetch(`/api/qris-string?id=${id}`)
      .then((r) => r.json())
      .then(async (res) => {
        if (res.qrisString) {
          const img = await QRCode.toDataURL(res.qrisString, { width: 280, margin: 2, errorCorrectionLevel: "M" });
          setQrisImg(img);
        }
      })
      .catch(() => {});
  }, [trx, id]);

  // Polling cek status
  const checkStatus = useCallback(async () => {
    setChecking(true);
    const res = await fetch(`/api/check-payment?id=${id}`).then((r) => r.json());
    if (res.success) setTrx(res.data);
    setChecking(false);
  }, [id]);

  const { minutes, seconds, expired } = useCountdown(trx?.expiredAt || new Date().toISOString());

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.loader}>
            <div style={styles.spinner} />
            <p style={{ color: "#888", marginTop: 16 }}>Memuat pembayaran...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trx) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
            <h2 style={{ color: "#e53e3e", marginBottom: 8 }}>Transaksi Tidak Ditemukan</h2>
            <p style={{ color: "#888" }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (trx.status === "paid") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 64, marginBottom: 16, animation: "pulse 1s" }}>✅</div>
            <h2 style={{ color: "#38a169", fontSize: 24, marginBottom: 8 }}>Pembayaran Berhasil!</h2>
            <p style={{ color: "#888", marginBottom: 24 }}>Terima kasih, {trx.customerName}</p>
            <div style={styles.infoBox}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Order ID</span>
                <span style={styles.infoValue}>{trx.orderId}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Jumlah</span>
                <span style={{ ...styles.infoValue, color: "#38a169", fontWeight: 700 }}>{formatRupiah(trx.amount)}</span>
              </div>
              {trx.paidAt && (
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Waktu</span>
                  <span style={styles.infoValue}>{new Date(trx.paidAt).toLocaleString("id-ID")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (trx.status === "expired" || expired) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏰</div>
            <h2 style={{ color: "#e53e3e", marginBottom: 8 }}>QRIS Kadaluarsa</h2>
            <p style={{ color: "#888" }}>Waktu pembayaran telah habis. Silakan buat transaksi baru.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>⚡ Zyfayment</div>
          <div style={styles.badge}>QRIS</div>
        </div>

        {/* Amount */}
        <div style={styles.amountBox}>
          <p style={styles.amountLabel}>Total Pembayaran</p>
          <p style={styles.amountValue}>{formatRupiah(trx.amount)}</p>
          <p style={styles.amountDesc}>{trx.description}</p>
        </div>

        {/* Timer */}
        <div style={{ ...styles.timer, color: minutes < 5 ? "#e53e3e" : "#e8a020" }}>
          ⏱ Bayar dalam{" "}
          <strong>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </strong>
        </div>

        {/* QR Code */}
        <div style={styles.qrWrapper}>
          {qrisImg ? (
            <img src={qrisImg} alt="QRIS" style={styles.qrImage} />
          ) : (
            <div style={styles.qrPlaceholder}>
              <div style={styles.spinner} />
              <p style={{ color: "#888", fontSize: 13, marginTop: 12 }}>Generating QR...</p>
            </div>
          )}
          <p style={styles.nmid}>NMID: ID1025424358865</p>
          <p style={styles.merchantName}>Zyfay Official Digital</p>
        </div>

        {/* Info */}
        <div style={styles.infoBox}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Order ID</span>
            <span style={styles.infoValue}>{trx.orderId}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Pelanggan</span>
            <span style={styles.infoValue}>{trx.customerName}</span>
          </div>
        </div>

        {/* Instruksi */}
        <div style={styles.steps}>
          {["Buka aplikasi e-wallet (GoPay, OVO, DANA, dll)", "Pilih Scan / Bayar QR", "Scan QR di atas", "Konfirmasi pembayaran"].map((s, i) => (
            <div key={i} style={styles.step}>
              <div style={styles.stepNum}>{i + 1}</div>
              <span style={{ fontSize: 13, color: "#555" }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Cek Status */}
        <button onClick={checkStatus} disabled={checking} style={styles.checkBtn}>
          {checking ? "Mengecek..." : "✓ Saya Sudah Bayar"}
        </button>

        <p style={styles.footer}>Didukung oleh <strong>Zyfay Official Digital</strong> · Powered by QRIS</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "28px 24px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    fontSize: 20,
    fontWeight: 800,
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  badge: {
    background: "#e8f5e9",
    color: "#2e7d32",
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 20,
    letterSpacing: 1,
  },
  amountBox: {
    textAlign: "center",
    background: "linear-gradient(135deg, #667eea15, #764ba215)",
    borderRadius: 12,
    padding: "16px 20px",
    marginBottom: 16,
    border: "1px solid #667eea30",
  },
  amountLabel: { color: "#888", fontSize: 13, margin: "0 0 4px" },
  amountValue: { fontSize: 32, fontWeight: 800, color: "#1a1a2e", margin: "0 0 4px" },
  amountDesc: { color: "#666", fontSize: 13, margin: 0 },
  timer: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 16,
    padding: "8px",
    background: "#fff8e1",
    borderRadius: 8,
  },
  qrWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "16px 0",
    borderTop: "1px solid #f0f0f0",
    borderBottom: "1px solid #f0f0f0",
    marginBottom: 16,
  },
  qrImage: {
    width: 220,
    height: 220,
    borderRadius: 8,
  },
  qrPlaceholder: {
    width: 220,
    height: 220,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
    borderRadius: 8,
  },
  nmid: { fontSize: 11, color: "#999", margin: "8px 0 2px", letterSpacing: 0.5 },
  merchantName: { fontSize: 13, fontWeight: 600, color: "#444", margin: 0 },
  infoBox: {
    background: "#f9f9f9",
    borderRadius: 10,
    padding: "12px 16px",
    marginBottom: 16,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    fontSize: 13,
  },
  infoLabel: { color: "#888" },
  infoValue: { color: "#333", fontWeight: 500, textAlign: "right", maxWidth: "60%", wordBreak: "break-all" },
  steps: { marginBottom: 20 },
  step: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "5px 0",
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 16,
  },
  loader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 40,
  },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #f0f0f0",
    borderTop: "3px solid #667eea",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#bbb",
    margin: 0,
  },
};

