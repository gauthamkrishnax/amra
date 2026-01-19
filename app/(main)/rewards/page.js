"use client";

import { useState, useEffect } from "react";
import {
  getRewardsPageData,
  redeemReward,
} from "@/app/_lib/firestore/goalsAndRewards";

const REWARD_COSTS = {
  reward1: 20,
  reward2: 50,
  reward3: 100,
};

export default function RewardsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getRewardsPageData();
        setData(result);
      } catch (err) {
        setError("Failed to load rewards");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleRedeem(rewardKey, rewardName) {
    setError(null);
    setSuccess(null);
    setRedeeming(rewardKey);

    try {
      const result = await redeemReward(rewardKey);
      setSuccess(
        `🎁 Redeemed "${rewardName}"! You spent ${result.cost} points.`,
      );
      setData((prev) => ({
        ...prev,
        currentUserPoints: result.newTotal,
      }));
    } catch (err) {
      setError(err.message || "Failed to redeem reward");
    } finally {
      setRedeeming(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-violet-400">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 text-center">
          <p className="text-slate-400">
            Unable to load rewards. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const rewards = data.partnerRewards
    ? [
        {
          key: "reward1",
          label: data.partnerRewards.reward1,
          cost: REWARD_COSTS.reward1,
        },
        {
          key: "reward2",
          label: data.partnerRewards.reward2,
          cost: REWARD_COSTS.reward2,
        },
        {
          key: "reward3",
          label: data.partnerRewards.reward3,
          cost: REWARD_COSTS.reward3,
        },
      ].filter((r) => r.label)
    : [];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
          {/* Points Display */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-3xl">⭐</span>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
              Your Points
            </h1>
            <div className="mt-4">
              <span className="text-6xl font-bold text-white">
                {data.currentUserPoints}
              </span>
              <p className="text-slate-400 text-sm mt-2">points available</p>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="border-t border-white/10 pt-6">
            <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <span>🎁</span>
              Rewards from {data.partnerNickname}
            </h2>

            {rewards.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">
                {data.partnerNickname} hasn&apos;t set any rewards yet.
              </p>
            ) : (
              <div className="space-y-3">
                {rewards.map((reward) => {
                  const canAfford = data.currentUserPoints >= reward.cost;
                  const isRedeeming = redeeming === reward.key;

                  return (
                    <div
                      key={reward.key}
                      className={`p-4 rounded-xl border transition-all ${
                        canAfford
                          ? "bg-white/5 border-white/10 hover:bg-white/10"
                          : "bg-white/2 border-white/5 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">
                            {reward.label}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-amber-400 font-bold text-sm">
                              {reward.cost} pts
                            </span>
                            {!canAfford && (
                              <span className="text-xs text-slate-500">
                                (need {reward.cost - data.currentUserPoints}{" "}
                                more)
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRedeem(reward.key, reward.label)}
                          disabled={!canAfford || isRedeeming}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            canAfford
                              ? "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/25"
                              : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                          } disabled:opacity-50`}
                        >
                          {isRedeeming ? "..." : "Redeem"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-5 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <p className="text-emerald-400 text-sm text-center">{success}</p>
            </div>
          )}
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Earn points by completing goals • Spend on rewards
        </p>
      </div>
    </div>
  );
}
