"use client";

import { useState, useEffect } from "react";
import {
  getPartnerGoals,
  addPointsToPartner,
} from "@/app/_lib/firestore/goalsAndRewards";
import SubmitButton from "@/app/_components/SubmitButton";

export default function GoalCheckPage() {
  const [partnerData, setPartnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchPartnerGoals() {
      try {
        const data = await getPartnerGoals();
        setPartnerData(data);
      } catch (err) {
        setError("Failed to load partner goals");
      } finally {
        setLoading(false);
      }
    }
    fetchPartnerGoals();
  }, []);

  async function handleSubmit(formData) {
    setError(null);
    setSuccess(null);
    try {
      const result = await addPointsToPartner(formData);
      setSuccess(
        `🎉 Added ${result.pointsAdded} point${result.pointsAdded > 1 ? "s" : ""}! ${partnerData.nickname} now has ${result.newTotal} points.`,
      );
    } catch (err) {
      setError(err.message || "Failed to add points");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-violet-400">Loading...</div>
      </div>
    );
  }

  if (!partnerData || !partnerData.goals) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 text-center">
          <p className="text-slate-400">
            Partner hasn&apos;t set their goals yet. Check back later!
          </p>
        </div>
      </div>
    );
  }

  const goals = [
    { key: "goal1", label: partnerData.goals.goal1 },
    { key: "goal2", label: partnerData.goals.goal2 },
    { key: "goal3", label: partnerData.goals.goal3 },
  ].filter((g) => g.label);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-pink-500 to-violet-500 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              Check Goals
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Did{" "}
              <span className="text-pink-400 font-medium">
                {partnerData.nickname}
              </span>{" "}
              complete their goals today?
            </p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              {goals.map((goal, index) => (
                <label
                  key={goal.key}
                  className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all group"
                >
                  <input
                    type="checkbox"
                    name="goals"
                    value={goal.key}
                    className="mt-0.5 w-5 h-5 rounded border-2 border-violet-400/50 bg-transparent text-violet-500 focus:ring-violet-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer accent-violet-500"
                  />
                  <div className="flex-1">
                    <span className="text-xs text-violet-400/70 uppercase tracking-wide">
                      Goal {index + 1}
                    </span>
                    <p className="text-white text-sm mt-1 group-hover:text-violet-200 transition-colors">
                      {goal.label}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5">+1 pt</span>
                </label>
              ))}
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-emerald-400 text-sm text-center">
                  {success}
                </p>
              </div>
            )}

            <SubmitButton
              className="w-full py-3 px-4 bg-linear-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              pendingText="Adding points..."
            >
              Award Points ⭐
            </SubmitButton>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Each checked goal = 1 point for {partnerData.nickname}
        </p>
      </div>
    </div>
  );
}
