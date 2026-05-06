import type { Metadata } from "next";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://zyfayment.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Zyfayment - Payment Gateway QRIS Indonesia",
    template: "%s | Zyfayment",
  },
  description: "Zyfayment adalah payment gateway QRIS Indonesia yang mudah, cepat, dan aman. Terima pembayaran dari semua e-wallet dan bank dengan satu QR Code.",
  keywords: [
    "payment gateway indonesia",
    "payment gateway qris",
    "qris payment gateway",
    "terima pembayaran qris",
    "payment gateway murah",
    "payment gateway gratis",
    "integrasi pembayaran qris",
    "api payment gateway",
    "zyfay payment",
    "zyfayment",
    "zyfayment",
    "payment gateway gopay",
    "payment gateway ovo",
    "payment gateway dana",
    "payment gateway shopeepay",
    "payment gateway linkaja",
    "payment gateway virtual account",
    "cara terima pembayaran online",
    "sistem pembayaran online indonesia",
    "qris untuk bisnis",
    "qris umkm",
    "pembayaran digital indonesia",
    "gateway pembayaran indonesia",
    "payment gateway webhook",
    "payment gateway api",
  ],
  authors: [{ name: "Zyfay Official Digital" }],
  creator: "Zyfay Official Digital",
  publisher: "Zyfay Official Digital",
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: APP_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Zyfayment - Payment Gateway QRIS Indonesia",
    description: "Terima pembayaran QRIS dari semua e-wallet dan bank. Integrasi mudah, webhook otomatis, dashboard lengkap.",
    url: APP_URL,
    siteName: "Zyfayment",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zyfayment - Payment Gateway QRIS Indonesia",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zyfayment - Payment Gateway QRIS Indonesia",
    description: "Terima pembayaran QRIS dari semua e-wallet dan bank. Integrasi mudah, webhook otomatis.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "sr94X401c4jI9IiwOmrE8xFkzGfK0EAmuIv6D74Qb5Y",  // isi Google Search Console verification code nanti
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Zyfayment",
              "description": "Payment Gateway QRIS Indonesia untuk bisnis online. Terima pembayaran dari GoPay, OVO, DANA, ShopeePay, dan semua bank.",
              "url": APP_URL,
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "IDR",
              },
              "provider": {
                "@type": "Organization",
                "name": "Zyfay Official Digital",
                "url": "https://zyfay-official.vercel.app",
              },
            }),
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
