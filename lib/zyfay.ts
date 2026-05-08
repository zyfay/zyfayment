// lib/zyfay.ts - Pakasir Payment Gateway Integration

import { Pakasir } from "pakasir-sdk";

const isSandbox = process.env.PAKASIR_MODE === "sandbox";

export const pakasir = new Pakasir({
  slug: process.env.PAKASIR_SLUG || "zyfay-official",
  apikey: process.env.PAKASIR_API_KEY || "",
  ...(isSandbox ? { baseUrl: "https://sandbox.pakasir.com" } : {}),
});

export const MERCHANT_NAME = "Zyfay Official Digital";
export const MERCHANT_NMID = "ID1025424358865";
export const IS_SANDBOX = isSandbox;

// Helper format rupiah
export function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}
