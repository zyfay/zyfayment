export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#fff", textAlign: "center", padding: 20,
    }}>
      <div style={{ maxWidth: 600, width: "100%" }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, margin: "0 0 8px",
          background: "linear-gradient(135deg, #667eea, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ⚡ Zyfayment
        </h1>
        <p style={{ color: "#aaa", fontSize: 18, margin: "0 0 40px" }}>QRIS Payment Gateway · Powered by Zyfay Official Digital</p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
          <a href="/dashboard" style={{ padding: "14px 28px", background: "#667eea", color: "#fff", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>📊 Dashboard Admin</a>
        </div>

        <div style={{ padding: "24px", background: "#ffffff10", borderRadius: 16 }}>
          <p style={{ color: "#aaa", fontSize: 13, margin: "0 0 12px", textAlign: "left" }}>Contoh create payment:</p>
          <pre style={{ textAlign: "left", color: "#a78bfa", fontSize: 12, margin: 0, overflow: "auto" }}>{`POST /api/create-payment
Content-Type: application/json

{
  "amount": 50000,
  "customerName": "John Doe",
  "customerEmail": "john@email.com",
  "description": "Pembelian produk",
  "orderId": "ORDER-001",
  "webhookUrl": "https://yoursite.com/webhook"
}`}</pre>
        </div>
      </div>
    </div>
  );
}
