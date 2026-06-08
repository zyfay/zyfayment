"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Email dan password wajib diisi."); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else window.location.href = "/dashboard";
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1e1e2f,#3e4a89)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#fff" }}>Zyfayment</h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>Masuk ke dashboard Anda</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px", border: "1px solid rgba(255,255,255,0.1)" }}>
          {error && <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#fca5a5", fontSize: "13px" }}>{error}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={lbl}>Email<input type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={inp} /></label>
            <label style={lbl}>Password<input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={inp} /></label>
            <button onClick={handleLogin} disabled={loading} style={{ marginTop: "4px", padding: "12px", borderRadius: "10px", border: "none", background: loading ? "rgba(62,74,137,0.5)" : "#3e4a89", color: "#fff", fontWeight: 700, fontSize: "15px", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Masuk..." : "Masuk"}
            </button>
          </div>
          <div style={{ marginTop: "20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Belum punya akun? <a href="/user/register" style={{ color: "#a5b4fc", fontWeight: 600, textDecoration: "none" }}>Daftar sekarang</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
const lbl: React.CSSProperties = { fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", flexDirection: "column", gap: "6px" };
const inp: React.CSSProperties = { marginTop: "2px", padding: "11px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" };
