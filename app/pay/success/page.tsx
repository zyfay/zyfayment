export default function SuccessPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0f0f, #1a1a2e)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 40, textAlign: "center", maxWidth: 400, width: "100%" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h2 style={{ color: "#16a34a", marginBottom: 8 }}>Pembayaran Berhasil!</h2>
        <p style={{ color: "#888" }}>Terima kasih telah melakukan pembayaran.</p>
      </div>
    </div>
  );
}
