"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MENU_ITEMS = [
  {
    href: "/setGoals?from=settings",
    label: "Set Goals",
    icon: "🎯",
    description: "Update your personal goals",
  },
  {
    href: "/setRewards?from=settings",
    label: "Set Rewards",
    icon: "🎁",
    description: "Update your rewards",
  },
  {
    href: "/nickname",
    label: "Change Nickname",
    icon: "✏️",
    description: "Update your display name",
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/signin");
    } catch (err) {
      setSigningOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-slate-400 to-slate-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl">⚙️</span>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent">
              Settings
            </h1>
          </div>

          <div className="space-y-3">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xl">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-slate-500 text-sm">{item.description}</p>
                </div>
                <span className="text-slate-500 group-hover:text-white transition-colors">
                  →
                </span>
              </Link>
            ))}

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">🚪</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-red-400 font-medium">
                  {signingOut ? "Signing out..." : "Sign Out"}
                </p>
                <p className="text-red-400/50 text-sm">
                  Log out of your account
                </p>
              </div>
            </button>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Manage your account and preferences
        </p>
      </div>
    </div>
  );
}
