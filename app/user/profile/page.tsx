"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ICONS = [
  { id: "zap", label: "Petir", svg: <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  { id: "wallet", label: "Dompet", svg: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14V12"/><circle cx="16" cy="12" r="1" fill="currentColor"/></svg> },
  { id: "diamond", label: "Diamond", svg: <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 22 9 18 21 6 21 2 9"/></svg> },
  { id: "rocket", label: "Roket", svg: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg> },
  { id: "crown", label: "Mahkota", svg: <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h20v2H2zM4 18l2-10 5 6 3-8 3 8 5-6 2 10z"/></svg> },
  { id: "shield", label: "Perisai", svg: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
];

const THEMES = [
  { id: "indigo", label: "Indigo", bg: "linear-gradient(135deg,#1e1e2f,#3e4a89)", accent: "#6c7ee1" },
  { id: "emerald", label: "Emerald", bg: "linear-gradient(135deg,#0f2027,#2c5364)", accent: "#34d399" },
  { id: "rose", label: "Rose", bg: "linear-gradient(135deg,#1a0a0a,#7f1d1d)", accent: "#fb7185" },
  { id: "amber", label: "Amber", bg: "linear-gradient(135deg,#1a1200,#78350f)", accent: "#fbbf24" },
  { id: "violet", label: "Violet", bg: "linear-gradient(135deg,#0d0717,#4c1d95)", accent: "#a78bfa" },
  { id: "cyan", label: "Cyan", bg: "linear-gradient(135deg,#021b1f,#065f46)", accent: "#22d3ee" },
];

type Profile = { id: string; full_name: string; email: string; icon: string; theme: string };

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({ id: "", full_name: "", email: "", icon: "zap", theme: "indigo" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const theme = THEMES.find(t => t.id === profile.theme) || THEMES[0];
  const icon = ICONS.find(i => i.id === profile.icon) || ICONS[0];

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/user/login"; return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile({ id: user.id, full_name: data?.full_name || "", email: user.email || "", icon: data?.icon || "zap", theme: data?.theme || "indigo" });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    await supabase.from("profiles").upsert({ id: profile.id, full_name: profile.full_name, icon: profile.icon, theme: profile.theme });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#1e1e2f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif" }}>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Memuat profil...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter',sans-serif", color: "#fff", padding: "20px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <a href="/dashboard" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: "10px", padding: "8px 14px", cursor: "pointer", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>← Dashboard</a>
        <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Profil Saya</h1>
      </div>

      <div style={{ maxWidth: "460px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Avatar preview */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "20px 0" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: theme.accent + "22", border: "3px solid " + theme.accent, display: "flex", alignItems: "center", justifyContent: "center", color: theme.accent, transition: "0.3s" }}>
            {icon.svg}
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>Ikon & tema berubah secara langsung</p>
        </div>

        {/* Info */}
        <div style={C}>
          <label style={LB}>Nama Lengkap<input value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} style={IP} placeholder="Nama kamu" /></label>
          <label style={{ ...LB, marginTop: "12px" }}>Email<input value={profile.email} readOnly style={{ ...IP, opacity: 0.4, cursor: "not-allowed" }} /></label>
        </div>

        {/* Ikon */}
        <div style={C}>
          <p style={SEC}>Pilih Ikon</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "8px" }}>
            {ICONS.map(ic => (
              <button key={ic.id} title={ic.label} onClick={() => setProfile(p => ({ ...p, icon: ic.id }))} style={{ aspectRatio: "1", borderRadius: "10px", border: profile.icon === ic.id ? "2px solid " + theme.accent : "2px solid rgba(255,255,255,0.08)", background: profile.icon === ic.id ? theme.accent + "22" : "rgba(255,255,255,0.04)", color: profile.icon === ic.id ? theme.accent : "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s", padding: "6px" }}>
                {ic.svg}
              </button>
            ))}
          </div>
        </div>

        {/* Tema */}
        <div style={C}>
          <p style={SEC}>Pilih Tema</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
            {THEMES.map(th => (
              <button key={th.id} onClick={() => setProfile(p => ({ ...p, theme: th.id }))} style={{ padding: "12px 8px", borderRadius: "10px", border: profile.theme === th.id ? "2px solid " + th.accent : "2px solid rgba(255,255,255,0.08)", background: th.bg, cursor: "pointer", transition: "0.2s" }}>
                <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: th.accent, margin: "0 auto 6px" }} />
                <p style={{ margin: 0, fontSize: "11px", color: "#fff", fontWeight: profile.theme === th.id ? 700 : 400 }}>{th.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Simpan */}
        <button onClick={save} disabled={saving} style={{ padding: "13px", borderRadius: "12px", border: "none", background: saved ? "#22c55e" : theme.accent, color: "#fff", fontWeight: 700, fontSize: "15px", cursor: "pointer", transition: "background 0.3s" }}>
          {saving ? "Menyimpan..." : saved ? "✓ Tersimpan!" : "Simpan Profil"}
        </button>
      </div>
    </div>
  );
}

const C: React.CSSProperties = { background: "rgba(255,255,255,0.07)", borderRadius: "14px", padding: "16px", border: "1px solid rgba(255,255,255,0.09)" };
const LB: React.CSSProperties = { fontSize: "11px", color: "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", flexDirection: "column", gap: "6px" };
const IP: React.CSSProperties = { marginTop: "4px", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" };
const SEC: React.CSSProperties = { margin: "0 0 10px", fontSize: "11px", color: "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" };
