"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) { setError("Semua field wajib diisi."); return; }
    if (password.length < 6) { setError("Password minimal 6 karakter."); return; }
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (error) { setError(error.message); setLoading(false); }
    else {
      if (data.user) await supabase.from("profiles").upsert({ id: data.user.id, full_name: name, icon: "zap", theme: "indigo" });
      setSuccess(true); setLoading(false);
    }
  };

  if (success) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1e1e2f,#3e4a89)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(34,197,94,0.2)", border: "2px solid #22c55e", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ color: "#fff", margin: "0 0 8px", fontSize: "22px" }}>Akun berhasil dibuat!</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: "0 0 24px" }}>Cek email Anda untuk konfirmasi, lalu login.</p>
        <a href="/user/login" style={{ padding: "12px 28px", borderRadius: "10px", background: "#3e4a89", color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: "14px" }}>Ke halaman Login</a>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1e1e2f,#3e4a89)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#fff" }}>Zyfayment</h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>Buat akun baru</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px", border: "1px solid rgba(255,255,255,0.1)" }}>
          {error && <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#fca5a5", fontSize: "13px" }}>{error}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={lbl}>Nama Lengkap<input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} style={inp} /></label>
            <label style={lbl}>Email<input type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inp} /></label>
            <label style={lbl}>Password<input type="password" placeholder="Min. 6 karakter" value={password} onChange={e => setPassword(e.target.value)} style={inp} /></label>
            <button onClick={handleRegister} disabled={loading} style={{ marginTop: "4px", padding: "12px", borderRadius: "10px", border: "none", background: loading ? "rgba(62,74,137,0.5)" : "#3e4a89", color: "#fff", fontWeight: 700, fontSize: "15px", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Mendaftar..." : "Daftar"}
            </button>
          </div>
          <div style={{ marginTop: "20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Sudah punya akun? <a href="/user/login" style={{ color: "#a5b4fc", fontWeight: 600, textDecoration: "none" }}>Masuk di sini</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
const lbl: React.CSSProperties = { fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", flexDirection: "column", gap: "6px" };
const inp: React.CSSProperties = { marginTop: "2px", padding: "11px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" };
