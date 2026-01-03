"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  saveGoals,
  getGoalsAndRewards,
} from "@/app/_lib/firestore/goalsAndRewards";
import SubmitButton from "@/app/_components/SubmitButton";
import Link from "next/link";

export default function SetGoalsPage() {
  const searchParams = useSearchParams();
  const fromSettings = searchParams.get("from") === "settings";

  const [error, setError] = useState(null);
  const [currentGoals, setCurrentGoals] = useState(null);
  const [loading, setLoading] = useState(fromSettings);

  useEffect(() => {
    if (fromSettings) {
      async function fetchGoals() {
        try {
          const data = await getGoalsAndRewards();
          setCurrentGoals(data?.goals || null);
        } catch (err) {
          // Ignore errors, just show empty form
        } finally {
          setLoading(false);
        }
      }
      fetchGoals();
    }
  }, [fromSettings]);

  async function handleSubmit(formData) {
    setError(null);
    try {
      const redirectTo = fromSettings ? "/settings" : "/setRewards";
      await saveGoals(formData, redirectTo);
    } catch (err) {
      setError(err.message || "Failed to save goals");
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
            <h1 className="text-3xl font-bold bg-linear-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              {fromSettings ? "Update Goals" : "Set Your Goals"}
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              What do you want to achieve together?
            </p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="goal1"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Goal 1
                </label>
                <input
                  type="text"
                  id="goal1"
                  name="goal1"
                  required
                  defaultValue={currentGoals?.goal1 || ""}
                  placeholder="e.g., Exercise 3x per week"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="goal2"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Goal 2
                </label>
                <input
                  type="text"
                  id="goal2"
                  name="goal2"
                  required
                  defaultValue={currentGoals?.goal2 || ""}
                  placeholder="e.g., Read 20 pages daily"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="goal3"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Goal 3
                </label>
                <input
                  type="text"
                  id="goal3"
                  name="goal3"
                  required
                  defaultValue={currentGoals?.goal3 || ""}
                  placeholder="e.g., Save $500 monthly"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <SubmitButton
              className="w-full py-3 px-4 bg-linear-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              pendingText="Saving..."
            >
              {fromSettings ? "Save Goals" : "Continue to Rewards →"}
            </SubmitButton>
          </form>
        </div>

        {!fromSettings && (
          <p className="text-center text-slate-500 text-xs mt-6">
            Step 1 of 2 • Goals
          </p>
        )}
      </div>
    </div>
  );
}
