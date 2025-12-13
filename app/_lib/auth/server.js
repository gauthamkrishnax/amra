import { cookies } from "next/headers";
import { adminAuth } from "@/app/_lib/firebase/admin";

export async function getCurrentUser() {
  const cookie = await cookies();

  if (!cookie) return null;
  const session = cookie.get("__session");

  try {
    return await adminAuth.verifySessionCookie(session?.value, true);
  } catch {
    return null;
  }
}
