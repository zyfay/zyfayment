"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState({ revenue: 0, success: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  // 1. Sistem: Fetch Data (Simulasi ke API lu)
  useEffect(() => {
    const fetchData = async () => {
      // Di sini nanti lu ganti ke fetch('/api/dashboard')
      setTimeout(() => {
        setData({ revenue: 500000, success: 12, pending: 2 });
        setLoading(false);
      }, 800);
    };
    fetchData();
  }, []);

  // 2. Sistem: Navigasi
  const handleNav = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <div style={styles.container}>
      {/* Navbar Atas - Sistematis */}
      <nav style={styles.topNav}>
        <div style={styles.brand}>⚡ Zyfayment</div>
        <button onClick={() => setMenuOpen(!menuOpen)} style={styles.menuBtn}>☰</button>
      </nav>

      {/* Sidebar Overlay (Mobile System) */}
      {menuOpen && (
        <div style={styles.sidebar}>
          <button style={styles.closeBtn} onClick={() => setMenuOpen(false)}>✕</button>
          <nav style={styles.navMenu}>
            <button onClick={() => handleNav("/dashboard")}>Dashboard</button>
            <button onClick={() => handleNav("/transaksi")}>Data Transaksi</button>
            <button onClick={() => handleNav("/dompet")}>Dompet</button>
            <button onClick={() => handleNav("/api-setting")}>API & Webhook</button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.header}>
          <h2>Ringkasan</h2>
          <button style={styles.actionBtn} onClick={() => router.push("/transaksi/create")}>+ Transaksi</button>
        </div>

        {/* Stats - Data dari State */}
        <div style={styles.stats}>
          <div style={styles.card}><span>Pendapatan</span><h3>{loading ? "..." : `Rp ${data.revenue.toLocaleString()}`}</h3></div>
          <div style={styles.card}><span>Sukses</span><h3>{data.success}</h3></div>
          <div style={styles.card}><span>Pending</span><h3>{data.pending}</h3></div>
        </div>

        {/* Tabel */}
        <div style={styles.tableBox}>
           <table style={styles.table}>
             <thead><tr><th>ID</th><th>Status</th></tr></thead>
             <tbody><tr><td colSpan={2} style={{textAlign:'center', padding:'20px'}}>Data belum tersedia</td></tr></tbody>
           </table>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: "100vh", background: "#050505", color: "#fff", fontFamily: "'Inter', sans-serif" },
  topNav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "rgba(255,255,255,0.05)", borderBottom: "1px solid #222" },
  brand: { fontWeight: "800", fontSize: "18px" },
  menuBtn: { background: "none", border: "none", color: "#fff", fontSize: "24px", cursor: "pointer" },
  sidebar: { position: "fixed", top: 0, right: 0, width: "250px", height: "100vh", background: "#111", padding: "20px", zIndex: 10, borderLeft: "1px solid #333" },
  closeBtn: { background: "none", border: "none", color: "#fff", fontSize: "20px", marginBottom: "20px" },
  navMenu: { display: "flex", flexDirection: "column", gap: "15px" },
  main: { padding: "20px" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  stats: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" },
  card: { background: "#111", padding: "15px", borderRadius: "10px", border: "1px solid #222" },
  tableBox: { background: "#111", borderRadius: "10px", border: "1px solid #222", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  actionBtn: { background: "#fff", color: "#000", border: "none", padding: "8px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }
};
                                    
