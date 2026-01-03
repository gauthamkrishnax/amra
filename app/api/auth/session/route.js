import { adminAuth } from "@/app/_lib/firebase/admin.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { token } = await req.json();

  // Max Expiry time for firebase auth is 14 days,
  // so we need to set the expiry time to 13 days + 23 hours
  const expiresIn = 60 * 60 * 24 * 13 * 1000 + 60 * 60 * 23 * 1000; // 13 days + 23 hours

  const sessionCookie = await adminAuth.createSessionCookie(token, {
    expiresIn,
  });

  const response = NextResponse.json({ success: true });

  response.cookies.set("__session", sessionCookie, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: Math.floor(expiresIn / 1000) - 60 * 60, // 1 hour before expiration to prevent race condition
  });

  return response;
}
