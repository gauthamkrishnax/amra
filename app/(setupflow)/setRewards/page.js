"use client";

import { useState } from "react";
import { saveRewards } from "@/app/_lib/firestore/goalsAndRewards";
import SubmitButton from "@/app/_components/SubmitButton";

export default function SetRewardsPage() {
  const [error, setError] = useState(null);

  async function handleSubmit(formData) {
    setError(null);
    try {
      await saveRewards(formData);
    } catch (err) {
      setError(err.message || "Failed to save rewards");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Set Your Rewards
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
                  Reward 1
                </label>
                <input
                  type="text"
                  id="reward1"
                  name="reward1"
                  required
                  placeholder="e.g., Movie night"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="reward2"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Reward 2
                </label>
                <input
                  type="text"
                  id="reward2"
                  name="reward2"
                  required
                  placeholder="e.g., Fancy dinner out"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="reward3"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Reward 3
                </label>
                <input
                  type="text"
                  id="reward3"
                  name="reward3"
                  required
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
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              pendingText="Saving..."
            >
              Complete Setup ✓
            </SubmitButton>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Step 2 of 2 • Rewards
        </p>
      </div>
    </div>
  );
}
