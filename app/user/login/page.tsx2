"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return setError("Email dan Password wajib diisi");
    setLoading(true);
    // Logika login lu nanti di sini
    console.log("Logging in...", { email, password });
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Ikon Petir Konsisten */}
        <div style={styles.logoContainer}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span style={styles.logo}>Zyfayment</span>
        </div>
        
        <p style={styles.subtitle}>Masuk ke Akun Merchant</p>

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button onClick={handleLogin} disabled={loading} style={styles.btn}>
          {loading ? "Memproses..." : "Masuk"}
        </button>

        <a href="/" style={styles.back}>← Kembali ke Beranda</a>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    // Gradasi biru yang SAMA dengan home page
    background: "linear-gradient(135deg, #1e1e2f 0%, #3e4a89 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Inter', system-ui, sans-serif", padding: 20,
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "40px",
    width: "100%", maxWidth: 360,
  },
  logoContainer: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" },
  logo: { fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" },
  subtitle: { textAlign: "center", color: "#d1d5db", fontSize: 14, marginBottom: 32 },
  field: { marginBottom: "20px" },
  label: { fontSize: 12, color: "#9ca3af", marginBottom: "8px", display: "block" },
  input: {
    width: "100%", padding: "12px 16px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px", fontSize: 14, color: "#fff", outline: "none", boxSizing: "border-box",
  },
  error: { color: "#f87171", fontSize: 12, marginBottom: 16, textAlign: "center" },
  btn: {
    width: "100%", padding: "12px", background: "#fff", color: "#3e4a89",
    border: "none", borderRadius: "8px", fontSize: 14, fontWeight: 700, cursor: "pointer",
  },
  back: { display: "block", textAlign: "center", marginTop: 24, color: "#9ca3af", fontSize: 12, textDecoration: "none" }
};
    
