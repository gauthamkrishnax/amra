"use client";

import { deleteCookie, setCookie } from "cookies-next";

import { useEffect } from "react";

import { onIdTokenChanged } from "@/lib/firebase/auth";

/**
 * Global authentication provider that syncs Firebase auth state with cookies
 * This ensures the session cookie is always up-to-date across all pages
 */
export default function AuthProvider({ children }) {
  useEffect(() => {
    // Set up token refresh interval (refresh every 50 minutes, before the 1-hour expiration)
    let refreshInterval;

    const unsubscribe = onIdTokenChanged(async (user) => {
      // Clear any existing refresh interval
      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
      }

      if (user) {
        // Force get a fresh token (this will refresh if needed)
        const idToken = await user.getIdToken(true);

        // Set cookie with proper security options
        // maxAge is set to 1 hour (3600 seconds) to match Firebase token expiration
        await setCookie("__session", idToken, {
          maxAge: 60 * 60, // 1 hour in seconds
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });

        // Set up interval to refresh token every 50 minutes (before expiration)
        refreshInterval = setInterval(
          async () => {
            try {
              const freshToken = await user.getIdToken(true);
              await setCookie("__session", freshToken, {
                maxAge: 60 * 60,
                path: "/",
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
              });
              console.log("Token refreshed successfully");
            } catch (error) {
              console.error("Error refreshing token:", error);
            }
          },
          50 * 60 * 1000,
        ); // 50 minutes in milliseconds
      } else {
        // User signed out, delete the cookie
        await deleteCookie("__session", { path: "/" });
      }
    });

    // Cleanup function
    return () => {
      unsubscribe();
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  return <>{children}</>;
}
