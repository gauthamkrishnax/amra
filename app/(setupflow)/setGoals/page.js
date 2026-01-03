"use client";

import { useState } from "react";
import { saveGoals } from "@/app/_lib/firestore/goalsAndRewards";
import SubmitButton from "@/app/_components/SubmitButton";

export default function SetGoalsPage() {
  const [error, setError] = useState(null);

  async function handleSubmit(formData) {
    setError(null);
    try {
      await saveGoals(formData);
    } catch (err) {
      setError(err.message || "Failed to save goals");
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-linear-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              Set Your Goals
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
              Continue to Rewards →
            </SubmitButton>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Step 1 of 2 • Goals
        </p>
      </div>
    </div>
  );
}
