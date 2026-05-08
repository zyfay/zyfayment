"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  description: string;
  status: "pending" | "paid" | "expired" | "failed";
  createdAt: string;
  paidAt?: string;
  expiredAt: string;
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: "#fff8e1", color: "#f59e0b", label: "⏳ Menunggu Pembayaran" },
    paid:    { bg: "#e8f5e9", color: "#16a34a", label: "✅ Lunas" },
    expired: { bg: "#fef2f2", color: "#dc2626", label: "⏰ Kadaluarsa" },
    failed:  { bg: "#fef2f2", color: "#dc2626", label: "❌ Gagal" },
  };
  const s = map[status] || map.failed;
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 600 }}>
      {s.label}
    </span>
  );
}

export default function UserDashboard() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const e = sessionStorage.getItem("user_email");
    if (!e) { router.replace("/user/login"); return; }
    setEmail(e);
    fetch("/api/user/transactions?email=" + encodeURIComponent(e))
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setTransactions(res.data);
        setLoading(false);
      });
  }, [router]);

  const logout = () => {
    sessionStorage.removeItem("user_email");
    router.replace("/user/login");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>⚡ Zyfayment</div>
          <div style={styles.headerRight}>
            <span style={styles.emailBadge}>📧 {email}</span>
            <button onClick={logout} style={styles.logoutBtn}>Keluar</button>
          </div>
        </div>

        <h2 style={styles.title}>Pesanan Saya</h2>
        <p style={styles.subtitle}>Riwayat transaksi untuk akun <strong>{email}</strong></p>

        {loading ? (
          <div style={styles.empty}>Memuat...</div>
        ) : transactions.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ color: "#888", margin: 0 }}>Belum ada transaksi untuk email ini</p>
          </div>
        ) : (
          <div style={styles.list}>
            {transactions.map((t) => (
              <div key={t.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <div style={styles.orderDesc}>{t.description}</div>
                    <code style={styles.orderId}>{t.orderId}</code>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
                <div style={styles.cardMid}>
                  <div style={styles.amount}>{formatRupiah(t.amount)}</div>
                  <div style={styles.date}>{new Date(t.createdAt).toLocaleString("id-ID")}</div>
                </div>
                {t.status === "pending" && (
                  <div style={styles.cardFooter}>
                    <a href={`/pay/${t.id}`} style={styles.payBtn}>💳 Bayar Sekarang →</a>
                    <span style={styles.expiry}>
                      Kadaluarsa: {new Date(t.expiredAt).toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                {t.status === "paid" && t.paidAt && (
                  <div style={{ ...styles.cardFooter, color: "#16a34a", fontSize: 13 }}>
                    ✅ Dibayar pada {new Date(t.paidAt).toLocaleString("id-ID")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  container: { maxWidth: 680, margin: "0 auto", padding: "0 20px 40px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", borderBottom: "1px solid #eee", marginBottom: 28 },
  logo: { fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg, #667eea, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  headerRight: { display: "flex", alignItems: "center", gap: 12 },
  emailBadge: { fontSize: 13, color: "#666", background: "#f0f0f0", padding: "6px 12px", borderRadius: 20 },
  logoutBtn: { padding: "6px 14px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600 },
  title: { fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 },
  subtitle: { color: "#888", fontSize: 14, marginBottom: 24 },
  empty: { textAlign: "center", padding: 40, color: "#aaa" },
  emptyBox: { background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  list: { display: "flex", flexDirection: "column", gap: 14 },
  card: { background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12 },
  orderDesc: { fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 },
  orderId: { fontSize: 11, background: "#f5f5f5", padding: "2px 6px", borderRadius: 4, color: "#888", fontFamily: "monospace" },
  cardMid: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  amount: { fontSize: 20, fontWeight: 800, color: "#667eea" },
  date: { fontSize: 12, color: "#aaa" },
  cardFooter: { marginTop: 14, paddingTop: 14, borderTop: "1px solid #f5f5f5", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  payBtn: { background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", padding: "9px 18px", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 700 },
  expiry: { fontSize: 12, color: "#f59e0b" },
};
