"use client";
import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  customerName: string;
  description: string;
  status: "pending" | "paid" | "expired" | "failed";
  createdAt: string;
  paidAt?: string;
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: "#fff8e1", color: "#f59e0b", label: "⏳ Menunggu" },
    paid:    { bg: "#e8f5e9", color: "#16a34a", label: "✅ Lunas" },
    expired: { bg: "#fef2f2", color: "#dc2626", label: "⏰ Kadaluarsa" },
    failed:  { bg: "#fef2f2", color: "#dc2626", label: "❌ Gagal" },
  };
  const s = map[status] || map.failed;
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);
  const [simulating, setSimulating] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [isSandbox, setIsSandbox] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/transactions").then((r) => r.json());
    if (res.success) setTransactions(res.data);
    const envRes = await fetch("/api/mode").then((r) => r.json()).catch(() => ({}));
    if (envRes.sandbox) setIsSandbox(true);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const simulatePayment = async (trx: Transaction) => {
    if (!adminKey) return alert("Masukkan Admin Key terlebih dahulu");
    setSimulating(trx.id);
    const res = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: trx.orderId, amount: trx.amount, adminKey }),
    }).then((r) => r.json());
    alert(res.success ? "✅ " + res.message : "❌ " + res.message);
    if (res.success) load();
    setSimulating(null);
  };

  const confirmPayment = async (id: string) => {
    if (!adminKey) return alert("Masukkan Admin Key terlebih dahulu");
    setConfirming(id);
    const res = await fetch("/api/webhook", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId: id, adminKey }),
    }).then((r) => r.json());
    alert(res.success ? "✅ Transaksi dikonfirmasi sebagai LUNAS" : "❌ Gagal: " + res.message);
    if (res.success) load();
    setConfirming(null);
  };

  const filtered = transactions.filter((t) => filter === "all" || t.status === filter);
  const stats = {
    total: transactions.length,
    paid: transactions.filter((t) => t.status === "paid").length,
    pending: transactions.filter((t) => t.status === "pending").length,
    revenue: transactions.filter((t) => t.status === "paid").reduce((s, t) => s + t.amount, 0),
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>⚡ Zyfayment</div>
        {isSandbox && (
          <div style={styles.sandboxBadge}>🧪 SANDBOX MODE</div>
        )}
        <nav style={{ marginTop: 8 }}>
          {["Dashboard", "Transaksi"].map((m, i) => (
            <div key={i} style={{ ...styles.navItem, ...(i === 0 ? styles.navActive : {}) }}>{m}</div>
          ))}
        </nav>
        <div style={styles.sidebarFooter}>
          <div style={styles.adminKeyLabel}>ADMIN KEY</div>
          <input
            type="password"
            placeholder="Masukkan secret..."
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            style={styles.adminKeyInput}
          />
          <div style={{ color: "#555", fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>
            Set di env: <code style={{ color: "#a78bfa" }}>WEBHOOK_SECRET</code>
          </div>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>Dashboard {isSandbox && <span style={styles.sandboxTag}>SANDBOX</span>}</h1>
            <p style={styles.pageSubtitle}>Zyfay Official Digital · NMID: ID1025424358865</p>
          </div>
          <button onClick={load} style={styles.refreshBtn}>↻ Refresh</button>
        </div>

        <div style={styles.statsGrid}>
          {[
            { label: "Total Transaksi", value: stats.total, icon: "📋", color: "#667eea" },
            { label: "Menunggu", value: stats.pending, icon: "⏳", color: "#f59e0b" },
            { label: "Lunas", value: stats.paid, icon: "✅", color: "#16a34a" },
            { label: "Total Pendapatan", value: formatRupiah(stats.revenue), icon: "💰", color: "#8b5cf6" },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: i === 3 ? 16 : 24, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {isSandbox && (
          <div style={styles.sandboxInfo}>
            <strong>🧪 Mode Sandbox Aktif</strong> — Transaksi tidak nyata. Gunakan tombol "Simulasi Bayar" untuk test webhook. Ganti <code>PAKASIR_MODE=production</code> di env untuk mode live.
          </div>
        )}

        <div style={styles.filterBar}>
          {["all", "pending", "paid", "expired"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}>
              {f === "all" ? "Semua" : f === "pending" ? "Menunggu" : f === "paid" ? "Lunas" : "Kadaluarsa"}
            </button>
          ))}
        </div>

        <div style={styles.tableWrap}>
          {loading ? (
            <div style={styles.empty}>Memuat...</div>
          ) : filtered.length === 0 ? (
            <div style={styles.empty}>Belum ada transaksi</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    {["Order ID", "Pelanggan", "Jumlah", "Status", "Waktu", "Aksi"].map((h) => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} style={styles.tr}>
                      <td style={styles.td}><code style={styles.code}>{t.orderId}</code></td>
                      <td style={styles.td}>{t.customerName}</td>
                      <td style={{ ...styles.td, fontWeight: 700, color: "#16a34a" }}>{formatRupiah(t.amount)}</td>
                      <td style={styles.td}><StatusBadge status={t.status} /></td>
                      <td style={styles.td}>
                        <span style={{ fontSize: 12, color: "#888" }}>
                          {new Date(t.createdAt).toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <a href={`/pay/${t.id}`} target="_blank" style={styles.viewBtn}>👁 Lihat</a>
                          {t.status === "pending" && isSandbox && (
                            <button onClick={() => simulatePayment(t)} disabled={simulating === t.id} style={styles.simulateBtn}>
                              {simulating === t.id ? "..." : "🧪 Simulasi"}
                            </button>
                          )}
                          {t.status === "pending" && (
                            <button onClick={() => confirmPayment(t.id)} disabled={confirming === t.id} style={styles.confirmBtn}>
                              {confirming === t.id ? "..." : "✓ Konfirmasi"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: "flex", minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  sidebar: { width: 220, background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)", padding: "28px 16px", display: "flex", flexDirection: "column", gap: 8, position: "fixed", height: "100vh" },
  sidebarLogo: { fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg, #667eea, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 },
  sandboxBadge: { background: "#f59e0b20", color: "#f59e0b", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, textAlign: "center", border: "1px solid #f59e0b40" },
  navItem: { padding: "10px 14px", borderRadius: 10, color: "#aaa", fontSize: 14, cursor: "pointer" },
  navActive: { background: "rgba(102,126,234,0.2)", color: "#a78bfa", fontWeight: 600 },
  sidebarFooter: { marginTop: "auto" },
  adminKeyLabel: { color: "#888", fontSize: 11, marginBottom: 6, letterSpacing: 1 },
  adminKeyInput: { width: "100%", padding: "8px 10px", background: "#ffffff15", border: "1px solid #ffffff20", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" },
  main: { marginLeft: 220, padding: "32px", flex: 1 },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  pageTitle: { fontSize: 26, fontWeight: 800, color: "#1a1a2e", margin: "0 0 4px" },
  sandboxTag: { background: "#f59e0b", color: "#fff", fontSize: 12, padding: "2px 8px", borderRadius: 8, marginLeft: 8, verticalAlign: "middle" },
  pageSubtitle: { color: "#888", fontSize: 13, margin: 0 },
  refreshBtn: { padding: "8px 16px", background: "#667eea", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  statCard: { background: "#fff", borderRadius: 14, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center" },
  sandboxInfo: { background: "#fff8e1", border: "1px solid #f59e0b40", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#92400e" },
  filterBar: { display: "flex", gap: 8, marginBottom: 16 },
  filterBtn: { padding: "7px 16px", border: "1px solid #e0e0e0", borderRadius: 20, background: "#fff", color: "#666", fontSize: 13, cursor: "pointer" },
  filterActive: { background: "#667eea", color: "#fff", borderColor: "#667eea" },
  tableWrap: { background: "#fff", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  empty: { textAlign: "center", padding: 40, color: "#aaa" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f9f9f9" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#888", fontWeight: 600, borderBottom: "1px solid #f0f0f0" },
  tr: { borderBottom: "1px solid #f9f9f9" },
  td: { padding: "12px 16px", fontSize: 13, color: "#333", verticalAlign: "middle" },
  code: { background: "#f5f5f5", padding: "2px 6px", borderRadius: 4, fontSize: 11, fontFamily: "monospace" },
  viewBtn: { padding: "5px 10px", background: "#f0f4ff", color: "#667eea", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer", textDecoration: "none", fontWeight: 600 },
  simulateBtn: { padding: "5px 10px", background: "#fff8e1", color: "#f59e0b", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600 },
  confirmBtn: { padding: "5px 10px", background: "#e8f5e9", color: "#16a34a", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600 },
};
