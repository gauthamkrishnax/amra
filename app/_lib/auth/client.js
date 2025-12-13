import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/app/_lib/firebase/client.js";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  // 1. Open Google popup
  const provider = new GoogleAuthProvider();
  const userCred = await signInWithPopup(auth, provider);

  // 2. Get Firebase ID token
  const token = await userCred.user.getIdToken();

  // 3. Exchange token for session cookie
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    throw new Error("Failed to create session");
  }

  redirect("/");
}
