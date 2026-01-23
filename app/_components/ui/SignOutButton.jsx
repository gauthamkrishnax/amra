"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./Button";

export default function SignOutButton() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/signin");
    } catch (err) {
      setSigningOut(false);
    }
  }

  return (
    <Button
      color="red"
      shape="shape1"
      action={handleSignOut}
      disabled={signingOut}
      noForm={true}
    >
      <div className="flex-1 text-left">
        {signingOut ? "Signing out..." : "Sign Out"}
      </div>
    </Button>
  );
}
