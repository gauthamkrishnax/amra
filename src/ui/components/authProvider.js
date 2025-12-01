"use client";

import { deleteCookie, setCookie } from "cookies-next";

import { useEffect } from "react";

import { onIdTokenChanged } from "@/lib/firebase/auth";

/**
 * Global authentication provider that syncs Firebase auth state with cookies
 * This ensures the session cookie is always up-to-date across all pages
 *
 * Firebase automatically refreshes tokens in the background, and onIdTokenChanged
 * fires whenever the token changes (including automatic refreshes).
 */
export default function AuthProvider({ children }) {
  useEffect(() => {
    // onIdTokenChanged fires when:
    // 1. User signs in/out
    // 2. Token is automatically refreshed by Firebase (before expiration)
    // 3. Token is manually refreshed
    const unsubscribe = onIdTokenChanged(async (user) => {
      if (user) {
        // Get the current token (no force refresh - let Firebase manage the lifecycle)
        // This retrieves the existing valid token or gets a new one if expired
        const idToken = await user.getIdToken();

        // Set cookie with proper security options
        // maxAge is set to 30 days to provide a long session
        // Firebase will automatically refresh the token in the background
        await setCookie("__session", idToken, {
          maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      } else {
        // User signed out, delete the cookie
        await deleteCookie("__session", { path: "/" });
      }
    });

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
