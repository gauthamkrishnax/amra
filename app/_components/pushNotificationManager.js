"use client";
import { useState, useEffect, useSyncExternalStore } from "react";
import { subscribeUser, unsubscribeUser, sendNotification } from "../actions";
import Button from "./ui/Button";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function getIsSupported() {
  if (typeof window === "undefined") return false;

  // Check for basic support
  const hasServiceWorker = "serviceWorker" in navigator;
  const hasPushManager = "PushManager" in window;
  const hasNotifications = "Notification" in window;

  return hasServiceWorker && hasPushManager && hasNotifications;
}

function getIsIOS() {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function getIsStandalone() {
  return (
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true)
  );
}

export default function PushNotificationManager({ isOpen, onClose }) {
  const isSupported = useSyncExternalStore(
    () => () => {},
    getIsSupported,
    () => false,
  );
  const isIOS = useSyncExternalStore(
    () => () => {},
    getIsIOS,
    () => false,
  );
  const isStandalone = useSyncExternalStore(
    () => () => {},
    getIsStandalone,
    () => false,
  );

  const [subscription, setSubscription] = useState(null);
  const [message, setMessage] = useState("");
  const [permissionState, setPermissionState] = useState("default");
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkSubscription() {
      try {
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.ready;
          const sub = await registration.pushManager.getSubscription();
          setSubscription(sub);

          // Check notification permission
          if ("Notification" in window) {
            setPermissionState(Notification.permission);
          }
        }
      } catch (err) {
        console.error("Error checking subscription:", err);
      }
    }

    if (isSupported) {
      checkSubscription();
    }
  }, [isSupported]);

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

  async function subscribeToPush() {
    setError("");

    try {
      // First, explicitly request notification permission
      if (!("Notification" in window)) {
        throw new Error("This browser does not support notifications");
      }

      // Request permission
      const permission = await Notification.requestPermission();
      setPermissionState(permission);

      if (permission !== "granted") {
        setError(
          "Notification permission denied. Please enable notifications in your browser settings.",
        );
        return;
      }

      // Wait for service worker to be ready
      const registration = await navigator.serviceWorker.ready;

      // Check if we already have a subscription
      let sub = await registration.pushManager.getSubscription();

      if (!sub) {
        // Subscribe to push notifications
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          ),
        });
      }

      setSubscription(sub);
      await subscribeUser(sub.toJSON());
    } catch (err) {
      console.error("Error subscribing to push notifications:", err);
      setError(
        err.message ||
          "Failed to subscribe to notifications. Please try again.",
      );
    }
  }

  async function unsubscribeFromPush() {
    try {
      setError("");
      await subscription?.unsubscribe();
      setSubscription(null);
      await unsubscribeUser();
    } catch (err) {
      console.error("Error unsubscribing:", err);
      setError("Failed to unsubscribe. Please try again.");
    }
  }

  async function sendTestNotification() {
    if (subscription) {
      try {
        setError("");
        await sendNotification(message, subscription.toJSON());
        setMessage("");
      } catch (err) {
        console.error("Error sending test notification:", err);
        setError("Failed to send test notification.");
      }
    }
  }

  if (!isOpen) return null;

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
          <h3 className="text-2xl font-bold text-primary mb-4">
            Push Notifications
          </h3>

          {!isSupported ? (
            <div className="bg-myyellow/30 rounded-lg p-4">
              <p className="text-primary">
                {isIOS && !isStandalone
                  ? "Push notifications on iOS are only available when the app is installed. Please install the app first."
                  : "Push notifications are not supported in this browser."}
              </p>
            </div>
          ) : subscription ? (
            <div className="flex flex-col gap-4">
              <div className="bg-mygreen/30 rounded-lg p-3">
                <p className="text-primary">
                  You are subscribed to push notifications.
                </p>
              </div>
              {error && (
                <div className="bg-red-100 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              <div>
                <Button
                  action={unsubscribeFromPush}
                  noForm
                  color="pink"
                  shape="shape3"
                >
                  Unsubscribe
                </Button>
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <p className="text-primary font-bold">
                  Send a test notification:
                </p>
                <input
                  type="text"
                  placeholder="Enter notification message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 border-0 border-b-2 border-gray-300 bg-transparent text-primary"
                />
                <div>
                  <Button
                    action={sendTestNotification}
                    noForm
                    color="green"
                    shape="shape4"
                    disabled={!message.trim()}
                  >
                    Send Test
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="bg-myblue/30 rounded-lg p-3">
                <p className="text-primary">
                  Enable notifications to stay updated.
                </p>
                {isIOS && isStandalone && (
                  <p className="text-primary text-sm mt-2">
                    Note: On iOS, make sure notifications are enabled in
                    Settings → Amra → Notifications.
                  </p>
                )}
              </div>
              {error && (
                <div className="bg-red-100 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              {permissionState === "denied" && (
                <div className="bg-myyellow/30 rounded-lg p-3">
                  <p className="text-primary text-sm">
                    Notifications are blocked. Please enable them in your
                    browser settings:
                    {isIOS
                      ? " Settings → Safari → Amra → Notifications"
                      : " Site Settings → Notifications"}
                  </p>
                </div>
              )}
              <div>
                <Button
                  action={subscribeToPush}
                  noForm
                  color="green"
                  shape="shape3"
                  disabled={permissionState === "denied"}
                >
                  Enable Notifications
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
