"use client";
import { useState } from "react";

const BASE_URL = "https://zyfayment.vercel.app";

interface Section {
  id: string;
  label: string;
  icon: string;
}

const sections: Section[] = [
  { id: "persiapan", label: "Persiapan", icon: "🔧" },
  { id: "integrasi", label: "Integrasi Via API", icon: "🔌" },
  { id: "create-payment", label: "C.1. Create Payment", icon: "💳" },
  { id: "check-payment", label: "C.2. Check Status", icon: "🔍" },
  { id: "simulate", label: "C.3. Simulasi Bayar", icon: "🧪" },
  { id: "transaction", label: "C.4. Transaction Detail", icon: "📋" },
  { id: "webhook", label: "D. Webhook", icon: "🔔" },
  { id: "wordpress", label: "E. WordPress Plugin", icon: "🌐" },
  { id: "ess", label: "F. ESS", icon: "⚡" },
  { id: "flutter", label: "G. Flutter/Dart", icon: "📱" },
  { id: "nodejs", label: "H. Node.js Package", icon: "📦" },
];

function CodeBlock({ code, lang = "json" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={s.codeWrap}>
      <div style={s.codeHeader}>
        <span style={s.codeLang}>{lang}</span>
        <button onClick={copy} style={s.copyBtn}>{copied ? "✓ Copied" : "Copy"}</button>
      </div>
      <pre style={s.pre}><code>{code}</code></pre>
    </div>
  );
}

function Badge({ method }: { method: string }) {
  const colors: Record<string, string> = { POST: "#22c55e", GET: "#3b82f6", PATCH: "#f59e0b", DELETE: "#ef4444" };
  return <span style={{ ...s.badge, background: colors[method] || "#888" }}>{method}</span>;
}

function EndpointRow({ method, path, desc }: { method: string; path: string; desc: string }) {
  return (
    <div style={s.endpointRow}>
      <Badge method={method} />
      <code style={s.endpointPath}>{path}</code>
      <span style={s.endpointDesc}>{desc}</span>
    </div>
  );
}

function Section({ id, title, icon, children }: { id: string; title: string; icon: string; children: React.ReactNode }) {
  return (
    <div id={id} style={s.section}>
      <h2 style={s.sectionTitle}><span style={{ marginRight: 10 }}>{icon}</span>{title}</h2>
      {children}
    </div>
  );
}

export default function DocsPage() {
  const [activeNav, setActiveNav] = useState("persiapan");

  const scrollTo = (id: string) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={s.page}>
      {/* Top navbar */}
      <nav style={s.topNav}>
        <a href="/" style={s.navLogo}>⚡ Zyfayment</a>
        <div style={s.navLinks}>
          <a href="/user/login" style={s.navLink}>Cek Pesanan</a>
          <a href="/admin/login" style={s.navLinkBtn}>Admin →</a>
        </div>
      </nav>

      <div style={s.layout}>
        {/* Sidebar */}
        <aside style={s.sidebar}>
          <div style={s.sidebarTitle}>Dokumentasi</div>
          <div style={s.sidebarVersion}>v1.0 · {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</div>
          {sections.map((sec) => (
            <button key={sec.id} onClick={() => scrollTo(sec.id)}
              style={{ ...s.navItem, ...(activeNav === sec.id ? s.navItemActive : {}) }}>
              <span style={{ marginRight: 8 }}>{sec.icon}</span>{sec.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main style={s.main}>
          <div style={s.heroBox}>
            <h1 style={s.heroTitle}>Docs · Panduan Integrasi</h1>
            <p style={s.heroDate}>Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>

          {/* A. Persiapan */}
          <Section id="persiapan" title="A. Persiapan" icon="🔧">
            <p style={s.p}>Untuk menggunakan Zyfayment, kamu tidak perlu install apapun di sisi server. Cukup gunakan HTTP request ke endpoint API yang sudah tersedia.</p>
            <p style={s.p}>Pastikan kamu memiliki:</p>
            <ul style={s.ul}>
              <li>URL base API: <code style={s.inlineCode}>{BASE_URL}</code></li>
              <li>Koneksi internet dari server/aplikasi kamu</li>
              <li>Endpoint webhook yang bisa menerima POST request (opsional)</li>
            </ul>
          </Section>

          {/* B. Integrasi */}
          <Section id="integrasi" title="B. Integrasi Via API" icon="🔌">
            <p style={s.p}>Zyfayment menyediakan REST API yang bisa digunakan dari platform apapun. Berikut endpoint yang tersedia:</p>
            <div style={s.endpointTable}>
              <EndpointRow method="POST" path="/api/create-payment" desc="Buat transaksi baru" />
              <EndpointRow method="GET"  path="/api/check-payment?id=" desc="Cek status transaksi" />
              <EndpointRow method="POST" path="/api/simulate" desc="Simulasi bayar (sandbox)" />
              <EndpointRow method="GET"  path="/api/transactions?email=" desc="Riwayat transaksi user" />
              <EndpointRow method="POST" path="/api/webhook" desc="Callback dari Pakasir" />
            </div>
            <p style={s.p}>Base URL:</p>
            <CodeBlock code={BASE_URL} lang="url" />
          </Section>

          {/* C.1. Create Payment */}
          <Section id="create-payment" title="C.1. Create Payment" icon="💳">
            <p style={s.p}>Endpoint ini digunakan untuk membuat transaksi pembayaran baru via QRIS.</p>
            <div style={s.methodLine}><Badge method="POST" /> <code style={s.inlineCode}>/api/create-payment</code></div>

            <h3 style={s.h3}>Request Body</h3>
            <CodeBlock lang="json" code={`{
  "amount": 50000,
  "customerName": "Budi Santoso",
  "customerEmail": "budi@email.com",
  "description": "Pembelian Produk Digital",
  "orderId": "ORDER-2026-001",
  "webhookUrl": "https://yoursite.com/webhook"
}`} />

            <h3 style={s.h3}>Parameter</h3>
            <table style={s.table}>
              <thead><tr style={s.thead}>
                <th style={s.th}>Field</th><th style={s.th}>Tipe</th><th style={s.th}>Wajib</th><th style={s.th}>Keterangan</th>
              </tr></thead>
              <tbody>
                {[
                  ["amount", "number", "✅", "Nominal dalam Rupiah (min Rp 100)"],
                  ["customerName", "string", "✅", "Nama pelanggan"],
                  ["customerEmail", "string", "⬜", "Email pelanggan (untuk cek pesanan)"],
                  ["description", "string", "⬜", "Deskripsi pembayaran"],
                  ["orderId", "string", "⬜", "ID unik order (auto-generate jika kosong)"],
                  ["webhookUrl", "string", "⬜", "URL callback saat status berubah"],
                ].map(([f, t, r, k]) => (
                  <tr key={f} style={s.tr}>
                    <td style={s.td}><code style={s.inlineCode}>{f}</code></td>
                    <td style={s.td}><span style={s.typeTag}>{t}</span></td>
                    <td style={s.td}>{r}</td>
                    <td style={s.td}>{k}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={s.h3}>Response</h3>
            <CodeBlock lang="json" code={`{
  "success": true,
  "sandbox": false,
  "data": {
    "transactionId": "ZY-1746624000000-ABC123",
    "orderId": "ORDER-2026-001",
    "amount": 50000,
    "fee": 0,
    "totalPayment": 50000,
    "status": "pending",
    "qrisString": "00020101021226...",
    "paymentUrl": "${BASE_URL}/pay/ZY-1746624000000-ABC123",
    "merchantName": "Zyfay Official Digital",
    "nmid": "ID1025424358865",
    "expiredAt": "2026-05-07T10:30:00.000Z",
    "createdAt": "2026-05-07T10:00:00.000Z"
  }
}`} />
          </Section>

          {/* C.2. Check Payment */}
          <Section id="check-payment" title="C.2. Check Payment Status" icon="🔍">
            <p style={s.p}>Gunakan endpoint ini untuk mengecek status transaksi secara real-time.</p>
            <div style={s.methodLine}><Badge method="GET" /> <code style={s.inlineCode}>/api/check-payment?id=TRANSACTION_ID</code></div>

            <h3 style={s.h3}>Response</h3>
            <CodeBlock lang="json" code={`{
  "success": true,
  "data": {
    "transactionId": "ZY-1746624000000-ABC123",
    "orderId": "ORDER-2026-001",
    "amount": 50000,
    "status": "paid",
    "customerName": "Budi Santoso",
    "description": "Pembelian Produk Digital",
    "createdAt": "2026-05-07T10:00:00.000Z",
    "expiredAt": "2026-05-07T10:30:00.000Z",
    "paidAt": "2026-05-07T10:12:34.000Z"
  }
}`} />

            <h3 style={s.h3}>Status Transaksi</h3>
            <div style={s.statusGrid}>
              {[
                { status: "pending", color: "#f59e0b", bg: "#fff8e1", desc: "Menunggu pembayaran" },
                { status: "paid", color: "#16a34a", bg: "#e8f5e9", desc: "Pembayaran berhasil" },
                { status: "expired", color: "#dc2626", bg: "#fef2f2", desc: "Waktu habis (30 menit)" },
                { status: "failed", color: "#dc2626", bg: "#fef2f2", desc: "Pembayaran gagal" },
              ].map((s2) => (
                <div key={s2.status} style={{ background: s2.bg, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ background: s2.color, color: "#fff", borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{s2.status}</span>
                  <span style={{ fontSize: 13, color: "#555" }}>{s2.desc}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* C.3. Simulasi */}
          <Section id="simulate" title="C.3. Simulasi Bayar (Sandbox)" icon="🧪">
            <p style={s.p}>Khusus mode sandbox. Gunakan endpoint ini untuk mensimulasikan pembayaran tanpa uang nyata.</p>
            <div style={s.methodLine}><Badge method="POST" /> <code style={s.inlineCode}>/api/simulate</code></div>
            <CodeBlock lang="json" code={`{
  "orderId": "ORDER-2026-001",
  "amount": 50000,
  "adminKey": "WEBHOOK_SECRET_KAMU"
}`} />
          </Section>

          {/* C.4. Transaction Detail */}
          <Section id="transaction" title="C.4. Transaction Detail (User)" icon="📋">
            <p style={s.p}>Ambil semua transaksi berdasarkan email pelanggan.</p>
            <div style={s.methodLine}><Badge method="GET" /> <code style={s.inlineCode}>/api/user/transactions?email=budi@email.com</code></div>
            <CodeBlock lang="json" code={`{
  "success": true,
  "data": [
    {
      "id": "ZY-1746624000000-ABC123",
      "orderId": "ORDER-2026-001",
      "amount": 50000,
      "customerName": "Budi Santoso",
      "customerEmail": "budi@email.com",
      "description": "Pembelian Produk Digital",
      "status": "paid",
      "createdAt": "2026-05-07T10:00:00.000Z",
      "paidAt": "2026-05-07T10:12:34.000Z"
    }
  ]
}`} />
          </Section>

          {/* D. Webhook */}
          <Section id="webhook" title="D. Webhook" icon="🔔">
            <p style={s.p}>Webhook dikirim secara otomatis ke <code style={s.inlineCode}>webhookUrl</code> yang kamu daftarkan saat membuat transaksi, ketika status pembayaran berubah.</p>

            <h3 style={s.h3}>Payload Webhook</h3>
            <CodeBlock lang="json" code={`{
  "transactionId": "ZY-1746624000000-ABC123",
  "orderId": "ORDER-2026-001",
  "amount": 50000,
  "status": "paid",
  "paidAt": "2026-05-07T10:12:34.000Z"
}`} />

            <h3 style={s.h3}>Contoh Handler Webhook (Node.js)</h3>
            <CodeBlock lang="javascript" code={`app.post('/webhook', (req, res) => {
  const { transactionId, orderId, status, amount } = req.body;

  if (status === 'paid') {
    // Aktifkan produk, kirim email, dll
    console.log(\`Order \${orderId} sudah dibayar: Rp \${amount}\`);
    fulfillOrder(orderId);
  }

  res.json({ received: true });
});`} />
          </Section>

          {/* E. WordPress */}
          <Section id="wordpress" title="E. WordPress Plugin" icon="🌐">
            <p style={s.p}>Tambahkan snippet ini ke <code style={s.inlineCode}>functions.php</code> tema WordPress kamu untuk integrasi dasar.</p>
            <CodeBlock lang="php" code={`function zyfay_create_payment($amount, $name, $email, $order_id) {
  $response = wp_remote_post('${BASE_URL}/api/create-payment', [
    'body'    => json_encode([
      'amount'        => $amount,
      'customerName'  => $name,
      'customerEmail' => $email,
      'orderId'       => $order_id,
      'webhookUrl'    => home_url('/zyfay-webhook'),
    ]),
    'headers' => ['Content-Type' => 'application/json'],
  ]);

  return json_decode(wp_remote_retrieve_body($response), true);
}

// Terima webhook
add_action('rest_api_init', function () {
  register_rest_route('zyfay', '/webhook', [
    'methods'  => 'POST',
    'callback' => function (WP_REST_Request $req) {
      $data = $req->get_json_params();
      if ($data['status'] === 'paid') {
        // Proses order
        wc_update_order_status($data['orderId'], 'completed');
      }
      return new WP_REST_Response(['received' => true], 200);
    },
    'permission_callback' => '__return_true',
  ]);
});`} />
          </Section>

          {/* F. ESS */}
          <Section id="ess" title="F. ESS (Vanilla JS)" icon="⚡">
            <p style={s.p}>Integrasi menggunakan vanilla JavaScript / ES Modules, cocok untuk website statis atau CMS apapun.</p>
            <CodeBlock lang="javascript" code={`// Buat payment
async function createPayment(data) {
  const res = await fetch('${BASE_URL}/api/create-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Cek status
async function checkPayment(transactionId) {
  const res = await fetch(\`${BASE_URL}/api/check-payment?id=\${transactionId}\`);
  return res.json();
}

// Contoh penggunaan
const result = await createPayment({
  amount: 50000,
  customerName: 'Budi Santoso',
  customerEmail: 'budi@email.com',
  description: 'Pembelian Plugin',
  orderId: 'ORDER-' + Date.now(),
  webhookUrl: 'https://yoursite.com/webhook',
});

if (result.success) {
  window.open(result.data.paymentUrl, '_blank');
}`} />
          </Section>

          {/* G. Flutter */}
          <Section id="flutter" title="G. Flutter / Dart" icon="📱">
            <p style={s.p}>Integrasi menggunakan <code style={s.inlineCode}>http</code> package di Flutter.</p>
            <CodeBlock lang="dart" code={`import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> createPayment({
  required int amount,
  required String customerName,
  required String customerEmail,
  required String orderId,
}) async {
  final res = await http.post(
    Uri.parse('${BASE_URL}/api/create-payment'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      'amount': amount,
      'customerName': customerName,
      'customerEmail': customerEmail,
      'orderId': orderId,
    }),
  );
  return jsonDecode(res.body);
}

// Penggunaan
final result = await createPayment(
  amount: 50000,
  customerName: 'Budi Santoso',
  customerEmail: 'budi@email.com',
  orderId: 'ORDER-\${DateTime.now().millisecondsSinceEpoch}',
);

if (result['success'] == true) {
  final url = result['data']['paymentUrl'];
  launchUrl(Uri.parse(url));
}`} />
          </Section>

          {/* H. Node.js */}
          <Section id="nodejs" title="H. Node.js Package" icon="📦">
            <p style={s.p}>Gunakan langsung dengan <code style={s.inlineCode}>fetch</code> native (Node 18+) atau axios.</p>
            <CodeBlock lang="javascript" code={`// zyfay.js - helper module
const BASE = '${BASE_URL}';

export async function createPayment(data) {
  const res = await fetch(\`\${BASE}/api/create-payment\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

export async function checkPayment(transactionId) {
  const res = await fetch(\`\${BASE}/api/check-payment?id=\${transactionId}\`);
  return res.json();
}

// Contoh Express.js webhook handler
import express from 'express';
const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  const { orderId, status, amount } = req.body;
  if (status === 'paid') {
    console.log(\`✅ \${orderId} dibayar Rp \${amount}\`);
    // fulfillOrder(orderId);
  }
  res.json({ received: true });
});`} />

            <div style={s.infoBox}>
              <strong>💡 Tips:</strong> Simpan <code style={s.inlineCode}>transactionId</code> di database kamu untuk polling status atau reconcile dengan webhook.
            </div>
          </Section>

          <div style={s.footer}>
            <p>© 2026 Zyfay Official Digital · Powered by Pakasir Payment Gateway</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
              <a href="/admin/login" style={s.footerLink}>Admin</a>
              <a href="/user/login" style={s.footerLink}>Cek Pesanan</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0d0d0d", color: "#e0e0e0", fontFamily: "'IBM Plex Mono', 'Courier New', monospace" },
  topNav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", borderBottom: "1px solid #1e1e1e", background: "#0d0d0d", position: "sticky", top: 0, zIndex: 100 },
  navLogo: { fontSize: 18, fontWeight: 800, color: "#a78bfa", textDecoration: "none", letterSpacing: -0.5 },
  navLinks: { display: "flex", gap: 16, alignItems: "center" },
  navLink: { color: "#888", fontSize: 13, textDecoration: "none" },
  navLinkBtn: { background: "#a78bfa20", color: "#a78bfa", padding: "6px 14px", borderRadius: 8, fontSize: 13, textDecoration: "none", fontWeight: 600, border: "1px solid #a78bfa40" },
  layout: { display: "flex", maxWidth: 1200, margin: "0 auto" },
  sidebar: { width: 220, padding: "28px 16px", position: "sticky", top: 57, height: "calc(100vh - 57px)", overflowY: "auto", borderRight: "1px solid #1e1e1e", flexShrink: 0 },
  sidebarTitle: { fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 },
  sidebarVersion: { fontSize: 11, color: "#444", marginBottom: 20 },
  navItem: { display: "block", width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 8, background: "none", border: "none", color: "#666", fontSize: 12, cursor: "pointer", marginBottom: 2 },
  navItemActive: { background: "#a78bfa15", color: "#a78bfa" },
  main: { flex: 1, padding: "40px 48px", maxWidth: 820 },
  heroBox: { marginBottom: 48, paddingBottom: 32, borderBottom: "1px solid #1e1e1e" },
  heroTitle: { fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: -1 },
  heroDate: { color: "#555", fontSize: 13, margin: 0 },
  section: { marginBottom: 56, scrollMarginTop: 80 },
  sectionTitle: { fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #1e1e1e" },
  h3: { fontSize: 14, fontWeight: 600, color: "#a78bfa", marginBottom: 10, marginTop: 24, textTransform: "uppercase", letterSpacing: 0.5 },
  p: { color: "#999", fontSize: 14, lineHeight: 1.7, marginBottom: 12 },
  ul: { color: "#999", fontSize: 14, lineHeight: 2, paddingLeft: 20 },
  codeWrap: { background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, overflow: "hidden", marginBottom: 16 },
  codeHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderBottom: "1px solid #1e1e1e", background: "#0d0d0d" },
  codeLang: { fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1 },
  copyBtn: { background: "none", border: "1px solid #333", color: "#666", padding: "3px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer" },
  pre: { margin: 0, padding: "16px 18px", overflowX: "auto", fontSize: 12, lineHeight: 1.7, color: "#a78bfa" },
  badge: { display: "inline-block", padding: "3px 8px", borderRadius: 5, fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: 0.5 },
  methodLine: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "10px 14px", background: "#111", borderRadius: 8, border: "1px solid #1e1e1e" },
  endpointTable: { border: "1px solid #1e1e1e", borderRadius: 10, overflow: "hidden", marginBottom: 16 },
  endpointRow: { display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderBottom: "1px solid #111", flexWrap: "wrap" },
  endpointPath: { color: "#e0e0e0", fontSize: 13, fontFamily: "monospace", flex: 1 },
  endpointDesc: { color: "#555", fontSize: 12 },
  table: { width: "100%", borderCollapse: "collapse", marginBottom: 16, fontSize: 13 },
  thead: { background: "#111" },
  th: { padding: "10px 12px", textAlign: "left", color: "#555", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #1e1e1e" },
  tr: { borderBottom: "1px solid #111" },
  td: { padding: "10px 12px", color: "#999", verticalAlign: "top" },
  inlineCode: { background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#a78bfa", padding: "1px 6px", borderRadius: 4, fontSize: "0.9em", fontFamily: "monospace" },
  typeTag: { background: "#1e1e2e", color: "#7dd3fc", padding: "1px 6px", borderRadius: 4, fontSize: 11 },
  statusGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 },
  infoBox: { background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 10, padding: "14px 16px", fontSize: 13, color: "#7dd3fc", marginTop: 8 },
  footer: { marginTop: 80, paddingTop: 32, borderTop: "1px solid #1e1e1e", textAlign: "center", color: "#444", fontSize: 12 },
  footerLink: { color: "#555", textDecoration: "none" },
};
