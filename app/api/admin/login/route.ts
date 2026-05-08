import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUsername = process.env.ADMIN_USERNAME || "admin";
  const validPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (username === validUsername && password === validPassword) {
    // Token sederhana: base64 dari username+timestamp, signed dengan password
    const token = Buffer.from(`${username}:${Date.now()}:${validPassword}`).toString("base64");
    return NextResponse.json({ success: true, token });
  }

  return NextResponse.json({ success: false, message: "Username atau password salah" }, { status: 401 });
}
