"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Button from "./ui/Button";

function getIsStandalone() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches
  );
}

function subscribeToStandalone(callback) {
  const mql = window.matchMedia("(display-mode: standalone)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getIsIOS() {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export default function InstallPrompt({ isOpen, onClose }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const isStandalone = useSyncExternalStore(
    subscribeToStandalone,
    getIsStandalone,
    () => false,
  );
  const isIOS = useSyncExternalStore(
    () => () => {},
    getIsIOS,
    () => false,
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        onClose();
      }
    }
  };

  if (!isOpen || isStandalone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal content */}
      <div className="relative bg-white rounded-lg max-w-sm w-full mx-4 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-primary hover:text-primary/70 transition-colors"
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <h3 className="text-2xl font-bold text-primary mb-4">Install App</h3>

          {isIOS ? (
            <div className="flex flex-col gap-4">
              <div className="bg-mypurple/30 rounded-lg p-4">
                <p className="text-primary">
                  To install this app on your iOS device:
                </p>
                <ol className="text-primary mt-2 list-decimal list-inside space-y-1">
                  <li>
                    Tap the share button
                    <span role="img" aria-label="share icon" className="mx-1">
                      ⎋
                    </span>
                  </li>
                  <li>
                    Select &quot;Add to Home Screen&quot;
                    <span role="img" aria-label="plus icon" className="mx-1">
                      ➕
                    </span>
                  </li>
                </ol>
              </div>
              <div>
                <Button action={onClose} noForm color="purple" shape="shape3">
                  Got it!
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="bg-mypurple/30 rounded-lg p-4">
                <p className="text-primary">
                  Add this app to your home screen for quick access.
                </p>
              </div>
              <div>
                <Button
                  action={handleInstallClick}
                  noForm
                  color="purple"
                  shape="shape4"
                >
                  Add to Home Screen
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
