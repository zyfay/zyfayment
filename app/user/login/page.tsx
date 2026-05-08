"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !email.includes("@")) return setError("Masukkan email yang valid");
    setLoading(true);
    setError("");
    const res = await fetch("/api/user/transactions?email=" + encodeURIComponent(email)).then((r) => r.json());
    setLoading(false);
    if (res.success) {
      sessionStorage.setItem("user_email", email);
      router.push("/user");
    } else {
      setError("Email tidak ditemukan atau belum ada transaksi");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>⚡ Zyfayment</div>
        <p style={styles.subtitle}>Cek Status Pesanan Kamu</p>

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="email@kamu.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button onClick={handleLogin} disabled={loading} style={styles.btn}>
          {loading ? "Mencari..." : "Lihat Pesanan →"}
        </button>

        <p style={styles.hint}>Masukkan email yang kamu gunakan saat checkout</p>
        <a href="/" style={styles.back}>← Kembali ke Beranda</a>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Segoe UI', system-ui, sans-serif", padding: 20,
  },
  card: {
    background: "#fff", borderRadius: 20, padding: "40px 36px",
    width: "100%", maxWidth: 400, boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
  },
  logo: {
    fontSize: 26, fontWeight: 900, textAlign: "center", marginBottom: 4,
    background: "linear-gradient(135deg, #667eea, #a78bfa)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  subtitle: { textAlign: "center", color: "#888", fontSize: 14, marginBottom: 32, marginTop: 0 },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 },
  input: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e0e0e0",
    borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box",
  },
  error: { background: "#fef2f2", color: "#dc2626", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 },
  btn: {
    width: "100%", padding: "13px", marginTop: 8,
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff", border: "none", borderRadius: 12,
    fontSize: 15, fontWeight: 700, cursor: "pointer",
  },
  hint: { textAlign: "center", color: "#bbb", fontSize: 12, marginTop: 14, marginBottom: 0 },
  back: { display: "block", textAlign: "center", marginTop: 12, color: "#999", fontSize: 13, textDecoration: "none" },
};
