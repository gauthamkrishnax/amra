"use client";

import { LogIn } from "lucide-react";

import content from "@/content/signIn";
import { signInWithGoogle, signOut } from "@/lib/firebase/auth";

import Button from "./button";

export default function SignIn({ initialUser }) {
  const handleSignOut = (event) => {
    event.preventDefault();
    signOut();
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    signInWithGoogle();
  };

  return (
    <div className="flex justify-center">
      {initialUser ? (
        <Button onClick={handleSignOut}>Sign out</Button>
      ) : (
        <Button onClick={handleSignIn}>
          {content.buttonText}
          <LogIn></LogIn>
        </Button>
      )}
    </div>
  );
}
