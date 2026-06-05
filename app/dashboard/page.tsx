
"use client";
import { useState } from "react";

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("PROD");

  return (
    <div style={styles.page}>
      {/* Overlay untuk nutup sidebar */}
      <div style={{...styles.overlay, display: isOpen ? "block" : "none"}} onClick={() => setIsOpen(false)} />
      
      {/* Sidebar Drawer */}
      <aside style={{...styles.sidebar, left: isOpen ? "0" : "-280px"}}>
        <div style={styles.brandContainer}><h2>Zyfayment</h2></div>
        
        {/* Mode Switcher */}
        <div style={styles.modeSwitch}>
          <button style={{...styles.modeBtn, background: mode === "PROD" ? "#fff" : "transparent", color: mode === "PROD" ? "#3e4a89" : "#666"}} onClick={() => setMode("PROD")}>PROD</button>
          <button style={{...styles.modeBtn, background: mode === "SANDBOX" ? "#f59e0b" : "transparent", color: mode === "SANDBOX" ? "#fff" : "#666"}} onClick={() => setMode("SANDBOX")}>SANDBOX</button>
        </div>

        <nav style={styles.nav}>
          <a href="#" style={styles.link}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Dashboard</a>
          {mode === "SANDBOX" && <a href="#" style={styles.link}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Sandbox Panel</a>}
          <a href="#" style={styles.link}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Transaksi</a>
          <a href="#" style={styles.link}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14V12"/></svg> Dompet</a>
          <a href="#" style={styles.link}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Tarik Dana</a>
          <div style={styles.divider}>API & PENGATURAN</div>
          <a href="#" style={styles.link}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1 1.51H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> API Settings</a>
        </nav>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <button onClick={() => setIsOpen(true)} style={styles.menuBtn}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
          <div style={styles.headerRight}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <div style={styles.avatar}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
          </div>
        </header>

        <h2 style={{marginTop: "20px"}}>Ringkasan</h2>
        <div style={styles.stats}>
          <div style={styles.card}><span>Pendapatan</span><h3>Rp 0</h3></div>
          <div style={styles.card}><span>Sukses</span><h3>0</h3></div>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #1e1e2f, #3e4a89)", color: "#fff", fontFamily: "'Inter', sans-serif" },
  sidebar: { position: "fixed", top: 0, width: "260px", height: "100vh", background: "#fff", color: "#333", padding: "20px", transition: "0.3s", zIndex: 10, boxShadow: "2px 0 10px rgba(0,0,0,0.2)" },
  link: { display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "#333", padding: "10px 0", fontSize: "14px" },
  menuBtn: { background: "none", border: "none", color: "#fff", cursor: "pointer" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 9 },
  brandContainer: { marginBottom: "30px", color: "#3e4a89", fontWeight: "bold" },
  modeSwitch: { display: "flex", background: "#eee", borderRadius: "8px", padding: "4px", marginBottom: "20px" },
  modeBtn: { flex: 1, border: "none", padding: "8px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" },
  nav: { display: "flex", flexDirection: "column", gap: "5px" },
  divider: { fontSize: "11px", color: "#999", marginTop: "20px", marginBottom: "10px", fontWeight: "bold" },
  main: { padding: "20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerRight: { display: "flex", gap: "15px", alignItems: "center" },
  avatar: { width: "35px", height: "35px", background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "2px solid rgba(255,255,255,0.2)" },
  stats: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" },
  card: { background: "rgba(255,255,255,0.1)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)" }
};
