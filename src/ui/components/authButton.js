"use client";

import { LogIn } from "lucide-react";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import content from "@/content/signIn";
import {
  onAuthStateChanged,
  signInWithGoogle,
  signOut,
} from "@/lib/firebase/auth";

import Button from "./button";

export default function SignIn({ initialUser }) {
  const router = useRouter();

  useEffect(() => {
    // Listen for auth state changes and redirect if user is authenticated
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, redirect to home
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // If initially authenticated, redirect immediately
  useEffect(() => {
    if (initialUser) {
      router.push("/");
    }
  }, [initialUser, router]);

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
