"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) return setError("Username dan password wajib diisi");
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then((r) => r.json());
    setLoading(false);
    if (res.success) {
      sessionStorage.setItem("admin_token", res.token);
      router.push("/admin");
    } else {
      setError(res.message || "Login gagal");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>⚡ Zyfayment</div>
        <p style={styles.subtitle}>Admin Dashboard</p>

        <div style={styles.field}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            type="text"
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button onClick={handleLogin} disabled={loading} style={styles.btn}>
          {loading ? "Masuk..." : "Masuk →"}
        </button>

        <a href="/" style={styles.back}>← Kembali ke Beranda</a>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Segoe UI', system-ui, sans-serif", padding: 20,
  },
  card: {
    background: "#fff", borderRadius: 20, padding: "40px 36px",
    width: "100%", maxWidth: 400, boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  },
  logo: {
    fontSize: 26, fontWeight: 900, textAlign: "center", marginBottom: 4,
    background: "linear-gradient(135deg, #667eea, #a78bfa)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  subtitle: { textAlign: "center", color: "#888", fontSize: 14, marginBottom: 32, marginTop: 0 },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6, letterSpacing: 0.5 },
  input: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e0e0e0",
    borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box",
    transition: "border 0.2s",
  },
  error: {
    background: "#fef2f2", color: "#dc2626", borderRadius: 8,
    padding: "10px 14px", fontSize: 13, marginBottom: 16,
  },
  btn: {
    width: "100%", padding: "13px", marginTop: 8,
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff", border: "none", borderRadius: 12,
    fontSize: 15, fontWeight: 700, cursor: "pointer",
  },
  back: {
    display: "block", textAlign: "center", marginTop: 20,
    color: "#999", fontSize: 13, textDecoration: "none",
  },
};
