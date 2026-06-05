export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e1e2f 0%, #3e4a89 100%)",
      color: "#fff",
      fontFamily: "'Inter', sans-serif",
      padding: "80px 20px"
    }}>
      {/* Hero Section */}
      <header style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 100px" }}>
        {/* Ikon Petir di Home Page */}
        <div style={{ marginBottom: "20px" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        
        <h1 style={{ fontSize: "64px", fontWeight: "800", marginBottom: "20px" }}>Zyfayment</h1>
        <p style={{ fontSize: "20px", color: "#d1d5db", marginBottom: "40px" }}>
          Solusi penerimaan pembayaran QRIS otomatis untuk bisnis digital. Cepat, aman, dan terintegrasi penuh.
        </p>
        <a href="/user/login" style={{ 
          padding: "16px 32px", background: "#fff", color: "#3e4a89", 
          borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "16px" 
        }}>Login Merchant</a>
      </header>

      {/* Grid Keunggulan */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        {[
          { title: "Settle Instan", desc: "Dana masuk ke saldo merchant secara real-time setelah pembayaran sukses." },
          { title: "Keamanan Tinggi", desc: "Dilindungi enkripsi end-to-end untuk setiap transaksi pelanggan." },
          { title: "API Integrasi", desc: "Dokumentasi API yang ramah developer untuk integrasi cepat." }
        ].map((feature, i) => (
          <div key={i} style={{ 
            background: "rgba(255,255,255,0.05)", padding: "32px", 
            borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" 
          }}>
            <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>{feature.title}</h3>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: "1.6" }}>{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
            }
               
