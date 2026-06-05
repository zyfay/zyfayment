"use client";
import { useState } from "react";

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={styles.container}>
      {/* Top Navigation - Mobile Friendly */}
      <nav style={styles.topNav}>
        <div style={styles.brand}>⚡ Zyfayment</div>
        <button onClick={() => setMenuOpen(!menuOpen)} style={styles.menuBtn}>☰</button>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.header}>
          <h2>Ringkasan</h2>
          <button style={styles.actionBtn}>+ Transaksi</button>
        </div>

        {/* Stats - Grid lebih rapat */}
        <div style={styles.stats}>
          <div style={styles.card}><span>Pendapatan</span><h3>Rp 0</h3></div>
          <div style={styles.card}><span>Sukses</span><h3>0</h3></div>
          <div style={styles.card}><span>Pending</span><h3>0</h3></div>
        </div>

        {/* Tabel */}
        <div style={styles.tableBox}>
           <p style={{textAlign:'center', padding:'20px'}}>Belum ada data</p>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: "100vh", background: "#050505", color: "#fff", fontFamily: "'Inter', sans-serif" },
  topNav: { 
    display: "flex", justifyContent: "space-between", alignItems: "center", 
    padding: "16px 20px", background: "rgba(255,255,255,0.05)", borderBottom: "1px solid #222" 
  },
  brand: { fontWeight: "800", fontSize: "18px" },
  menuBtn: { background: "none", border: "none", color: "#fff", fontSize: "24px", cursor: "pointer" },
  main: { padding: "20px" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  stats: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" },
  card: { background: "#111", padding: "15px", borderRadius: "10px", border: "1px solid #222" },
  tableBox: { background: "#111", borderRadius: "10px", border: "1px solid #222" },
  actionBtn: { background: "#fff", color: "#000", border: "none", padding: "8px 12px", borderRadius: "6px", fontWeight: "bold" }
};
          
