"use client";

import { onAuthStateChanged } from "firebase/auth";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import content from "@/content/signIn";
import { auth } from "@/lib/firebase/clientApp";
import {
  createCouple,
  findUserByCode,
  getUser,
} from "@/lib/firebase/firestore-client";
import Button from "@/ui/components/button";
import Textbox from "@/ui/components/textbox";

export default function Connect() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setCurrentUser(authUser);
        try {
          const userData = await getUser(authUser.uid);
          if (userData) {
            setUser(userData);
          } else {
            // User document doesn't exist, redirect to username page
            router.push("/username");
            return;
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to load your profile. Please try again.");
        }
      } else {
        router.push("/signIn");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  async function handleConnect(e) {
    e.preventDefault();
    setError("");
    setConnecting(true);

    const formData = new FormData(e.target);
    const partnerCode = formData.get("partnerCode")?.trim().toUpperCase();

    if (!partnerCode) {
      setError("Please enter a code");
      setConnecting(false);
      return;
    }

    try {
      // Find partner by code
      const partner = await findUserByCode(partnerCode);

      if (!partner) {
        setError("Invalid code. Please check and try again.");
        setConnecting(false);
        return;
      }

      // Prevent self-connection
      if (partner.uid === currentUser.uid) {
        setError("You cannot connect with yourself!");
        setConnecting(false);
        return;
      }

      // Create the couple connection
      await createCouple(currentUser.uid, partner.uid);

      // Success - redirect to home
      router.push("/");
    } catch (err) {
      console.error("Connection error:", err);

      // User-friendly error messages
      if (err.message?.includes("permission")) {
        setError("Permission denied. Please contact support.");
      } else if (err.message === "Cannot create couple with the same user") {
        setError("You cannot connect with yourself!");
      } else {
        setError("Failed to create connection. Please try again.");
      }

      setConnecting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-20">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <h1 className="mb-10 max-w-3xs pt-10 text-4xl font-bold">
        {content.connectDescription}
      </h1>

      <div className="bg-secondary -mx-10 mb-5 px-10 py-5">
        <h2 className="mb-2 text-xl font-semibold">Your Love code:</h2>
        <span className="text-4xl font-bold text-black">{user.code}</span>
      </div>

      <form onSubmit={handleConnect}>
        <Textbox
          variant="filled"
          label="Enter your partner's love code:"
          name="partnerCode"
          required
          maxLength={7}
          style={{ textTransform: "uppercase" }}
          placeholder="ABC1234"
        />

        {error && (
          <p className="my-2 font-semibold text-red-600" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" disabled={connecting}>
          {connecting ? "Connecting..." : "Connect"}
        </Button>
      </form>
    </>
  );
}
