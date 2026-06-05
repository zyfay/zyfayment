"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("PROD");

  const navigateTo = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <div style={styles.page}>
      <div style={{...styles.overlay, display: isOpen ? "block" : "none"}} onClick={() => setIsOpen(false)} />
      
      <aside style={{...styles.sidebar, left: isOpen ? "0" : "-280px"}}>
        <div style={styles.brandContainer}><h2>Zyfayment</h2></div>
        
        <div style={styles.modeSwitch}>
          <button style={{...styles.modeBtn, background: mode === "PROD" ? "#fff" : "transparent"}} onClick={() => setMode("PROD")}>PROD</button>
          <button style={{...styles.modeBtn, background: mode === "SANDBOX" ? "#f59e0b" : "transparent"}} onClick={() => setMode("SANDBOX")}>SANDBOX</button>
        </div>

        <nav style={styles.nav}>
          <button style={styles.link} onClick={() => navigateTo("/dashboard")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Dashboard
          </button>
          {mode === "SANDBOX" && (
            <button style={styles.link} onClick={() => navigateTo("/sandbox")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Sandbox Panel
            </button>
          )}
          <button style={styles.link} onClick={() => navigateTo("/transaksi")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Transaksi
          </button>
        </nav>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <button onClick={() => setIsOpen(true)} style={styles.menuBtn}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          
          <div style={styles.headerRight}>
            <button style={styles.iconBtn}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </button>
            <button onClick={() => navigateTo("/user/profile")} style={styles.avatar}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
          </div>
        </header>

        <h2>Ringkasan</h2>
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
  link: { display: "flex", alignItems: "center", gap: "12px", background: "none", border: "none", padding: "12px 0", cursor: "pointer", fontSize: "14px", width: "100%", color: "#333" },
  menuBtn: { background: "none", border: "none", color: "#fff", cursor: "pointer" },
  iconBtn: { background: "none", border: "none", color: "#fff", cursor: "pointer" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 9 },
  modeSwitch: { display: "flex", background: "#eee", borderRadius: "8px", padding: "4px", marginBottom: "20px" },
  modeBtn: { flex: 1, border: "none", padding: "8px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" },
  nav: { display: "flex", flexDirection: "column", gap: "5px" },
  main: { padding: "20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerRight: { display: "flex", gap: "15px", alignItems: "center" },
  avatar: { width: "35px", height: "35px", background: "#fff", borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  stats: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" },
  card: { background: "rgba(255,255,255,0.1)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)" }
};
      
