"use client";

export default function DashboardPage() {
  return (
    <div style={styles.page}>
      {/* Sidebar - Khusus buat manajemen */}
      <aside style={styles.sidebar}>
        <div style={styles.logoBox}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          <span style={styles.brand}>Zyfayment</span>
        </div>
        <div style={styles.menuGroup}>
          <button style={styles.navBtnActive}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
            Dashboard
          </button>
          <button style={styles.navBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Data Transaksi
          </button>
        </div>
      </aside>

      {/* Main Area - Fokus ke Performa */}
      <main style={styles.main}>
        <div style={styles.header}>
          <h2>Ringkasan Hari Ini</h2>
          <button style={styles.actionBtn}>+ Buat Transaksi</button>
        </div>

        {/* Card Stats ala Pakasir/POS */}
        <div style={styles.stats}>
          <div style={styles.card}><span>Pendapatan</span><h3>Rp 0</h3></div>
          <div style={styles.card}><span>Sukses</span><h3>0</h3></div>
          <div style={styles.card}><span>Pending</span><h3>0</h3></div>
        </div>

        {/* Area Tabel Kasir */}
        <div style={styles.tableBox}>
          <table style={styles.dataTable}>
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Status</th><th>Total</th></tr>
            </thead>
            <tbody>
              <tr><td colSpan={4} style={{textAlign: 'center', padding: '40px', color: '#666'}}>Data transaksi belum tersedia</td></tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: "flex", background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif" },
  sidebar: { width: "240px", borderRight: "1px solid #1a1a1a", padding: "24px" },
  logoBox: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" },
  brand: { fontWeight: 800, fontSize: "18px" },
  menuGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  navBtn: { background: "transparent", border: "none", color: "#666", padding: "12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
  navBtnActive: { background: "#1a1a1a", border: "none", color: "#fff", padding: "12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
  main: { flex: 1, padding: "32px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
  stats: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" },
  card: { background: "#111", border: "1px solid #222", padding: "20px", borderRadius: "12px" },
  tableBox: { background: "#111", border: "1px solid #222", borderRadius: "12px", overflow: "hidden" },
  dataTable: { width: "100%", borderCollapse: "collapse" }
};
            
