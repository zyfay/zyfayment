import { NextRequest, NextResponse } from "next/server";
import { getAllTransactions } from "@/lib/store";

function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 3) return false;
    const validPassword = process.env.ADMIN_PASSWORD || "admin123";
    const validUsername = process.env.ADMIN_USERNAME || "admin";
    return parts[0] === validUsername && parts[2] === validPassword;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("Authorization") || "";
  const token = auth.replace("Bearer ", "");

  if (!verifyToken(token)) {
    return NextResponse.json({ unauthorized: true }, { status: 401 });
  }

  const all = getAllTransactions();
  return NextResponse.json({ success: true, data: all });
}
