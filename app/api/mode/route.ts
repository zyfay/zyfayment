import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ sandbox: process.env.PAKASIR_MODE === "sandbox" });
}
