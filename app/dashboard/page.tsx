"use client";

import { useState } from "react";

type Page = "dashboard" | "sandbox" | "transaksi" | "dompet" | "tarik-dana" | "api-settings" | "dokumentasi";

function DashboardContent() {
  return (
    <div>
      <h2 style={styles.pageTitle}>Ringkasan</h2>
      <div style={styles.stats}>
        <div style={styles.card}><span style={styles.cardLabel}>Total Pendapatan</span><h3 style={styles.cardValue}>Rp 0</h3></div>
        <div style={styles.card}><span style={styles.cardLabel}>Transaksi Sukses</span><h3 style={styles.cardValue}>0</h3></div>
        <div style={styles.card}><span style={styles.cardLabel}>Transaksi Gagal</span><h3 style={styles.cardValue}>0</h3></div>
        <div style={styles.card}><span style={styles.cardLabel}>Saldo Dompet</span><h3 style={styles.cardValue}>Rp 0</h3></div>
      </div>
      <div style={styles.emptyState}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "12px" }}>Belum ada data transaksi</p>
      </div>
    </div>
  );
}

function SandboxContent() {
  return (
    <div>
      <h2 style={styles.pageTitle}>Sandbox Panel</h2>
      <div style={{ ...styles.card, maxWidth: "500px" }}>
        <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "16px" }}>Mode sandbox aktif. Semua transaksi bersifat simulasi dan tidak menggunakan uang nyata.</p>
        <div style={styles.sandboxBadge}>⚠️ SANDBOX MODE</div>
      </div>
    </div>
  );
}

function TransaksiContent() {
  return (
    <div>
      <h2 style={styles.pageTitle}>Transaksi</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID Transaksi</th>
              <th style={styles.th}>Tanggal</th>
              <th style={styles.th}>Jumlah</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={4} style={styles.emptyRow}>Belum ada transaksi</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DompetContent() {
  return (
    <div>
      <h2 style={styles.pageTitle}>Dompet</h2>
      <div style={{ ...styles.card, maxWidth: "400px" }}>
        <span style={styles.cardLabel}>Saldo Tersedia</span>
        <h3 style={{ ...styles.cardValue, fontSize: "32px" }}>Rp 0</h3>
        <button style={styles.actionBtn}>Tarik Dana</button>
      </div>
    </div>
  );
}

function TarikDanaContent() {
  const [amount, setAmount] = useState("");
  return (
    <div>
      <h2 style={styles.pageTitle}>Tarik Dana</h2>
      <div style={{ ...styles.card, maxWidth: "420px" }}>
        <label style={styles.label}>Jumlah Penarikan</label>
        <input
          type="number"
          placeholder="Rp 0"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={styles.input}
        />
        <label style={styles.label}>Rekening Tujuan</label>
        <input type="text" placeholder="Nomor rekening" style={styles.input} />
        <button style={styles.actionBtn}>Ajukan Penarikan</button>
      </div>
    </div>
  );
}

function ApiSettingsContent() {
  const [show, setShow] = useState(false);
  const fakeKey = "sk-zyfay-••••••••••••••••••••••••••••";
  return (
    <div>
      <h2 style={styles.pageTitle}>API Settings</h2>
      <div style={{ ...styles.card, maxWidth: "520px" }}>
        <label style={styles.label}>API Key</label>
        <div style={styles.apiKeyRow}>
          <input type={show ? "text" : "password"} value={fakeKey} readOnly style={{ ...styles.input, flex: 1, marginBottom: 0 }} />
          <button onClick={() => setShow(!show)} style={styles.iconBtn}>{show ? "🙈" : "👁️"}</button>
        </div>
        <label style={styles.label} style={{ marginTop: "16px" }}>Webhook URL</label>
        <input type="url" placeholder="https://your-server.com/webhook" style={styles.input} />
        <button style={styles.actionBtn}>Simpan Pengaturan</button>
      </div>
    </div>
  );
}

function DokumentasiContent() {
  const [active, setActive] = useState("intro");
  const sections: { id: string; title: string; content: string }[] = [
    {
      id: "intro",
      title: "Pengenalan",
      content: `Zyfayment adalah payment gateway yang memungkinkan Anda menerima pembayaran secara online dengan mudah dan aman. API kami dirancang RESTful dan mudah diintegrasikan ke berbagai platform.`
    },
    {
      id: "auth",
      title: "Autentikasi",
      content: `Semua request ke API Zyfayment harus menyertakan API Key di header:\n\nAuthorization: Bearer YOUR_API_KEY\n\nAPI Key dapat ditemukan di menu API Settings. Jangan pernah share API Key Anda ke pihak lain.`
    },
    {
      id: "create-payment",
      title: "Membuat Pembayaran",
      content: `POST /v1/payments\n\nBody:\n{\n  "amount": 50000,\n  "currency": "IDR",\n  "description": "Pembayaran order #123",\n  "redirect_url": "https://your-site.com/success"\n}\n\nResponse:\n{\n  "id": "pay_abc123",\n  "status": "pending",\n  "payment_url": "https://pay.zyfayment.com/pay_abc123"\n}`
    },
    {
      id: "webhook",
      title: "Webhook",
      content: `Zyfayment akan mengirim notifikasi ke webhook URL Anda ketika status pembayaran berubah.\n\nEvent yang dikirim:\n- payment.success\n- payment.failed\n- payment.expired\n\nPastikan endpoint Anda merespons dengan HTTP 200.`
    },
    {
      id: "sandbox",
      title: "Mode Sandbox",
      content: `Gunakan mode Sandbox untuk testing tanpa uang nyata. Switch ke SANDBOX di sidebar.\n\nKartu test:\nNomor: 4242 4242 4242 4242\nExpiry: 12/29\nCVV: 123\n\nSemua transaksi sandbox tidak diproses secara nyata.`
    }
  ];

  const activeSection = sections.find(s => s.id === active)!;

  return (
    <div>
      <h2 style={styles.pageTitle}>Dokumentasi</h2>
      <div style={styles.docLayout}>
        <aside style={styles.docNav}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              style={{ ...styles.docNavItem, background: active === s.id ? "rgba(255,255,255,0.15)" : "transparent", borderLeft: active === s.id ? "3px solid #fff" : "3px solid transparent" }}
            >
              {s.title}
            </button>
          ))}
        </aside>
        <div style={styles.docContent}>
          <h3 style={{ color: "#fff", marginBottom: "12px" }}>{activeSection.title}</h3>
          <pre style={styles.docPre}>{activeSection.content}</pre>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"PROD" | "SANDBOX">("PROD");
  const [activePage, setActivePage] = useState<Page>("dashboard");

  const navigate = (page: Page) => {
    setActivePage(page);
    setIsOpen(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <DashboardContent />;
      case "sandbox": return <SandboxContent />;
      case "transaksi": return <TransaksiContent />;
      case "dompet": return <DompetContent />;
      case "tarik-dana": return <TarikDanaContent />;
      case "api-settings": return <ApiSettingsContent />;
      case "dokumentasi": return <DokumentasiContent />;
    }
  };

  const linkStyle = (page: Page): React.CSSProperties => ({
    ...styles.link,
    background: activePage === page ? "rgba(62,74,137,0.15)" : "transparent",
    borderRadius: "8px",
    padding: "10px 8px",
    color: activePage === page ? "#3e4a89" : "#555",
    fontWeight: activePage === page ? 600 : 400,
  });

  return (
    <div style={styles.page}>
      <div style={{ ...styles.overlay, display: isOpen ? "block" : "none" }} onClick={() => setIsOpen(false)} />

      <aside style={{ ...styles.sidebar, left: isOpen ? "0" : "-280px" }}>
        <div style={styles.brandContainer}><h2 style={{ margin: 0, color: "#3e4a89" }}>Zyfayment</h2></div>

        <div style={styles.modeSwitch}>
          <button style={{ ...styles.modeBtn, background: mode === "PROD" ? "#fff" : "transparent", color: mode === "PROD" ? "#3e4a89" : "#666" }} onClick={() => setMode("PROD")}>PROD</button>
          <button style={{ ...styles.modeBtn, background: mode === "SANDBOX" ? "#f59e0b" : "transparent", color: mode === "SANDBOX" ? "#fff" : "#666" }} onClick={() => setMode("SANDBOX")}>SANDBOX</button>
        </div>

        <nav style={styles.nav}>
          <button onClick={() => navigate("dashboard")} style={linkStyle("dashboard")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Dashboard
          </button>

          {mode === "SANDBOX" && (
            <button onClick={() => navigate("sandbox")} style={linkStyle("sandbox")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Sandbox Panel
            </button>
          )}

          <button onClick={() => navigate("transaksi")} style={linkStyle("transaksi")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Transaksi
          </button>

          <button onClick={() => navigate("dompet")} style={linkStyle("dompet")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14V12"/></svg> Dompet
          </button>

          <button onClick={() => navigate("tarik-dana")} style={linkStyle("tarik-dana")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Tarik Dana
          </button>

          <div style={styles.divider}>API & PENGATURAN</div>

          <button onClick={() => navigate("api-settings")} style={linkStyle("api-settings")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> API Settings
          </button>

          <button onClick={() => navigate("dokumentasi")} style={linkStyle("dokumentasi")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Dokumentasi
          </button>
        </nav>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <button onClick={() => setIsOpen(true)} style={styles.menuBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div style={styles.headerRight}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <div style={styles.avatar}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>
        </header>

        {renderPage()}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #1e1e2f, #3e4a89)", color: "#fff", fontFamily: "'Inter', sans-serif" },
  sidebar: { position: "fixed", top: 0, width: "260px", height: "100vh", background: "#fff", color: "#333", padding: "20px", transition: "0.3s", zIndex: 10, boxShadow: "2px 0 10px rgba(0,0,0,0.2)", overflowY: "auto" },
  link: { display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", fontSize: "14px", border: "none", cursor: "pointer", width: "100%", textAlign: "left" },
  menuBtn: { background: "none", border: "none", color: "#fff", cursor: "pointer" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 9 },
  brandContainer: { marginBottom: "30px" },
  modeSwitch: { display: "flex", background: "#eee", borderRadius: "8px", padding: "4px", marginBottom: "20px" },
  modeBtn: { flex: 1, border: "none", padding: "8px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" },
  nav: { display: "flex", flexDirection: "column", gap: "2px" },
  divider: { fontSize: "11px", color: "#999", marginTop: "20px", marginBottom: "10px", fontWeight: "bold", paddingLeft: "8px" },
  main: { padding: "20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerRight: { display: "flex", gap: "15px", alignItems: "center" },
  avatar: { width: "35px", height: "35px", background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "2px solid rgba(255,255,255,0.2)" },
  pageTitle: { marginTop: "20px", marginBottom: "16px", fontSize: "22px" },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginTop: "8px" },
  card: { background: "rgba(255,255,255,0.1)", padding: "18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)" },
  cardLabel: { fontSize: "13px", color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "6px" },
  cardValue: { margin: 0, fontSize: "24px", fontWeight: 700 },
  emptyState: { textAlign: "center", marginTop: "60px", opacity: 0.7 },
  sandboxBadge: { background: "#f59e0b", color: "#fff", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", display: "inline-block", fontSize: "13px" },
  tableWrapper: { background: "rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "rgba(255,255,255,0.6)", borderBottom: "1px solid rgba(255,255,255,0.1)", fontWeight: 600 },
  emptyRow: { padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "14px" },
  label: { display: "block", fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "6px", marginTop: "12px" },
  input: { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  actionBtn: { marginTop: "20px", padding: "10px 20px", borderRadius: "8px", border: "none", background: "#3e4a89", color: "#fff", fontWeight: "bold", cursor: "pointer", fontSize: "14px" },
  apiKeyRow: { display: "flex", gap: "8px", alignItems: "center" },
  iconBtn: { background: "rgba(255,255,255,0.1)", border: "none", padding: "10px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "16px" },
  docLayout: { display: "flex", gap: "20px", marginTop: "8px" },
  docNav: { width: "180px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "2px" },
  docNavItem: { padding: "10px 12px", border: "none", background: "transparent", color: "rgba(255,255,255,0.8)", cursor: "pointer", textAlign: "left", fontSize: "14px", borderRadius: "0 8px 8px 0", transition: "background 0.2s" },
  docContent: { flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: "12px", padding: "20px" },
  docPre: { margin: 0, whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.85)", fontSize: "13px", lineHeight: "1.7", fontFamily: "'Courier New', monospace" },
};
