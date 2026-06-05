export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      // Gradasi biru elegan yang senada dengan halaman login
      background: "linear-gradient(135deg, #1e1e2f 0%, #3e4a89 100%)",
      color: "#fff",
      fontFamily: "'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        
        {/* Ikon Petir SVG yang profesional */}
        <div style={{ marginBottom: "20px" }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff" />
          </svg>
        </div>

        <h1 style={{ fontSize: "48px", fontWeight: "700", margin: "0 0 16px" }}>
          Zyfayment
        </h1>
        
        <p style={{ fontSize: "18px", opacity: 0.8, margin: "0 0 40px" }}>
          QRIS Payment Gateway · Powered by Zyfay Official Digital
        </p>

        {/* Tombol Login */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <a href="/user/login" style={{ 
            padding: "14px 28px", 
            background: "#fff", 
            color: "#4f46e5", 
            borderRadius: "12px", 
            textDecoration: "none", 
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            Login Merchant
          </a>
        </div>
      </div>
    </div>
  );
}
