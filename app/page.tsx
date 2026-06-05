export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#050505",
      color: "#ffffff",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "80px 20px"
    }}>
      {/* Header Section */}
      <div style={{ maxWidth: "800px", width: "100%", textAlign: "center" }}>
        <div style={{ marginBottom: "24px" }}>
          <span style={{ 
            padding: "6px 12px", borderRadius: "20px", background: "#1a1a1a", 
            border: "1px solid #333", fontSize: "12px", textTransform: "uppercase", 
            letterSpacing: "1px", color: "#888" 
          }}>
            Layanan Payment Gateway
          </span>
        </div>
        
        <h1 style={{ fontSize: "56px", fontWeight: "800", margin: "0 0 16px", letterSpacing: "-1px" }}>
          Zyfayment<span style={{ color: "#3b82f6" }}>.</span>
        </h1>
        
        <p style={{ fontSize: "20px", color: "#888", maxWidth: "500px", margin: "0 auto 40px" }}>
          Solusi penerimaan pembayaran QRIS otomatis untuk bisnis digital Anda. Cepat, aman, dan terintegrasi.
        </p>

        {/* Call to Action */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <a href="/user/login" style={{ 
            padding: "16px 32px", background: "#fff", color: "#000", 
            borderRadius: "8px", textDecoration: "none", fontWeight: "600",
            transition: "opacity 0.2s" 
          }}>
            Login Merchant
          </a>
          <a href="#" style={{ 
            padding: "16px 32px", background: "transparent", color: "#fff", 
            border: "1px solid #333", borderRadius: "8px", textDecoration: "none", fontWeight: "600" 
          }}>
            Dokumentasi
          </a>
        </div>
      </div>

      {/* Feature Section */}
      <div style={{ marginTop: "100px", maxWidth: "800px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {[
          { title: "Instan", desc: "Integrasi sistem pembayaran hitungan menit." },
          { title: "Aman", desc: "Keamanan enkripsi tingkat perbankan." }
        ].map((item, i) => (
          <div key={i} style={{ padding: "32px", background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: "18px" }}>{item.title}</h3>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
