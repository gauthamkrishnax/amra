"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  saveRewards,
  getGoalsAndRewards,
} from "@/app/_lib/firestore/goalsAndRewards";
import SubmitButton from "@/app/_components/SubmitButton";
import Link from "next/link";

function SetRewardsContent() {
  const searchParams = useSearchParams();
  const fromSettings = searchParams.get("from") === "settings";

  const [error, setError] = useState(null);
  const [currentRewards, setCurrentRewards] = useState(null);
  const [loading, setLoading] = useState(fromSettings);

  useEffect(() => {
    if (fromSettings) {
      async function fetchRewards() {
        try {
          const data = await getGoalsAndRewards();
          setCurrentRewards(data?.rewards || null);
        } catch (err) {
          // Ignore errors, just show empty form
        } finally {
          setLoading(false);
        }
      }
      fetchRewards();
    }
  }, [fromSettings]);

  async function handleSubmit(formData) {
    setError(null);
    try {
      const redirectTo = fromSettings ? "/settings" : "/";
      await saveRewards(formData, redirectTo);
    } catch (err) {
      setError(err.message || "Failed to save rewards");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-violet-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            {fromSettings && (
              <Link
                href="/settings"
                className="inline-block mb-4 text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Settings
              </Link>
            )}
            <h1 className="text-3xl font-bold bg-linear-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              {fromSettings ? "Update Rewards" : "Set Your Rewards"}
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              What treats will motivate you?
            </p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="reward1"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Reward 1{" "}
                  <span className="text-amber-400/70 text-xs">(20 pts)</span>
                </label>
                <input
                  type="text"
                  id="reward1"
                  name="reward1"
                  required
                  defaultValue={currentRewards?.reward1 || ""}
                  placeholder="e.g., Movie night"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="reward2"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Reward 2{" "}
                  <span className="text-amber-400/70 text-xs">(50 pts)</span>
                </label>
                <input
                  type="text"
                  id="reward2"
                  name="reward2"
                  required
                  defaultValue={currentRewards?.reward2 || ""}
                  placeholder="e.g., Fancy dinner out"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="reward3"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Reward 3{" "}
                  <span className="text-amber-400/70 text-xs">(100 pts)</span>
                </label>
                <input
                  type="text"
                  id="reward3"
                  name="reward3"
                  required
                  defaultValue={currentRewards?.reward3 || ""}
                  placeholder="e.g., Weekend getaway"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <SubmitButton
              className="w-full py-3 px-4 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              pendingText="Saving..."
            >
              {fromSettings ? "Save Rewards" : "Complete Setup ✓"}
            </SubmitButton>
          </form>
        </div>

        {!fromSettings && (
          <p className="text-center text-slate-500 text-xs mt-6">
            Step 2 of 2 • Rewards
          </p>
        )}
      </div>
    </div>
  );
}

export default function SetRewardsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
          <div className="animate-pulse text-violet-400">Loading...</div>
        </div>
      }
    >
      <SetRewardsContent />
    </Suspense>
  );
}
