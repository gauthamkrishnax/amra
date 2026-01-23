"use client";

import { useState, useEffect } from "react";
import {
  getPartnerGoals,
  addPointsToPartner,
} from "@/app/_lib/firestore/goalsAndRewards";
import SubmitButton from "@/app/_components/SubmitButton";
import LinkButton from "@/app/_components/ui/LinkButton";
import GoalCheckIllustration from "@/app/_illustrations/goalCheck";
import Divider from "@/app/_components/ui/Divider";
import Button from "@/app/_components/ui/Button";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-violet-400">Loading...</div>
      </div>
    );
  }

  if (!partnerData || !partnerData.goals) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-6">
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
    <div className="min-h-screen">
      <div className="my-2 mx-10 mb-10">
        <LinkButton href="/" color="blue" shape="shape2">
          <h1 className="text-2xl font-bold ">
            How did {partnerData.nickname} do today?
          </h1>
        </LinkButton>
      </div>

      <GoalCheckIllustration className="mb-5" />

      <Divider />

      <div className="mx-10 my-2">
        <p className="text-lg max-w-60 text-primary">
          Select all goals that {partnerData.nickname} was able to work on
          today!
        </p>
      </div>

      <form action={handleSubmit} className="mx-10 my-2">
        <div className="flex flex-wrap mb-2">
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
              <div>
                <p className="text-lg font-bold text-primary group-hover:text-violet-200 transition-colors">
                  {goal.label}
                </p>
              </div>
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
            <p className="text-emerald-400 text-sm text-center">{success}</p>
          </div>
        )}

        <SubmitButton
          className="my-2 bg-myblue rotate-2 text-primary font-bold text-2xl px-3 py-1 break-word whitespace-normal"
          pendingText="Adding points..."
        >
          Submit
        </SubmitButton>
      </form>
    </div>
  );
}
