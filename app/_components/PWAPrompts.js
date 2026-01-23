"use client";

import { useState, useSyncExternalStore, useCallback } from "react";
import PushNotificationManager from "./pushNotificationManager";
import InstallPrompt from "./InstallPrompt";

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

function getHasSeenPrompts() {
  return (
    typeof window !== "undefined" &&
    localStorage.getItem("hasSeenPWAPrompts") === "true"
  );
}

// Track if we should show prompts based on localStorage
let shouldShowPromptsCache = null;
function getShouldShowPrompts() {
  if (typeof window === "undefined") return false;
  if (shouldShowPromptsCache === null) {
    shouldShowPromptsCache = !localStorage.getItem("hasSeenPWAPrompts");
  }
  return shouldShowPromptsCache;
}

export default function PWAPrompts() {
  const isStandalone = useSyncExternalStore(
    subscribeToStandalone,
    getIsStandalone,
    () => true,
  );
  const shouldShowPrompts = useSyncExternalStore(
    () => () => {},
    getShouldShowPrompts,
    () => false,
  );

  const [installDismissed, setInstallDismissed] = useState(false);
  const [notificationsDismissed, setNotificationsDismissed] = useState(false);

  // Compute what to show based on external state and dismissal state
  const showInstall = shouldShowPrompts && !isStandalone && !installDismissed;
  const showNotifications =
    shouldShowPrompts &&
    (isStandalone || installDismissed) &&
    !notificationsDismissed;

  const handleInstallClose = useCallback(() => {
    setInstallDismissed(true);
  }, []);

  const handleNotificationsClose = useCallback(() => {
    setNotificationsDismissed(true);
    // Mark prompts as seen
    localStorage.setItem("hasSeenPWAPrompts", "true");
    shouldShowPromptsCache = false;
  }, []);

  return (
    <>
      <InstallPrompt isOpen={showInstall} onClose={handleInstallClose} />
      <PushNotificationManager
        isOpen={showNotifications}
        onClose={handleNotificationsClose}
      />
    </>
  );
}
