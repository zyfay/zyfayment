"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Page = "dashboard" | "sandbox" | "transaksi" | "dompet" | "tarik-dana" | "api-settings" | "dokumentasi";
type Notif = { id: string; title: string; body: string; is_read: boolean; created_at: string };

/* ══════════════════════════════════════════════════════
   NOTIFICATION POPUP — real-time via Supabase
══════════════════════════════════════════════════════ */
function NotifPopup({ onClose, onUnreadChange }: { onClose: () => void; onUnreadChange: (n: number) => void }) {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) {
      setNotifs(data);
      onUnreadChange(data.filter((n: Notif) => !n.is_read).length);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifs();
    const channel = supabase
      .channel("notifications-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => fetchNotifs())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifs(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, is_read: true } : n);
      onUnreadChange(updated.filter(n => !n.is_read).length);
      return updated;
    });
  };

  const deleteNotif = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    setNotifs(prev => {
      const updated = prev.filter(n => n.id !== id);
      onUnreadChange(updated.filter(n => !n.is_read).length);
      return updated;
    });
  };

  return (
    <div style={np.backdrop} onClick={onClose}>
      <div style={np.panel} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={np.header}>
          <div>
            <p style={np.headerTitle}>Pemberitahuan</p>
            <p style={np.headerSub}>Pesan dari admin</p>
          </div>
          <button onClick={onClose} style={np.closeBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* List */}
        <div style={np.list}>
          {loading && <p style={np.stateText}>Memuat...</p>}
          {!loading && notifs.length === 0 && (
            <div style={np.emptyWrap}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <p style={np.stateText}>Tidak ada pemberitahuan</p>
            </div>
          )}
          {notifs.map(n => (
            <div key={n.id} style={{ ...np.item, borderLeft: n.is_read ? "2px solid transparent" : "2px solid #6c7ee1", background: n.is_read ? "transparent" : "rgba(108,126,225,0.08)" }}>
              <div style={np.itemTop}>
                <p style={{ ...np.itemTitle, opacity: n.is_read ? 0.5 : 1 }}>{n.title}</p>
                <p style={np.itemTime}>{new Date(n.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <p style={np.itemBody}>{n.body}</p>
              <div style={np.itemActions}>
                {!n.is_read && (
                  <button onClick={() => markRead(n.id)} style={np.btnRead}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Tandai dibaca
                  </button>
                )}
                <button onClick={() => deleteNotif(n.id)} style={np.btnDelete}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const np: Record<string, React.CSSProperties> = {
  backdrop: { position: "fixed", inset: 0, zIndex: 100 },
  panel: { position: "absolute", top: "58px", right: "16px", width: "340px", background: "#141523", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  headerTitle: { margin: 0, fontWeight: 700, fontSize: "14px", color: "#fff" },
  headerSub: { margin: "2px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.35)" },
  closeBtn: { background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", borderRadius: "8px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  list: { maxHeight: "380px", overflowY: "auto", padding: "8px" },
  emptyWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "36px 16px" },
  stateText: { margin: 0, textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "13px" },
  item: { borderRadius: "10px", padding: "12px 14px", marginBottom: "6px", transition: "background 0.2s" },
  itemTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "4px" },
  itemTitle: { margin: 0, fontWeight: 600, fontSize: "13px", color: "#fff", lineHeight: 1.3 },
  itemTime: { margin: 0, fontSize: "10px", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap", flexShrink: 0 },
  itemBody: { margin: "0 0 10px", fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 },
  itemActions: { display: "flex", gap: "6px" },
  btnRead: { display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", padding: "5px 10px", borderRadius: "7px", border: "1px solid rgba(108,126,225,0.4)", background: "transparent", color: "#8b9cf4", cursor: "pointer", fontWeight: 600, letterSpacing: "0.01em" },
  btnDelete: { display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", padding: "5px 10px", borderRadius: "7px", border: "1px solid rgba(255,80,80,0.3)", background: "transparent", color: "#f87171", cursor: "pointer", fontWeight: 600, letterSpacing: "0.01em" },
};

/* ══════════════════════════════════════════════════════
   PAGE CONTENTS
══════════════════════════════════════════════════════ */
function DashboardContent() {
  return (
    <div>
      <h2 style={s.pageTitle}>Ringkasan</h2>
      <div style={s.stats}>
        {[["Total Pendapatan","Rp 0"],["Transaksi Sukses","0"],["Transaksi Gagal","0"],["Saldo Dompet","Rp 0"]].map(([label, val]) => (
          <div key={label} style={s.card}><span style={s.cardLabel}>{label}</span><h3 style={s.cardValue}>{val}</h3></div>
        ))}
      </div>
      <div style={s.emptyState}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        <p style={{ color: "rgba(255,255,255,0.3)", marginTop: "10px", fontSize: "14px" }}>Belum ada data transaksi</p>
      </div>
    </div>
  );
}

function SandboxContent() {
  return (
    <div>
      <h2 style={s.pageTitle}>Sandbox Panel</h2>
      <div style={{ ...s.card, maxWidth: "500px" }}>
        <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "16px", fontSize: "14px" }}>Mode sandbox aktif. Semua transaksi bersifat simulasi dan tidak menggunakan uang nyata.</p>
        <span style={s.sandboxBadge}>SANDBOX MODE</span>
      </div>
    </div>
  );
}

function TransaksiContent() {
  return (
    <div>
      <h2 style={s.pageTitle}>Transaksi</h2>
      <div style={s.tableWrapper}>
        <table style={s.table}>
          <thead><tr>{["ID Transaksi","Tanggal","Jumlah","Status"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody><tr><td colSpan={4} style={s.emptyRow}>Belum ada transaksi</td></tr></tbody>
        </table>
      </div>
    </div>
  );
}

function DompetContent() {
  return (
    <div>
      <h2 style={s.pageTitle}>Dompet</h2>
      <div style={{ ...s.card, maxWidth: "400px" }}>
        <span style={s.cardLabel}>Saldo Tersedia</span>
        <h3 style={{ ...s.cardValue, fontSize: "30px", margin: "8px 0 20px" }}>Rp 0</h3>
        <button style={s.actionBtn}>Tarik Dana</button>
      </div>
    </div>
  );
}

function TarikDanaContent() {
  const [amount, setAmount] = useState("");
  return (
    <div>
      <h2 style={s.pageTitle}>Tarik Dana</h2>
      <div style={{ ...s.card, maxWidth: "420px" }}>
        <label style={s.label}>Jumlah Penarikan</label>
        <input type="number" placeholder="Rp 0" value={amount} onChange={e => setAmount(e.target.value)} style={s.input} />
        <label style={s.label}>Rekening Tujuan</label>
        <input type="text" placeholder="Nomor rekening" style={s.input} />
        <button style={{ ...s.actionBtn, marginTop: "20px" }}>Ajukan Penarikan</button>
      </div>
    </div>
  );
}

function ApiSettingsContent() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <h2 style={s.pageTitle}>API Settings</h2>
      <div style={{ ...s.card, maxWidth: "520px" }}>
        <label style={s.label}>API Key (Pakasir)</label>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <input type={show ? "text" : "password"} defaultValue="sk-zyfay-••••••••••••••••••••••" readOnly style={{ ...s.input, flex: 1, margin: 0 }} />
          <button onClick={() => setShow(!show)} style={s.iconBtn}>
            {show
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        </div>
        <label style={s.label}>Project Slug (Pakasir)</label>
        <input type="text" placeholder="your-project-slug" style={s.input} />
        <label style={s.label}>Webhook URL</label>
        <input type="url" placeholder="https://your-domain.com/api/webhook" style={s.input} />
        <button style={{ ...s.actionBtn, marginTop: "20px" }}>Simpan Pengaturan</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   DOKUMENTASI — Pakasir, padat, scroll penuh
══════════════════════════════════════════════════════ */
const DOC_SECTIONS = [
  {
    id: "intro", title: "Pengenalan",
    blocks: [
      { type: "text", content: "Zyfayment menggunakan Pakasir sebagai payment gateway utama. Pakasir mendukung QRIS, Virtual Account multi-bank, dan e-wallet untuk pasar Indonesia." },
      { type: "text", content: "Daftar dan buat proyek di app.pakasir.com. Setelah proyek dibuat, salin Slug dan API Key dari halaman detail proyek — keduanya wajib untuk integrasi." },
    ]
  },
  {
    id: "setup", title: "Setup Awal",
    blocks: [
      { type: "text", content: "Langkah integrasi Pakasir ke Zyfayment:" },
      { type: "list", items: ["Daftar di app.pakasir.com dan buat Proyek baru", "Salin Slug & API Key dari halaman detail proyek", "Masukkan keduanya di menu API Settings dashboard ini", "Set Webhook URL di pengaturan proyek Pakasir: https://yourdomain.com/api/webhook", "Untuk Sandbox, aktifkan toggle di dashboard Pakasir dan di sidebar ini"] },
    ]
  },
  {
    id: "create-payment", title: "Buat Pembayaran",
    blocks: [
      { type: "text", content: "Kirim request berikut ke API Pakasir untuk membuat link pembayaran:" },
      { type: "code", content: `POST https://app.pakasir.com/api/pay/{slug}\nContent-Type: application/json\n\n{\n  "order_id": "ORDER-001",\n  "amount": 50000,\n  "api_key": "YOUR_API_KEY",\n  "redirect_url": "https://yourdomain.com/thanks"\n}` },
      { type: "text", content: "Response akan mengandung payment_url. Arahkan user ke URL tersebut untuk menyelesaikan pembayaran." },
      { type: "code", content: `{\n  "payment_url": "https://app.pakasir.com/pay/...",\n  "order_id": "ORDER-001",\n  "amount": 50000,\n  "expired_at": "2025-01-01T12:00:00Z"\n}` },
    ]
  },
  {
    id: "webhook", title: "Webhook",
    blocks: [
      { type: "text", content: "Pakasir mengirim POST ke webhook URL Anda ketika status pembayaran berubah. Pastikan endpoint merespons HTTP 200." },
      { type: "code", content: `{\n  "order_id": "ORDER-001",\n  "amount": 50000,\n  "status": "completed",\n  "payment_method": "qris",\n  "project": "your-slug",\n  "completed_at": "2025-01-01T11:58:00Z"\n}` },
      { type: "list", items: ["pending — menunggu pembayaran", "completed — pembayaran berhasil", "expired — waktu habis", "canceled — dibatalkan"] },
    ]
  },
  {
    id: "status", title: "Cek Status",
    blocks: [
      { type: "text", content: "Gunakan endpoint ini untuk polling status jika webhook belum diterima:" },
      { type: "code", content: `GET https://app.pakasir.com/api/status/{slug}/{order_id}\n    ?api_key=YOUR_API_KEY` },
      { type: "code", content: `{\n  "order_id": "ORDER-001",\n  "amount": 50000,\n  "status": "completed",\n  "payment_method": "qris"\n}` },
    ]
  },
  {
    id: "sandbox", title: "Sandbox",
    blocks: [
      { type: "text", content: "Aktifkan sandbox di dashboard Pakasir untuk testing tanpa uang nyata. Minimal amount Rp 10.000." },
      { type: "text", content: "Simulasi pembayaran via API:" },
      { type: "code", content: `POST https://app.pakasir.com/api/paymentsimulation\n\n{\n  "project": "your-slug",\n  "order_id": "ORDER-001",\n  "amount": 10000,\n  "api_key": "YOUR_API_KEY"\n}` },
    ]
  },
  {
    id: "methods", title: "Metode Bayar",
    blocks: [
      { type: "text", content: "Pakasir mendukung metode pembayaran berikut:" },
      { type: "list", items: ["QRIS — GoPay, OVO, Dana, ShopeePay, dan semua e-wallet QRIS", "Virtual Account — BCA, BNI, BRI, Mandiri, Permata, BSI, CIMB", "E-Wallet langsung — GoPay, ShopeePay"] },
      { type: "text", content: "Cek biaya terbaru di pakasir.com/biaya" },
    ]
  },
];

function DocBlock({ block }: { block: { type: string; content?: string; items?: string[] } }) {
  if (block.type === "text") return <p style={doc.text}>{block.content}</p>;
  if (block.type === "list") return (
    <ul style={doc.ul}>{block.items!.map((item, i) => <li key={i} style={doc.li}>{item}</li>)}</ul>
  );
  if (block.type === "code") return <pre style={doc.code}>{block.content}</pre>;
  return null;
}

function DokumentasiContent() {
  const [active, setActive] = useState("intro");
  const section = DOC_SECTIONS.find(s => s.id === active)!;
  return (
    <div>
      <h2 style={s.pageTitle}>Dokumentasi</h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: "-8px 0 16px", fontWeight: 500, letterSpacing: "0.05em" }}>POWERED BY PAKASIR</p>
      <div style={doc.layout}>
        {/* Sidebar nav */}
        <nav style={doc.nav}>
          {DOC_SECTIONS.map(sec => (
            <button key={sec.id} onClick={() => setActive(sec.id)} style={{ ...doc.navBtn, background: active === sec.id ? "rgba(108,126,225,0.15)" : "transparent", color: active === sec.id ? "#a5b4fc" : "rgba(255,255,255,0.45)", borderLeft: active === sec.id ? "2px solid #6c7ee1" : "2px solid transparent", fontWeight: active === sec.id ? 600 : 400 }}>
              {sec.title}
            </button>
          ))}
        </nav>
        {/* Content */}
        <div style={doc.content}>
          <h3 style={doc.sectionTitle}>{section.title}</h3>
          {section.blocks.map((block, i) => <DocBlock key={i} block={block} />)}
        </div>
      </div>
    </div>
  );
}

const doc: Record<string, React.CSSProperties> = {
  layout: { display: "flex", gap: "16px", alignItems: "flex-start" },
  nav: { width: "148px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "2px", position: "sticky", top: "20px" },
  navBtn: { padding: "9px 12px", border: "none", cursor: "pointer", textAlign: "left", fontSize: "13px", borderRadius: "0 8px 8px 0", transition: "all 0.15s" },
  content: { flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "14px", padding: "20px 24px", minHeight: "300px" },
  sectionTitle: { margin: "0 0 16px", fontSize: "16px", fontWeight: 700, color: "#fff" },
  text: { margin: "0 0 12px", fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.75 },
  ul: { margin: "0 0 12px", paddingLeft: "18px" },
  li: { fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: "4px" },
  code: { margin: "0 0 14px", padding: "14px 16px", borderRadius: "10px", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.07)", fontSize: "12px", color: "#a5f3fc", fontFamily: "'Courier New', monospace", whiteSpace: "pre-wrap", lineHeight: 1.7, overflowX: "auto" },
};

/* ══════════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"PROD" | "SANDBOX">("PROD");
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [showNotif, setShowNotif] = useState(false);
  const [unread, setUnread] = useState(0);

  const navigate = (page: Page) => { setActivePage(page); setIsOpen(false); };

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
    ...s.navLink,
    background: activePage === page ? "rgba(62,74,137,0.1)" : "transparent",
    color: activePage === page ? "#3e4a89" : "#666",
    fontWeight: activePage === page ? 600 : 400,
    borderLeft: activePage === page ? "3px solid #3e4a89" : "3px solid transparent",
  });

  return (
    <div style={s.page}>
      {showNotif && <NotifPopup onClose={() => setShowNotif(false)} onUnreadChange={setUnread} />}
      <div style={{ ...s.sideOverlay, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }} onClick={() => setIsOpen(false)} />

      {/* Sidebar */}
      <aside style={{ ...s.sidebar, transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <div style={s.brand}>
          <div style={s.brandDot} />
          <span style={s.brandName}>Zyfayment</span>
        </div>

        <div style={s.modeWrap}>
          <button onClick={() => setMode("PROD")} style={{ ...s.modeBtn, background: mode === "PROD" ? "#fff" : "transparent", color: mode === "PROD" ? "#3e4a89" : "#999", boxShadow: mode === "PROD" ? "0 1px 4px rgba(0,0,0,0.12)" : "none" }}>Production<
