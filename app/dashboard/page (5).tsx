"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Page = "dashboard" | "sandbox" | "transaksi" | "dompet" | "tarik-dana" | "api-settings" | "dokumentasi";
type Notif = { id: string; title: string; body: string; read: boolean; created_at: string };

/* ── SVG ICONS ── */
const Icon = {
  Bell: ({ s = 18, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  X: ({ s = 16, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: ({ s = 13, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Trash: ({ s = 13, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  User: ({ s = 18, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Menu: ({ s = 20, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
};

/* ── NOTIF POPUP ── */
function NotifPopup({ userId, onClose, onUnreadChange }: { userId: string; onClose: () => void; onUnreadChange: (n: number) => void }) {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (data) { setNotifs(data); onUnreadChange(data.filter((n: Notif) => !n.read).length); }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
    const ch = supabase.channel("notif-" + userId)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: "user_id=eq." + userId }, fetch)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId]);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    const next = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifs(next); onUnreadChange(next.filter(n => !n.read).length);
  };

  const del = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    const next = notifs.filter(n => n.id !== id);
    setNotifs(next); onUnreadChange(next.filter(n => !n.read).length);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }} onClick={onClose}>
      <div style={{ position: "absolute", top: "58px", right: "14px", width: "330px", background: "#111827", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 20px 60px rgba(0,0,0,0.7)", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <Icon.Bell s={15} c="#a5b4fc" />
            <span style={{ fontWeight: 700, fontSize: "13px", color: "#fff" }}>Pemberitahuan</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: "7px", width: "26px", height: "26px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon.X s={14} c="rgba(255,255,255,0.5)" />
          </button>
        </div>

        {/* Body */}
        <div style={{ maxHeight: "360px", overflowY: "auto", padding: "8px" }}>
          {loading && <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px", padding: "24px", margin: 0 }}>Memuat...</p>}
          {!loading && notifs.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "32px 16px" }}>
              <Icon.Bell s={30} c="rgba(255,255,255,0.12)" />
              <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>Tidak ada pemberitahuan</p>
            </div>
          )}
          {notifs.map(n => (
            <div key={n.id} style={{ borderRadius: "10px", padding: "11px 13px", marginBottom: "5px", borderLeft: n.read ? "3px solid transparent" : "3px solid #6c7ee1", background: n.read ? "rgba(255,255,255,0.03)" : "rgba(108,126,225,0.11)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
                {!n.read && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6c7ee1", display: "block", flexShrink: 0 }} />}
                <span style={{ fontWeight: 600, fontSize: "13px", color: "#fff" }}>{n.title}</span>
              </div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: "1.5", margin: "0 0 9px", paddingLeft: n.read ? "0" : "13px" }}>{n.body}</p>
              <div style={{ display: "flex", gap: "6px", paddingLeft: n.read ? "0" : "13px" }}>
                {!n.read && (
                  <button onClick={() => markRead(n.id)} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", padding: "5px 11px", borderRadius: "7px", border: "1px solid rgba(108,126,225,0.4)", background: "rgba(108,126,225,0.15)", color: "#a5b4fc", cursor: "pointer", fontWeight: 600 }}>
                    <Icon.Check s={11} c="#a5b4fc" /> Dibaca
                  </button>
                )}
                <button onClick={() => del(n.id)} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", padding: "5px 11px", borderRadius: "7px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#fca5a5", cursor: "pointer", fontWeight: 600 }}>
                  <Icon.Trash s={11} c="#fca5a5" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── DOKUMENTASI ── */
const DOCS = [
  { id: "intro", title: "Pengenalan", content: [
    { t: "p", v: "Zyfayment adalah payment gateway Indonesia yang mendukung QRIS, Virtual Account multi-bank, dan e-wallet. Ditenagai oleh Pakasir." },
    { t: "p", v: "Daftar di app.pakasir.com → buat proyek → salin Slug & API Key → masukkan di API Settings." },
  ]},
  { id: "buat", title: "Buat Pembayaran", content: [
    { t: "code", v: 'POST https://app.pakasir.com/api/pay/{slug}\n\n{\n  "order_id": "ORDER-001",\n  "amount": 50000,\n  "api_key": "YOUR_KEY",\n  "redirect_url": "https://domain.com/thanks"\n}\n\n// Response\n{\n  "payment_url": "https://app.pakasir.com/pay/...",\n  "expired_at": "2025-01-01T12:00:00Z"\n}' },
    { t: "p", v: "Arahkan user ke payment_url untuk menyelesaikan pembayaran." },
  ]},
  { id: "webhook", title: "Webhook", content: [
    { t: "p", v: "Pakasir kirim POST ke webhook URL saat status berubah. Endpoint harus respons HTTP 200." },
    { t: "code", v: '{\n  "order_id": "ORDER-001",\n  "status": "completed",  // pending | completed | expired | canceled\n  "amount": 50000,\n  "payment_method": "qris"\n}' },
  ]},
  { id: "status", title: "Cek Status", content: [
    { t: "code", v: 'GET https://app.pakasir.com/api/status/{slug}/{order_id}?api_key=KEY\n\n// Response\n{ "status": "completed", "amount": 50000, "payment_method": "qris" }' },
  ]},
  { id: "sandbox", title: "Sandbox", content: [
    { t: "p", v: "Aktifkan sandbox di Pakasir untuk testing tanpa uang nyata. Minimum simulasi: Rp 10.000." },
    { t: "code", v: 'POST https://app.pakasir.com/api/paymentsimulation\n\n{\n  "project": "slug",\n  "order_id": "ORDER-001",\n  "amount": 10000,\n  "api_key": "KEY"\n}' },
  ]},
  { id: "metode", title: "Metode", content: [
    { t: "ul", v: ["QRIS — GoPay, OVO, Dana, ShopeePay, semua bank", "VA — BCA, BNI, BRI, Mandiri, Permata, BSI, CIMB", "E-Wallet — GoPay, ShopeePay", "Ritel — Alfamart, Indomaret"] },
    { t: "p", v: "Lihat biaya lengkap di pakasir.com/biaya" },
  ]},
];

function Docs() {
  const [active, setActive] = useState("intro");
  const sec = DOCS.find(d => d.id === active)!;
  return (
    <div>
      <h2 style={ST.title}>Dokumentasi</h2>
      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: "-10px 0 14px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>Powered by Pakasir</p>
      <div style={{ display: "flex", gap: "12px" }}>
        <nav style={{ width: "120px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "1px" }}>
          {DOCS.map(d => (
            <button key={d.id} onClick={() => setActive(d.id)} style={{ padding: "7px 10px", border: "none", borderLeft: active === d.id ? "2px solid #6c7ee1" : "2px solid transparent", background: active === d.id ? "rgba(108,126,225,0.18)" : "transparent", color: active === d.id ? "#c7d2fe" : "rgba(255,255,255,0.4)", cursor: "pointer", textAlign: "left", fontSize: "12px", fontWeight: active === d.id ? 600 : 400, borderRadius: "0 6px 6px 0" }}>
              {d.title}
            </button>
          ))}
        </nav>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px 18px", border: "1px solid rgba(255,255,255,0.08)", maxHeight: "55vh", overflowY: "auto" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: 700, color: "#fff" }}>{sec.title}</h3>
          {sec.content.map((b, i) => {
            if (b.t === "p") return <p key={i} style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: "1.7", margin: "0 0 10px" }}>{b.v}</p>;
            if (b.t === "code") return <pre key={i} style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", background: "rgba(0,0,0,0.4)", borderRadius: "8px", padding: "12px", margin: "0 0 10px", overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", border: "1px solid rgba(255,255,255,0.07)", fontFamily: "monospace", lineHeight: "1.6" }}>{b.v}</pre>;
            if (b.t === "ul") return <ul key={i} style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: "1.7", margin: "0 0 10px", paddingLeft: "18px" }}>{(b.v as string[]).map((x, j) => <li key={j} style={{ marginBottom: "3px" }}>{x}</li>)}</ul>;
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

/* ── PAGE CONTENTS ── */
function Overview() {
  return (
    <div>
      <h2 style={ST.title}>Ringkasan</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(155px,1fr))", gap: "10px" }}>
        {[["Total Pendapatan","Rp 0"],["Transaksi Sukses","0"],["Transaksi Gagal","0"],["Saldo Dompet","Rp 0"]].map(([l,v]) => (
          <div key={l} style={ST.card}><span style={ST.cardLbl}>{l}</span><h3 style={ST.cardVal}>{v}</h3></div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "52px", opacity: 0.6 }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        <p style={{ color: "rgba(255,255,255,0.3)", marginTop: "8px", fontSize: "13px" }}>Belum ada data transaksi</p>
      </div>
    </div>
  );
}
function Sandbox() { return <div><h2 style={ST.title}>Sandbox Panel</h2><div style={{ ...ST.card, maxWidth: "440px" }}><p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "12px", fontSize: "14px" }}>Mode sandbox aktif. Transaksi bersifat simulasi dan tidak memproses uang nyata.</p><span style={{ background: "#f59e0b", color: "#fff", padding: "5px 12px", borderRadius: "6px", fontWeight: 700, fontSize: "12px", letterSpacing: "0.05em" }}>SANDBOX MODE</span></div></div>; }
function Transaksi() { return <div><h2 style={ST.title}>Transaksi</h2><div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}><table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr>{["ID Transaksi","Tanggal","Jumlah","Status"].map(h => <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: "11px", color: "rgba(255,255,255,0.45)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</th>)}</tr></thead><tbody><tr><td colSpan={4} style={{ padding: "36px", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "13px" }}>Belum ada transaksi</td></tr></tbody></table></div></div>; }
function Dompet() { return <div><h2 style={ST.title}>Dompet</h2><div style={{ ...ST.card, maxWidth: "360px" }}><span style={ST.cardLbl}>Saldo Tersedia</span><h3 style={{ margin: "6px 0 16px", fontSize: "28px", fontWeight: 700 }}>Rp 0</h3><button style={ST.btn}>Tarik Dana</button></div></div>; }
function TarikDana() {
  const [a, sA] = useState(""); const [r, sR] = useState("");
  return <div><h2 style={ST.title}>Tarik Dana</h2><div style={{ ...ST.card, maxWidth: "400px", display: "flex", flexDirection: "column", gap: "12px" }}><label style={ST.lbl}>Jumlah Penarikan<input type="number" placeholder="Rp 0" value={a} onChange={e => sA(e.target.value)} style={ST.inp} /></label><label style={ST.lbl}>Nomor Rekening<input type="text" placeholder="Nomor rekening tujuan" value={r} onChange={e => sR(e.target.value)} style={ST.inp} /></label><button style={{ ...ST.btn, marginTop: "4px" }}>Ajukan Penarikan</button></div></div>;
}
function ApiSettings() {
  const [show, sShow] = useState(false);
  return (
    <div><h2 style={ST.title}>API Settings</h2>
    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "-8px 0 16px" }}>Kelola kredensial API Zyfayment Anda</p>
    <div style={{ ...ST.card, maxWidth: "480px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <label style={ST.lbl}>API Key Zyfayment
        <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
          <input type={show ? "text" : "password"} defaultValue="zyfay-sk-xxxxxxxxxxxxxxxxxxxxxxxx" readOnly style={{ ...ST.inp, marginTop: 0, flex: 1 }} />
          <button onClick={() => sShow(!show)} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", borderRadius: "8px", padding: "0 12px", cursor: "pointer", fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap" }}>{show ? "Sembunyikan" : "Tampilkan"}</button>
        </div>
      </label>
      <label style={ST.lbl}>Merchant ID<input type="text" placeholder="zyfay-merchant-xxxxxxxx" style={ST.inp} /></label>
      <label style={ST.lbl}>Webhook URL<input type="url" placeholder="https://domain.com/api/webhook" style={ST.inp} /></label>
      <button style={ST.btn}>Simpan Pengaturan</button>
    </div></div>
  );
}

/* ── NAV ITEMS ── */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: "transaksi", label: "Transaksi", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> },
  { id: "dompet", label: "Dompet", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14V12"/></svg> },
  { id: "tarik-dana", label: "Tarik Dana", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
];
const SETTING_ITEMS = [
  { id: "api-settings", label: "API Settings", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-2.82-1.17l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  { id: "dokumentasi", label: "Dokumentasi", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
];

/* ── MAIN ── */
export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"PROD" | "SANDBOX">("PROD");
  const [page, setPage] = useState<Page>("dashboard");
  const [showNotif, setShowNotif] = useState(false);
  const [unread, setUnread] = useState(0);
  const [uid, setUid] = useState<string | null>(null);
  const [bgTheme, setBgTheme] = useState("linear-gradient(135deg,#1e1e2f,#3e4a89)");

  const THEMES: Record<string, string> = {
    indigo:  "linear-gradient(135deg,#1e1e2f,#3e4a89)",
    emerald: "linear-gradient(135deg,#0f2027,#2c5364)",
    rose:    "linear-gradient(135deg,#1a0a0a,#7f1d1d)",
    amber:   "linear-gradient(135deg,#1a1200,#78350f)",
    violet:  "linear-gradient(135deg,#0d0717,#4c1d95)",
    cyan:    "linear-gradient(135deg,#021b1f,#065f46)",
  };

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) { window.location.href = "/user/login"; return; }
      setUid(data.user.id);
      const { data: profile } = await supabase.from("profiles").select("theme").eq("id", data.user.id).single();
      if (profile?.theme && THEMES[profile.theme]) setBgTheme(THEMES[profile.theme]);
    });
  }, []);

  const go = (p: Page) => { setPage(p); setOpen(false); };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Overview />;
      case "sandbox": return <Sandbox />;
      case "transaksi": return <Transaksi />;
      case "dompet": return <Dompet />;
      case "tarik-dana": return <TarikDana />;
      case "api-settings": return <ApiSettings />;
      case "dokumentasi": return <Docs />;
    }
  };

  const nb = (id: Page, label: string, icon: React.ReactNode) => (
    <button onClick={() => go(id)} style={{ display: "flex", alignItems: "center", gap: "9px", background: page === id ? "rgba(62,74,137,0.1)" : "transparent", border: "none", borderRadius: "8px", padding: "9px 10px", color: page === id ? "#3e4a89" : "#666", fontWeight: page === id ? 600 : 400, fontSize: "13px", cursor: "pointer", width: "100%", textAlign: "left" }}>
      {icon}{label}
    </button>
  );

  const hdrBtn = (onClick: () => void, children: React.ReactNode, extra?: React.CSSProperties) => (
    <button onClick={onClick} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "10px", width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", ...extra }}>
      {children}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: bgTheme, color: "#fff", fontFamily: "'Inter',sans-serif" }}>
      {showNotif && uid && <NotifPopup userId={uid} onClose={() => setShowNotif(false)} onUnreadChange={setUnread} />}
      {open && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9 }} onClick={() => setOpen(false)} />}

      {/* SIDEBAR */}
      <aside style={{ position: "fixed", top: 0, left: open ? "0" : "-270px", width: "248px", height: "100vh", background: "#fafafa", padding: "20px 14px", transition: "left 0.28s", zIndex: 10, boxShadow: "2px 0 16px rgba(0,0,0,0.15)", overflowY: "auto" }}>
        <div style={{ marginBottom: "24px" }}><h2 style={{ margin: 0, color: "#3e4a89", fontSize: "19px", fontWeight: 800, letterSpacing: "-0.01em" }}>Zyfayment</h2></div>
        <div style={{ display: "flex", background: "#e8e8e8", borderRadius: "8px", padding: "3px", marginBottom: "16px" }}>
          {(["PROD","SANDBOX"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, border: "none", padding: "6px", borderRadius: "6px", fontWeight: 700, cursor: "pointer", fontSize: "10px", letterSpacing: "0.05em", background: mode === m ? (m === "SANDBOX" ? "#f59e0b" : "#fff") : "transparent", color: mode === m ? (m === "SANDBOX" ? "#fff" : "#3e4a89") : "#999" }}>{m}</button>
          ))}
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          {NAV_ITEMS.map(n => nb(n.id as Page, n.label, n.icon))}
          {mode === "SANDBOX" && nb("sandbox", "Sandbox Panel", <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>)}
          <div style={{ fontSize: "9px", color: "#bbb", margin: "14px 0 6px 10px", fontWeight: 700, letterSpacing: "0.09em" }}>API & PENGATURAN</div>
          {SETTING_ITEMS.map(n => nb(n.id as Page, n.label, n.icon))}
        </nav>
      </aside>

      {/* MAIN */}
      <main style={{ padding: "18px 16px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {hdrBtn(() => setOpen(true), <Icon.Menu s={19} />)}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {hdrBtn(() => setShowNotif(v => !v), <>
              <Icon.Bell s={17} />
              {unread > 0 && <span style={{ position: "absolute", top: "5px", right: "5px", width: "7px", height: "7px", borderRadius: "50%", background: "#ef4444", border: "2px solid #1e1e2f" }} />}
            </>)}
            <a href="/user/profile" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "#fff" }}>
              <Icon.User s={17} />
            </a>
          </div>
        </header>
        {renderPage()}
      </main>
    </div>
  );
}

const ST: Record<string, React.CSSProperties> = {
  title: { marginTop: "20px", marginBottom: "14px", fontSize: "19px", fontWeight: 700 },
  card: { background: "rgba(255,255,255,0.08)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" },
  cardLbl: { fontSize: "11px", color: "rgba(255,255,255,0.5)", display: "block", marginBottom: "5px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" },
  cardVal: { margin: 0, fontSize: "22px", fontWeight: 700 },
  lbl: { fontSize: "11px", color: "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", flexDirection: "column", gap: "6px" },
  inp: { marginTop: "2px", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" },
  btn: { padding: "10px 20px", borderRadius: "8px", border: "none", background: "#3e4a89", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "14px" },
};
