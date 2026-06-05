"use client";
import { useState } from "react";

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("PROD");

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
          <a href="#" style={styles.link}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Dashboard</a>
          {mode === "SANDBOX" && <a href="#" style={styles.link}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Sandbox Panel</a>}
          <a href="#" style={styles.link}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Transaksi</a>
          {/* ... (Menu lainnya) */}
        </nav>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <button onClick={() => setIsOpen(true)} style={styles.menuBtn}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
          
          <div style={styles.headerRight}>
            {/* Ikon Lonceng SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            
            {/* Ikon Profil SVG */}
            <div style={styles.avatar}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
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
  // ... (Gaya CSS tetap sama)
  avatar: { 
    width: "35px", height: "35px", background: "#fff", borderRadius: "50%", 
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
    border: "2px solid rgba(255,255,255,0.2)" 
  },
  // ...
};
