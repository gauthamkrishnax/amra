"use client";

import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase/clientApp";
import { createUser } from "@/lib/firebase/firestore-client";
import Button from "@/ui/components/button";
import Textbox from "@/ui/components/textbox";

export default function Username() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        router.push("/signIn");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData(e.target);
    const nickname = formData.get("nickname")?.trim();

    if (!nickname) {
      setError("Please enter a nickname");
      setSubmitting(false);
      return;
    }

    if (nickname.length < 2) {
      setError("Nickname must be at least 2 characters");
      setSubmitting(false);
      return;
    }

    if (nickname.length > 50) {
      setError("Nickname must be less than 50 characters");
      setSubmitting(false);
      return;
    }

    try {
      await createUser(currentUser, nickname);
      router.push("/connect");
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create profile. Please try again.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-20">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-10 max-w-3xs pt-10 text-4xl font-bold">
        What should your partner call you?
      </h1>
      
      <form onSubmit={handleSubmit}>
        <Textbox
          label="Enter your nickname:"
          name="nickname"
          required
          minLength={2}
          maxLength={50}
          placeholder="Your nickname"
        />
        
        {error && (
          <p className="my-2 font-semibold text-red-600" role="alert">
            {error}
          </p>
        )}
        
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}
