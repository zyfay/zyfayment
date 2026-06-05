"use client";

export default function DashboardPage() {
  return (
    <div style={styles.page}>
      {/* Sidebar - Responsif */}
      <aside style={styles.sidebar}>
        <div style={styles.logoBox}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          <span style={styles.brand}>Zyfayment</span>
        </div>
        <div style={styles.menuGroup}>
          <button style={styles.navBtnActive}>Dashboard</button>
          <button style={styles.navBtn}>Transaksi</button>
        </div>
      </aside>

      {/* Main Area */}
      <main style={styles.main}>
        <div style={styles.header}>
          <h2>Ringkasan Hari Ini</h2>
          <button style={styles.actionBtn}>+ Transaksi</button>
        </div>

        {/* Stats - Grid responsif otomatis */}
        <div style={styles.stats}>
          <div style={styles.card}><span>Pendapatan</span><h3>Rp 0</h3></div>
          <div style={styles.card}><span>Sukses</span><h3>0</h3></div>
          <div style={styles.card}><span>Pending</span><h3>0</h3></div>
        </div>

        <div style={styles.tableBox}>
          <table style={styles.dataTable}>
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Status</th><th>Total</th></tr>
            </thead>
            <tbody>
              <tr><td colSpan={4} style={{textAlign: 'center', padding: '40px', color: '#ccc'}}>Belum ada data</td></tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { 
    display: "flex", 
    flexWrap: "wrap", // Bikin responsif (turun ke bawah kalau layar kecil)
    minHeight: "100vh", 
    background: "linear-gradient(135deg, #1e1e2f 0%, #3e4a89 100%)", // Tema Home Page
    color: "#fff", 
    fontFamily: "'Inter', sans-serif" 
  },
  sidebar: { 
    width: "240px", 
    padding: "24px", 
    borderRight: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.2)"
  },
  logoBox: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" },
  brand: { fontWeight: 800, fontSize: "18px" },
  menuGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  navBtn: { background: "transparent", border: "none", color: "#d1d5db", padding: "10px", textAlign: "left", cursor: "pointer" },
  navBtnActive: { background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "10px", borderRadius: "8px", textAlign: "left", cursor: "pointer" },
  main: { flex: "1 1 300px", padding: "32px" }, // flex-grow 1, flex-shrink 1, basis 300px
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
  stats: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Ini rahasia biar responsif di HP
    gap: "20px", 
    marginBottom: "32px" 
  },
  card: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "20px", borderRadius: "12px" },
  tableBox: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", overflowX: "auto" },
  dataTable: { width: "100%", borderCollapse: "collapse", minWidth: "500px" },
  actionBtn: { background: "#fff", color: "#3e4a89", border: "none", padding: "10px 16px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }
};
            
