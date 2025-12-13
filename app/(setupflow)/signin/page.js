"use client";

import { signInWithGoogle } from "@/app/_lib/auth/client.js";
export default function SignInPage() {
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
      onClick={signInWithGoogle}
    >
      Sign In with Google
    </button>
  );
}
