import { cookies } from "next/headers";
import { adminAuth } from "@/app/_lib/firebase/admin";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("__session");

  if (!session?.value) return null;

  try {
    return await adminAuth.verifySessionCookie(session.value, true);
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }
  return currentUser;
}
