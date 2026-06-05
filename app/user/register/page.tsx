"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ 
    username: "", 
    email: "", 
    phone: "", 
    password: "", 
    confirmPassword: "" 
  });

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }
    console.log("Registering...", formData);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <span style={styles.logo}>Daftar Merchant</span>
        </div>
        <p style={styles.subtitle}>Mulai integrasi QRIS sekarang</p>

        {[
          { label: "Username", name: "username", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Nomor Telepon", name: "phone", type: "tel" },
          { label: "Password", name: "password", type: "password" },
          { label: "Konfirmasi Password", name: "confirmPassword", type: "password" },
        ].map((field) => (
          <div key={field.name} style={styles.field}>
            <label style={styles.label}>{field.label}</label>
            <input
              style={styles.input}
              type={field.type}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            />
          </div>
        ))}

        <button onClick={handleRegister} style={styles.btn}>Daftar Sekarang</button>
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
    fontFamily: "'Inter', sans-serif", padding: 20,
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "40px",
    width: "100%", maxWidth: 400,
  },
  logoContainer: { marginBottom: "24px" },
  logo: { fontSize: 22, fontWeight: 700, color: "#fff" },
  subtitle: { color: "#9ca3af", fontSize: 14, marginBottom: 24 },
  field: { marginBottom: "16px" },
  label: { fontSize: 12, color: "#9ca3af", marginBottom: "6px", display: "block" },
  input: {
    width: "100%", padding: "12px 14px", background: "rgba(0,0,0,0.2)", 
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", 
    color: "#fff", outline: "none", boxSizing: "border-box",
  },
  btn: {
    width: "100%", padding: "12px", background: "#fff", color: "#3e4a89",
    border: "none", borderRadius: "8px", fontSize: 14, fontWeight: 700, 
    cursor: "pointer", marginTop: "10px"
  },
  back: { display: "block", textAlign: "center", marginTop: 20, color: "#9ca3af", fontSize: 12, textDecoration: "none" }
};
      
