"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ 
    username: "", email: "", phone: "", password: "", confirmPassword: "" 
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo & Branding */}
        <div style={styles.logoContainer}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span style={styles.logo}>Zyfayment</span>
        </div>

        <p style={styles.subtitle}>Buat akun merchant baru</p>

        {[
          { label: "Username", name: "username" },
          { label: "Email", name: "email" },
          { label: "Nomor Telepon", name: "phone" },
          { label: "Password", name: "password" },
          { label: "Konfirmasi Password", name: "confirmPassword" },
        ].map((field) => (
          <div key={field.name} style={styles.field}>
            <label style={styles.label}>{field.label} <span style={{color: "#ef4444"}}>*</span></label>
            <input
              style={styles.input}
              type={field.name.includes("password") ? "password" : "text"}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            />
          </div>
        ))}

        <button style={styles.btn}>Daftar Sekarang</button>
        <a href="/user/login" style={styles.back}>Sudah punya akun? Masuk</a>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e1e2f 0%, #3e4a89 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Inter', sans-serif", padding: "20px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "24px", // Dikecilin biar gak terlalu lebar/panjang
    width: "100%", maxWidth: 350, // Dikecilin biar lebih compact
  },
  logoContainer: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "4px" },
  logo: { fontSize: 20, fontWeight: 700, color: "#fff" },
  subtitle: { textAlign: "center", color: "#9ca3af", fontSize: 13, marginBottom: "20px" },
  field: { marginBottom: "12px" }, // Margin diperkecil biar gak terlalu ke bawah
  label: { fontSize: 11, color: "#9ca3af", marginBottom: "4px", display: "block" },
  input: {
    width: "100%", padding: "10px 12px", background: "rgba(0,0,0,0.2)", 
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", 
    color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box",
  },
  btn: {
    width: "100%", padding: "10px", background: "#fff", color: "#3e4a89",
    border: "none", borderRadius: "6px", fontSize: 13, fontWeight: 700, 
    cursor: "pointer", marginTop: "8px"
  },
  back: { display: "block", textAlign: "center", marginTop: "16px", color: "#9ca3af", fontSize: 11, textDecoration: "none" }
};
