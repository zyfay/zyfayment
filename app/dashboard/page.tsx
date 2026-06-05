"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [mode, setMode] = useState("PROD");

  return (
    <div style={styles.page}>
      <div style={{...styles.overlay, display: isOpen ? "block" : "none"}} onClick={() => setIsOpen(false)} />
      
      {/* Sidebar Drawer */}
      <aside style={{...styles.sidebar, left: isOpen ? "0" : "-280px"}}>
        <div style={styles.brandContainer}><h2>Zyfayment</h2></div>
        
        <div style={styles.modeSwitch}>
          <button style={{...styles.modeBtn, background: mode === "PROD" ? "#fff" : "transparent"}} onClick={() => setMode("PROD")}>PROD</button>
          <button style={{...styles.modeBtn, background: mode === "SANDBOX" ? "#f59e0b" : "transparent"}} onClick={() => setMode("SANDBOX")}>SANDBOX</button>
        </div>

        <nav style={styles.nav}>
          <button style={styles.link} onClick={() => router.push("/dashboard")}>Dashboard</button>
          {mode === "SANDBOX" && <button style={styles.link} onClick={() => router.push("/sandbox")}>Sandbox Panel</button>}
          <button style={styles.link} onClick={() => router.push("/transaksi")}>Transaksi</button>
          <button style={styles.link} onClick={() => router.push("/dompet")}>Dompet</button>
          <button style={styles.link} onClick={() => router.push("/tarik-dana")}>Tarik Dana</button>
          <div style={styles.divider}>API & PENGATURAN</div>
          <button style={styles.link} onClick={() => router.push("/api")}>API Settings</button>
          <button style={styles.link} onClick={() => router.push("/docs")}>Dokumentasi API</button>
          <button style={styles.link} onClick={() => router.push("/profile")}>Profil Saya</button>
        </nav>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <button onClick={() => setIsOpen(true)} style={styles.menuBtn}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
          
          <div style={styles.headerRight}>
            <div style={{position: "relative"}}>
              <button style={styles.iconBtn} onClick={() => setShowNotif(!showNotif)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </button>
              {showNotif && (
                <div style={styles.popup}>
                  <p style={{fontSize: '12px', color: '#666'}}>Tidak ada info terbaru</p>
                  <div style={{display:'flex', gap:'5px', marginTop:'10px'}}>
                    <button style={styles.btnSm}>Hapus</button>
                    <button style={styles.btnSm}>Baca</button>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => router.push("/profile")} style={styles.avatar}>
               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
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
  link: { background: "none", border: "none", padding: "12px 0", cursor: "pointer", fontSize: "14px", width: "100%", textAlign: "left", color: "#333", fontWeight: 500 },
  menuBtn: { background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 9 },
  brandContainer: { marginBottom: "30px", color: "#3e4a89", fontWeight: "bold" },
  modeSwitch: { display: "flex", background: "#eee", borderRadius: "8px", padding: "4px", marginBottom: "20px" },
  modeBtn: { flex: 1, border: "none", padding: "8px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" },
  nav: { display: "flex", flexDirection: "column", gap: "5px" },
  divider: { fontSize: "11px", color: "#999", marginTop: "20px", marginBottom: "10px", fontWeight: "bold" },
  main: { padding: "20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerRight: { display: "flex", gap: "15px", alignItems: "center" },
  iconBtn: { background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 0, display: "flex" },
  popup: { position: "absolute", top: "50px", right: "60px", background: "#fff", color: "#333", padding: "15px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", width: "180px", zIndex: 20 },
  btnSm: { fontSize: "10px", padding: "4px 8px", cursor: "pointer" },
  avatar: { width: "35px", height: "35px", background: "#fff", borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  stats: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" },
  card: { background: "rgba(255,255,255,0.1)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)" }
};
        
