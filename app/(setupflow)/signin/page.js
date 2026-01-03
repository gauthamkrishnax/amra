"use client";

import { useState } from "react";
import { signInWithGoogle } from "@/app/_lib/auth/client.js";
import Logo from "@/app/_components/ui/Logo";
import SignInIllustration from "@/app/_illustrations/signin.jsx";
import BoringButton from "@/app/_components/ui/BoringButton";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" p-10 pb-30 flex flex-col justify-between min-h-dvh">
      <div>
        <Logo className="" />

        <p className="mt-8 text-3xl max-w-3/4">Sign up for the best love.</p>

        <SignInIllustration className="mt-8" />
      </div>

      <div className="mt-8">
        <BoringButton action={handleSignIn} disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In with Google"}
        </BoringButton>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
