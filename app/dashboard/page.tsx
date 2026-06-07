"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Page = "dashboard" | "sandbox" | "transaksi" | "dompet" | "tarik-dana" | "api-settings" | "dokumentasi";

/* ═══════════════════════════════════════════
   NOTIFIKASI — real-time dari Supabase
   Buat tabel: notifications(id, user_id, title, body, read, created_at)
   Admin insert row → langsung muncul di sini
═══════════════════════════════════════════ */
type Notif = { id: string; title: string; body: string; read: boolean; created_at: string };

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
    // Real-time subscription
    const channel = supabase
      .channel("notifications-" + userId)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, () => { fetchNotifs(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    onUnreadChange(notifs.filter(n => !n.read && n.id !== id).length);
  };

  const deleteNotif = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    const next = notifs.filter(n => n.id !== id);
    setNotifs(next);
    onUnreadChange(next.filter(n => !n.read).length);
  };

  return (
    <div style={N.backdrop} onClick={onClose}>
      <div style={N.panel} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={N.head}>
          <div style={N.headLeft}>
            <BellIcon size={16} color="#a5b4fc" />
            <span style={N.headTitle}>Pemberitahuan</span>
          </div>
          <button style={N.closeBtn} onClick={onClose}>
            <XIcon size={16} color="rgba(255,255,255,0.5)" />
          </button>
        </div>

        {/* List */}
        <div style={N.list}>
          {loading && <p style={N.empty}>Memuat...</p>}
          {!loading && notifs.length === 0 && (
            <div style={N.emptyState}>
              <BellIcon size={32} color="rgba(255,255,255,0.15)" />
              <p style={N.emptyText}>Tidak ada pemberitahuan</p>
            </div>
          )}
          {notifs.map(n => (
            <div key={n.id} style={{ ...N.item, borderLeft: n.read ? "3px solid transparent" : "3px solid #6c7ee1", background: n.read ? "rgba(255,255,255,0.03)" : "rgba(108,126,225,0.12)" }}>
              <div style={N.itemRow}>
                <span style={{ ...N.dot, opacity: n.read ? 0 : 1 }} />
                <span style={N.itemTitle}>{n.title}</span>
              </div>
              <p style={N.itemBody}>{n.body}</p>
              <div style={N.actions}>
                {!n.read && (
                  <button style={N.btnPrimary} onClick={() => markRead(n.id)}>
                    <CheckIcon size={12} color="#a5b4fc" /> Tandai dibaca
                  </button>
                )}
                <button style={N.btnDanger} onClick={() => deleteNotif(n.id)}>
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

const N: Record<string, React.CSSProperties> = {
  backdrop: { position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)" },
  panel: { position: "absolute", top: "62px", right: "16px", width: "340px", background: "#131424", borderRadius: "16px", boxShadow: "0 16px 48px rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" },
  head: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" },
  headLeft: { display: "flex", alignItems: "center", gap: "8px" },
  headTitle: { fontWeight: 700, fontSize: "13px", color: "#fff", letterSpacing: "0.01em" },
  closeBtn: { background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "8px", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  list: { maxHeight: "380px", overflowY: "auto", padding: "8px" },
  empty: { textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "24px", fontSize: "13px", margin: 0 },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "36px 16px" },
  emptyText: { margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.3)", fontWeight: 500 },
  item: { borderRadius: "10px", padding: "12px 14px", marginBottom: "6px", transition: "background 0.2s" },
  itemRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" },
  dot: { width: "6px", height: "6px", borderRadius: "50%", background: "#6c7ee1", flexShrink: 0 },
  itemTitle: { fontWeight: 600, fontSize: "13px", color: "#fff" },
  itemBody: { fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: "1.55", margin: "0 0 10px 14px" },
  actions: { display: "flex", gap: "6px", marginLeft: "14px" },
  btnPrimary: { display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", padding: "5px 10px", borderRadius: "6px", border: "1px solid rgba(108,126,225,0.4)", background: "rgba(108,126,225,0.15)", color: "#a5b4fc", cursor: "pointer", fontWeight: 600, letterSpacing: "0.01em" },
  btnDanger: { display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", padding: "5px 10px", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#fca5a5", cursor: "pointer", fontWeight: 600, letterSpacing: "0.01em" },
};

/* ═══════════════════════════════════════════
   DOKUMENTASI — Pakasir, padet, scroll
═══════════════════════════════════════════ */
const DOC_SECTIONS = [
  {
    id: "pengenalan", title: "Pengenalan",
    blocks: [
      { type: "p", text: "Zyfayment menggunakan Pakasir sebagai payment gateway. Pakasir mendukung QRIS, Virtual Account multi-bank, dan e-wallet Indonesia." },
      { type: "p", text: "Daftar dan buat proyek di app.pakasir.com. Setelah proyek dibuat, salin Slug dan API Key dari halaman detail proyek — keduanya dibutuhkan untuk semua request API." },
    ]
  },
  {
    id: "setup", title: "Setup",
    blocks: [
      { type: "p", text: "Langkah awal integrasi Pakasir ke Zyfayment:" },
      { type: "ol", items: ["Daftar di app.pakasir.com dan buat proyek baru", "Salin Slug dan API Key dari halaman detail proyek", "Masukkan keduanya di menu API Settings", "Set Webhook URL di dashboard Pakasir:", "  https://yourdomain.com/api/webhook"] },
      { type: "p", text: "Untuk mode Sandbox, aktifkan toggle di dashboard Pakasir dan di sidebar Zyfayment." },
    ]
  },
  {
    id: "buat-pembayaran", title: "Buat Pembayaran",
    blocks: [
      { type: "p", text: "Kirim request POST ke endpoint Pakasir untuk membuat link pembayaran:" },
      { type: "code", text: `POST https://app.pakasir.com/api/pay/{slug}

Headers:
  Content-Type: application/json

Body:
{
  "order_id": "ORDER-001",
  "amount": 50000,
  "api_key": "YOUR_API_KEY",
  "redirect_url": "https://domain.com/thanks"
}

Response:
{
  "payment_url": "https://app.pakasir.com/pay/...",
  "order_id": "ORDER-001",
  "amount": 50000,
  "expired_at": "2025-01-01T12:00:00Z"
}` },
      { type: "p", text: "Arahkan user ke payment_url. Pakasir menangani halaman pilih metode pembayaran." },
    ]
  },
  {
    id: "webhook", title: "Webhook",
    blocks: [
      { type: "p", text: "Pakasir mengirim POST ke webhook URL Anda saat status pembayaran berubah:" },
      { type: "code", text: `{
  "order_id": "ORDER-001",
  "amount": 50000,
  "status": "completed",
  "payment_method": "qris",
  "project": "your-slug",
  "completed_at": "2025-01-01T11:58:00Z"
}` },
      { type: "p", text: "Status yang mungkin diterima:" },
      { type: "ul", items: ["pending — menunggu pembayaran", "completed — pembayaran berhasil", "expired — waktu kadaluarsa", "canceled — dibatalkan user"] },
      { type: "p", text: "Endpoint webhook harus merespons HTTP 200 agar Pakasir tidak retry." },
    ]
  },
  {
    id: "cek-status", title: "Cek Status",
    blocks: [
      { type: "p", text: "Gunakan endpoint ini untuk polling status pembayaran secara manual:" },
      { type: "code", text: `GET https://app.pakasir.com/api/status/{slug}/{order_id}
    ?api_key=YOUR_API_KEY

Response:
{
  "order_id": "ORDER-001",
  "amount": 50000,
  "status": "completed",
  "payment_method": "qris"
}` },
    ]
  },
  {
    id: "sandbox", title: "Sandbox",
    blocks: [
      { type: "p", text: "Mode sandbox memungkinkan testing pembayaran tanpa uang nyata. Aktifkan di dashboard Pakasir, lalu gunakan API simulasi:" },
      { type: "code", text: `POST https://app.pakasir.com/api/paymentsimulation

Body:
{
  "project": "your-slug",
  "order_id": "ORDER-001",
  "amount": 10000,
  "api_key": "YOUR_API_KEY"
}` },
      { type: "p", text: "Minimum amount simulasi: Rp 10.000. Gunakan tombol 'Simulasi Pembayaran' di halaman pay Pakasir untuk trigger webhook instan." },
    ]
  },
  {
    id: "metode", title: "Metode Pembayaran",
    blocks: [
      { type: "p", text: "Pakasir mendukung metode pembayaran berikut:" },
      { type: "ul", items: ["QRIS — semua e-wallet & bank yang support QRIS", "VA BCA, BNI, BRI, Mandiri, Permata, BSI, CIMB", "GoPay & ShopeePay (e-wallet langsung)", "Alfamart & Indomaret (ritel)"] },
      { type: "p", text: "Cek biaya per metode di pakasir.com/biaya — biaya dibebankan ke pembeli atau penjual tergantung konfigurasi proyek." },
    ]
  },
];

function DocBlock({ block }: { block: any }) {
  const base: React.CSSProperties = { fontSize: "13px", lineHeight: "1.75", color: "rgba(255,255,255,0.8)", margin: "0 0 12px" };
  if (block.type === "p") return <p style={base}>{block.text}</p>;
  if (block.type === "code") return <pre style={{ ...base, background: "rgba(0,0,0,0.35)", borderRadius: "8px", padding: "14px", fontFamily: "monospace", overflowX: "auto", border: "1px solid rgba(255,255,255,0.07)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{block.text}</pre>;
  if (block.type === "ul") return <ul style={{ ...base, paddingLeft: "20px" }}>{block.items.map((item: string, i: number) => <li key={i} style={{ marginBottom: "4px" }}>{item}</li>)}</ul>;
  if (block.type === "ol") return <ol style={{ ...base, paddingLeft: "20px" }}>{block.items.map((item: string, i: number) => <li key={i} style={{ marginBottom: "4px" }}>{item}</li>)}</ol>;
  return null;
}

function DokumentasiContent() {
  const [active, setActive] = useState("pengenalan");
  const sec = DOC_SECTIONS.find(s => s.id === active)!;
  return (
    <div>
      <h2 style={S.pageTitle}>Dokumentasi</h2>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", margin: "-8px 0 16px", fontWeight: 500, letterSpacing: "0.02em", textTransform: "uppercase" }}>Powered by Pakasir</p>
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        {/* Nav sidebar */}
        <nav style={{ width: "148px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "2px", position: "sticky", top: "20px" }}>
          {DOC_SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)} style={{ padding: "8px 12px", border: "none", background: active === s.id ? "rgba(108,126,225,0.2)" : "transparent", borderLeft: active === s.id ? "2px solid #6c7ee1" : "2px solid transparent", color: active === s.id ? "#c7d2fe" : "rgba(255,255,255,0.45)", cursor: "pointer", textAlign: "left", fontSize: "12px", fontWeight: active === s.id ? 600 : 400, borderRadius: "0 6px 6px 0", transition: "0.15s" }}>
              {s.title}
            </button>
          ))}
        </nav>
        {/* Content */}
        <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "20px 22px", border: "1px solid rgba(255,255,255,0.08)", minHeight: "320px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700, color: "#fff" }}>{sec.title}</h3>
          {sec.blocks.map((b, i) => <DocBlock key={i} block={b} />)}
        </div>
      </div>
    </div>
  );
}

/* ═══════ PAGE CONTENTS (ringkas) ═══════ */
function DashboardContent() {
  return (
    <div>
      <h2 style={S.pageTitle}>Ringkasan</h2>
      <div style={S.stats}>
        {["Total Pendapatan|Rp 0","Transaksi Sukses|0","Transaksi Gagal|0","Saldo Dompet|Rp 0"].map(x => {
          const [label, val] = x.split("|");
          return <div key={label} style={S.card}><span style={S.cardLabel}>{label}</span><h3 style={S.cardValue}>{val}</h3></div>;
        })}
      </div>
      <div style={S.emptyState}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        <p style={{ color: "rgba(255,255,255,0.3)", marginTop: "10px", fontSize: "13px" }}>Belum ada data transaksi</p>
      </div>
    </div>
  );
}
function SandboxContent() {
  return <div><h2 style={S.pageTitle}>Sandbox Panel</h2><div style={{ ...S.card, maxWidth: "460px" }}><p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "14px", fontSize: "14px" }}>Mode sandbox aktif. Transaksi bersifat simulasi.</p><span style={{ background: "#f59e0b", color: "#fff", padding: "6px 14px", borderRadius: "6px", fontWeight: 700, fontSize: "12px", letterSpacing: "0.05em" }}>SANDBOX MODE</span></div></div>;
}
function TransaksiContent() {
  return <div><h2 style={S.pageTitle}>Transaksi</h2><div style={S.tableWrapper}><table style={S.table}><thead><tr>{["ID Transaksi","Tanggal","Jumlah","Status"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead><tbody><tr><td colSpan={4} style={S.emptyRow}>Belum ada transaksi</td></tr></tbody></table></div></div>;
}
function DompetContent() {
  return <div><h2 style={S.pageTitle}>Dompet</h2><div style={{ ...S.card, maxWidth: "380px" }}><span style={S.cardLabel}>Saldo Tersedia</span><h3 style={{ ...S.cardValue, fontSize: "30px", margin: "6px 0 16px" }}>Rp 0</h3><button style={S.actionBtn}>Tarik Dana</button></div></div>;
}
function TarikDanaContent() {
  const [amount, setAmount] = useState("");
  return <div><h2 style={S.pageTitle}>Tarik Dana</h2><div style={{ ...S.card, maxWidth: "400px", display: "flex", flexDirection: "column", gap: "12px" }}><label style={S.label}>Jumlah Penarikan<input type="number" placeholder="Rp 0" value={amount} onChange={e => setAmount(e.target.value)} style={S.input} /></label><label style={S.label}>Rekening Tujuan<input type="text" placeholder="Nomor rekening" style={S.input} /></label><button style={{ ...S.actionBtn, marginTop: "4px" }}>Ajukan Penarikan</button></div></div>;
}
function ApiSettingsContent() {
  const [show, setShow] = useState(false);
  return (
    <div><h2 style={S.pageTitle}>API Settings</h2>
    <div style={{ ...S.card, maxWidth: "500px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <label style={S.label}>API Key (Pakasir)
        <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
          <input type={show ? "text" : "password"} defaultValue="sk-pakasir-••••••••••••••••" readOnly style={{ ...S.input, marginTop: 0, flex: 1 }} />
          <button onClick={() => setShow(!show)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", borderRadius: "8px", padding: "0 12px", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>{show ? "Sembunyikan" : "Tampilkan"}</button>
        </div>
      </label>
      <label style={S.label}>Project Slug<input type="text" placeholder="your-project-slug" style={S.input} /></label>
      <label style={S.label}>Webhook URL<input type="url" placeholder="https://domain.com/api/webhook" style={S.input} /></label>
      <button style={S.actionBtn}>Simpan Pengaturan</button>
    </div></div>
  );
}

/* ═══════════════════════════════════════════
   ICON COMPONENTS (no emoji)
═══════════════════════════════════════════ */
const BellIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
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

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════ */
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
    <button onClick={() => navigate(page)} style={{ display: "flex", alignItems: "center", gap: "10px", background: activePage === page ? "rgba(62,74,137,0.1)" : "transparent", border: "none", borderRadius: "8px", padding: "10px 10px", color: activePage === page ? "#3e4a89" : "#666", fontWeight: activePage === page ? 600 : 400, fontSize: "14p
