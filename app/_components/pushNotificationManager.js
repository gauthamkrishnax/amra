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
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

export default function PushNotificationManager({ isOpen, onClose }) {
  const isSupported = useSyncExternalStore(
    () => () => {},
    getIsSupported,
    () => false,
  );
  const [subscription, setSubscription] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function registerServiceWorker() {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    }

    if (isSupported) {
      registerServiceWorker();
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
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      ),
    });
    setSubscription(sub);
    await subscribeUser(sub.toJSON());
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message, subscription.toJSON());
      setMessage("");
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
                Push notifications are not supported in this browser.
              </p>
            </div>
          ) : subscription ? (
            <div className="flex flex-col gap-4">
              <div className="bg-mygreen/30 rounded-lg p-3">
                <p className="text-primary">
                  You are subscribed to push notifications.
                </p>
              </div>
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
              </div>
              <div>
                <Button
                  action={subscribeToPush}
                  noForm
                  color="green"
                  shape="shape3"
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
