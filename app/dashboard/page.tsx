"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Page = "dashboard" | "sandbox" | "transaksi" | "dompet" | "tarik-dana" | "api-settings" | "dokumentasi";
type Notif = { id: string; title: string; body: string; read: boolean; created_at: string };

const BellIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const XIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const CheckIcon = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const TrashIcon = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const UserIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

function NotifPopup({ userId, onClose, onUnreadChange }: { userId: string; onClose: () => void; onUnreadChange: (n: number) => void }) {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) {
      setNotifs(data);
      onUnreadChange(data.filter((n: Notif) => !n.read).length);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifs();
    const channel = supabase
      .channel("notif-" + userId)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: "user_id=eq." + userId }, () => { fetchNotifs(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifs(updated);
    onUnreadChange(updated.filter(n => !n.read).length);
  };

  const deleteNotif = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    const next = notifs.filter(n => n.id !== id);
    setNotifs(next);
    onUnreadChange(next.filter(n => !n.read).length);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)" }} onClick={onClose}>
      <div style={{ position: "absolute", top: "62px", right: "16px", width: "340px", background: "#131424", borderRadius: "16px", boxShadow: "0 16px 48px rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <BellIcon size={16} color="#a5b4fc" />
            <span style={{ fontWeight: 700, fontSize: "13px", color: "#fff" }}>Pemberitahuan</span>
          </div>
          <button style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "8px", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
            <XIcon size={16} color="rgba(255,255,255,0.5)" />
          </button>
        </div>
        <div style={{ maxHeight: "380px", overflowY: "auto", padding: "8px" }}>
          {loading && <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "24px", fontSize: "13px", margin: 0 }}>Memuat...</p>}
          {!loading && notifs.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "36px 16px" }}>
              <BellIcon size={32} color="rgba(255,255,255,0.15)" />
              <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>Tidak ada pemberitahuan</p>
            </div>
          )}
          {notifs.map(n => (
            <div key={n.id} style={{ borderRadius: "10px", padding: "12px 14px", marginBottom: "6px", borderLeft: n.read ? "3px solid transparent" : "3px solid #6c7ee1", background: n.read ? "rgba(255,255,255,0.03)" : "rgba(108,126,225,0.12)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6c7ee1", flexShrink: 0, opacity: n.read ? 0 : 1, display: "block" }} />
                <span style={{ fontWeight: 600, fontSize: "13px", color: "#fff" }}>{n.title}</span>
              </div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: "1.55", margin: "0 0 10px 14px" }}>{n.body}</p>
              <div style={{ display: "flex", gap: "6px", marginLeft: "14px" }}>
                {!n.read && (
                  <button onClick={() => markRead(n.id)} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", padding: "5px 10px", borderRadius: "6px", border: "1px solid rgba(108,126,225,0.4)", background: "rgba(108,126,225,0.15)", color: "#a5b4fc", cursor: "pointer", fontWeight: 600 }}>
                    <CheckIcon size={12} color="#a5b4fc" /> Tandai dibaca
                  </button>
                )}
                <button onClick={() => deleteNotif(n.id)} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", padding: "5px 10px", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#fca5a5", cursor: "pointer", fontWeight: 600 }}>
                  <TrashIcon size={12} color="#fca5a5" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const DOC_SECTIONS = [
  { id: "pengenalan", title: "Pengenalan", blocks: [{ type: "p", text: "Zyfayment menggunakan Pakasir sebagai payment gateway. Pakasir mendukung QRIS, Virtual Account multi-bank, dan e-wallet Indonesia." }, { type: "p", text: "Daftar dan buat proyek di app.pakasir.com. Setelah proyek dibuat, salin Slug dan API Key dari halaman detail proyek — keduanya dibutuhkan untuk semua request API." }] },
  { id: "setup", title: "Setup", blocks: [{ type: "p", text: "Langkah awal integrasi Pakasir ke Zyfayment:" }, { type: "ol", items: ["Daftar di app.pakasir.com dan buat proyek baru", "Salin Slug dan API Key dari halaman detail proyek", "Masukkan keduanya di menu API Settings", "Set Webhook URL di dashboard Pakasir: https://yourdomain.com/api/webhook"] }, { type: "p", text: "Untuk mode Sandbox, aktifkan toggle di dashboard Pakasir dan di sidebar Zyfayment." }] },
  { id: "buat-pembayaran", title: "Buat Pembayaran", blocks: [{ type: "p", text: "Kirim request POST ke endpoint Pakasir untuk membuat link pembayaran:" }, { type: "code", text: 'POST https://app.pakasir.com/api/pay/{slug}\n\nHeaders:\n  Content-Type: application/json\n\nBody:\n{\n  "order_id": "ORDER-001",\n  "amount": 50000,\n  "api_key": "YOUR_API_KEY",\n  "redirect_url": "https://domain.com/thanks"\n}\n\nResponse:\n{\n  "payment_url": "https://app.pakasir.com/pay/...",\n  "order_id": "ORDER-001",\n  "amount": 50000,\n  "expired_at": "2025-01-01T12:00:00Z"\n}' }, { type: "p", text: "Arahkan user ke payment_url. Pakasir menangani halaman pilih metode pembayaran." }] },
  { id: "webhook", title: "Webhook", blocks: [{ type: "p", text: "Pakasir mengirim POST ke webhook URL Anda saat status pembayaran berubah:" }, { type: "code", text: '{\n  "order_id": "ORDER-001",\n  "amount": 50000,\n  "status": "completed",\n  "payment_method": "qris",\n  "project": "your-slug",\n  "completed_at": "2025-01-01T11:58:00Z"\n}' }, { type: "p", text: "Status yang mungkin diterima:" }, { type: "ul", items: ["pending — menunggu pembayaran", "completed — pembayaran berhasil", "expired — waktu kadaluarsa", "canceled — dibatalkan user"] }, { type: "p", text: "Endpoint webhook harus merespons HTTP 200 agar Pakasir tidak retry." }] },
  { id: "cek-status", title: "Cek Status", blocks: [{ type: "p", text: "Gunakan endpoint ini untuk polling status pembayaran secara manual:" }, { type: "code", text: 'GET https://app.pakasir.com/api/status/{slug}/{order_id}?api_key=YOUR_API_KEY\n\nResponse:\n{\n  "order_id": "ORDER-001",\n  "amount": 50000,\n  "status": "completed",\n  "payment_method": "qris"\n}' }] },
  { id: "sandbox", title: "Sandbox", blocks: [{ type: "p", text: "Mode sandbox memungkinkan testing pembayaran tanpa uang nyata. Aktifkan di dashboard Pakasir, lalu gunakan API simulasi:" }, { type: "code", text: 'POST https://app.pakasir.com/api/paymentsimulation\n\nBody:\n{\n  "project": "your-slug",\n  "order_id": "ORDER-001",\n  "amount": 10000,\n  "api_key": "YOUR_API_KEY"\n}' }, { type: "p", text: "Minimum amount simulasi: Rp 10.000. Gunakan tombol Simulasi Pembayaran di halaman pay Pakasir untuk trigger webhook instan." }] },
  { id: "metode", title: "Metode", blocks: [{ type: "p", text: "Pakasir mendukung metode pembayaran berikut:" }, { type: "ul", items: ["QRIS — semua e-wallet & bank yang support QRIS", "VA BCA, BNI, BRI, Mandiri, Permata, BSI, CIMB", "GoPay & ShopeePay (e-wallet langsung)", "Alfamart & Indomaret (ritel)"] }, { type: "p", text: "Cek biaya per metode di pakasir.com/biaya." }] },
];

function DocBlock({ block }: { block: { type: string; text?: string; items?: string[] } }) {
  const base: React.CSSProperties = { fontSize: "13px", lineHeight: "1.75", color: "rgba(255,255,255,0.8)", margin: "0 0 12px" };
  if (block.type === "p") return <p style={base}>{block.text}</p>;
  if (block.type === "code") return <pre style={{ ...base, background: "rgba(0,0,0,0.4)", borderRadius: "8px", padding: "14px", fontFamily: "monospace", overflowX: "auto", border: "1px solid rgba(255,255,255,0.07)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{block.text}</pre>;
  if (block.type === "ul") return <ul style={{ ...base, paddingLeft: "20px" }}>{block.items!.map((item, i) => <li key={i} style={{ marginBottom: "4px" }}>{item}</li>)}</ul>;
  if (block.type === "ol") return <ol style={{ ...base, paddingLeft: "20px" }}>{block.items!.map((item, i) => <li key={i} style={{ marginBottom: "4px" }}>{item}</li>)}</ol>;
  return null;
}

function DokumentasiContent() {
  const [active, setActive] = useState("pengenalan");
  const sec = DOC_SECTIONS.find(s => s.id === active)!;
  return (
    <div>
      <h2 style={S.pageTitle}>Dokumentasi</h2>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", margin: "-8px 0 16px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Powered by Pakasir</p>
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
        <nav style={{ width: "130px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
          {DOC_SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)} style={{ padding: "8px 10px", border: "none", background: active === s.id ? "rgba(108,126,225,0.2)" : "transparent", borderLeft: active === s.id ? "2px solid #6c7ee1" : "2px solid transparent", color: active === s.id ? "#c7d2fe" : "rgba(255,255,255,0.4)", cursor: "pointer", textAlign: "left", fontSize: "12px", fontWeight: active === s.id ? 600 : 400, borderRadius: "0 6px 6px 0", transition: "0.15s" }}>
              {s.title}
            </button>
          ))}
        </nav>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "18px 20px", border: "1px solid rgba(255,255,255,0.08)", minHeight: "300px", overflowY: "auto", maxHeight: "60vh" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: 700, color: "#fff" }}>{sec.title}</h3>
          {sec.blocks.map((b, i) => <DocBlock key={i} block={b} />)}
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  return (
    <div>
      <h2 style={S.pageTitle}>Ringkasan</h2>
      <div style={S.stats}>
        {[["Total Pendapatan", "Rp 0"], ["Transaksi Sukses", "0"], ["Transaksi Gagal", "0"], ["Saldo Dompet", "Rp 0"]].map(([label, val]) => (
          <div key={label} style={S.card}><span style={S.cardLabel}>{label}</span><h3 style={S.cardValue}>{val}</h3></div>
        ))}
      </div>
      <div style={S.emptyState}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        <p style={{ color: "rgba(255,255,255,0.3)", marginTop: "10px", fontSize: "13px" }}>Belum ada data transaksi</p>
      </div>
    </div>
  );
}

function SandboxContent() {
  return (
    <div>
      <h2 style={S.pageTitle}>Sandbox Panel</h2>
      <div style={{ ...S.card, maxWidth: "460px" }}>
        <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "14px", fontSize: "14px" }}>Mode sandbox aktif. Transaksi bersifat simulasi.</p>
        <span style={{ background: "#f59e0b", color: "#fff", padding: "6px 14px", borderRadius: "6px", fontWeight: 700, fontSize: "12px", letterSpacing: "0.05em" }}>SANDBOX MODE</span>
      </div>
    </div>
  );
}

function TransaksiContent() {
  return (
    <div>
      <h2 style={S.pageTitle}>Transaksi</h2>
      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead><tr>{["ID Transaksi", "Tanggal", "Jumlah", "Status"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody><tr><td colSpan={4} style={S.emptyRow}>Belum ada transaksi</td></tr></tbody>
        </table>
      </div>
    </div>
  );
}

function DompetContent() {
  return (
    <div>
      <h2 style={S.pageTitle}>Dompet</h2>
      <div style={{ ...S.card, maxWidth: "380px" }}>
        <span style={S.cardLabel}>Saldo Tersedia</span>
        <h3 style={{ ...S.cardValue, fontSize: "30px", margin: "6px 0 16px" }}>Rp 0</h3>
        <button style={S.actionBtn}>Tarik Dana</button>
      </div>
    </div>
  );
}

function TarikDanaContent() {
  const [amount, setAmount] = useState("");
  return (
    <div>
      <h2 style={S.pageTitle}>Tarik Dana</h2>
      <div style={{ ...S.card, maxWidth: "400px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <label style={S.label}>Jumlah Penarikan<input type="number" placeholder="Rp 0" value={amount} onChange={e => setAmount(e.target.value)} style={S.input} /></label>
        <label style={S.label}>Rekening Tujuan<input type="text" placeholder="Nomor rekening" style={S.input} /></label>
        <button style={{ ...S.actionBtn, marginTop: "4px" }}>Ajukan Penarikan</button>
      </div>
    </div>
  );
}

function ApiSettingsContent() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <h2 style={S.pageTitle}>API Settings</h2>
      <div style={{ ...S.card, maxWidth: "500px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <label style={S.label}>API Key (Pakasir)
          <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
            <input type={show ? "text" : "password"} defaultValue="sk-pakasir-xxxxxxxxxxxxxxxxxxx" readOnly style={{ ...S.input, marginTop: 0, flex: 1 }} />
            <button onClick={() => setShow(!show)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", borderRadius: "8px", padding: "0 12px", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>{show ? "Sembunyikan" : "Tampilkan"}</button>
          </div>
        </label>
        <label style={S.label}>Project Slug<input type="text" placeholder="your-project-slug" style={S.input} /></label>
        <label style={S.label}>Webhook URL<input type="url" placeholder="https://domain.com/api/webhook" style={S.input} /></label>
        <button style={S.actionBtn}>Simpan Pengaturan</button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"PROD" | "SANDBOX">("PROD");
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [showNotif, setShowNotif] = useState(false);
  const [unread, setUnread] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id);
    });
  }, []);

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

  const navBtn = (page: Page, icon: React.ReactNode, label: string) => (
    <button onClick={() => navigate(page)} style={{ display: "flex", alignItems: "center", gap: "10px", background: activePage === page ? "rgba(62,74,137,0.1)" : "transparent", border: "none", borderRadius: "8px", padding: "10px", color: activePage === page ? "#3e4a89" : "#666", fontWeight: activePage === page ? 600 : 400, fontSize: "14px", cursor: "pointer", width: "100%", textAlign: "left" }}>
      {icon}{label}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1e1e2f,#3e4a89)", color: "#fff", fontFamily: "'Inter',sans-serif" }}>
      {showNotif && userId && <NotifPopup userId={userId} onClose={() => setShowNotif(false)} onUnreadChange={setUnread} />}
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9, display: isOpen ? "block" : "none" }} onClick={() => setIsOpen(false)} />

      <aside style={{ position: "fixed", top: 0, width: "256px", height: "100vh", background: "#fafafa", padding: "22px 16px", transition: "left 0.3s", zIndex: 10, boxShadow: "2px 0 12px rgba(0,0,0,0.15)", overflowY: "auto", left: isOpen ? "0" : "-280px" }}>
        <div style={{ marginBottom: "26px" }}><h2 style={{ margin: 0, color: "#3e4a89", fontSize: "20px", fontWeight: 800 }}>Zyfayment</h2></div>
        <div style={{ display: "flex", background: "#eee", borderRadius: "8px", padding: "3px", marginBottom: "18px", gap: "2px" }}>
          <button onClick={() => setMode("PROD")} style={{ flex: 1, border: "none", padding: "7px", borderRadius: "6px", fontWeight: 700, cursor: "pointer", fontSize: "11px", letterSpacing: "0.04em", background: mode === "PROD" ? "#fff" : "transparent", color: mode === "PROD" ? "#3e4a89" : "#999" }}>PROD</button>
          <button onClick={() => setMode("SANDBOX")} style={{ flex: 1, border: "none", padding: "7px", borderRadius: "6px", fontWeight: 700, cursor: "pointer", fontSize: "11px", letterSpacing: "0.04em", background: mode === "SANDBOX" ? "#f59e0b" : "transparent", color: mode === "SANDBOX" ? "#fff" : "#999" }}>SANDBOX</button>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {navBtn("dashboard", <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, "Dashboard")}
          {mode === "SANDBOX" && navBtn("sandbox", <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, "Sandbox Panel")}
          {navBtn("transaksi", <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>, "Transaksi")}
          {navBtn("dompet", <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14V12"/></svg>, "Dompet")}
          {navBtn("tarik-dana", <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, "Tarik Dana")}
          <div style={{ fontSize: "10px", color: "#bbb", marginTop: "18px", marginBottom: "8px", fontWeight: 700, paddingLeft: "10px", letterSpacing: "0.08em" }}>API & PENGATURAN</div>
          {navBtn("api-settings", <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, "API Settings")}
          {navBtn("dokumentasi", <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, "Dokumentasi")}
        </nav>
      </aside>

      <main style={{ padding: "20px 18px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setIsOpen(true)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", borderRadius: "10px", width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button onClick={() => setShowNotif(v => !v)} style={{ position: "relative", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "10px", width: "38px", height: "38px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BellIcon size={18} />
              {unread > 0 && <span style={{ position: "absolute", top: "6px", right: "6px", width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", border: "2px solid #1e1e2f" }} />}
            </button>
            <a href="/user/profile" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", width: "38px", height: "38px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "#fff" }}>
              <UserIcon size={18} color="#fff" />
            </a>
          </div>
        </header>
        {renderPage()}
      </main>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  pageTitle: { marginTop: "22px", marginBottom: "16px", fontSize: "20px", fontWeight: 700 },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "12px" },
  card: { background: "rgba(255,255,255,0.08)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" },
  cardLabel: { fontSize: "12px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "6px", fontWeight: 500 },
  cardValue: { margin: 0, fontSize: "22px", fontWeight: 700 },
  emptyState: { textAlign: "center", marginTop: "56px" },
  tableWrapper: { background: "rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "11px 14px", textAlign: "left", fontSize: "11px", color: "rgba(255,255,255,0.5)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" },
  emptyRow: { padding: "36px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px" },
  label: { fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", display: "flex", flexDirection: "column", gap: "6px" },
  input: { marginTop: "2px", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" },
  actionBtn: { padding: "10px 20px", borderRadius: "8px", border: "none", background: "#3e4a89", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "14px" },
};
