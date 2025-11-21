"use client";

import { deleteCookie, setCookie } from "cookies-next";
import { LogIn } from "lucide-react";

import { useEffect } from "react";

import content from "@/content/signIn";
import {
  onIdTokenChanged,
  signInWithGoogle,
  signOut,
} from "@/lib/firebase/auth";

import Button from "./button";

function useUserSession(initialUser) {
  useEffect(() => {
    return onIdTokenChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        await setCookie("__session", idToken);
      } else {
        await deleteCookie("__session");
      }
      if (initialUser?.uid === user?.uid) {
        return;
      }
      window.location.reload();
    });
  }, [initialUser]);

  return initialUser;
}

export default function SignIn({ initialUser }) {
  const user = useUserSession(initialUser);

  const handleSignOut = (event) => {
    event.preventDefault();
    signOut();
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    signInWithGoogle();
  };

  return (
    <div>
      {user ? (
        <button
          className="bg-primary rounded-md px-4 py-2 text-white"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      ) : (
        <Button className="mb-40 ml-8 font-bold" onClick={handleSignIn}>
          {content.buttonText}
          <LogIn></LogIn>
        </Button>
      )}
    </div>
  );
}
