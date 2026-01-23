"use client";

import { useState, useEffect } from "react";
import {
  getRewardsPageData,
  redeemReward,
} from "@/app/_lib/firestore/goalsAndRewards";
import LinkButton from "@/app/_components/ui/LinkButton";
import Divider from "@/app/_components/ui/Divider";
import RewardsIllustration from "@/app/_illustrations/rewards";
import Button from "@/app/_components/ui/Button";
import Modal from "@/app/_components/ui/Modal";

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
  const [confirmReward, setConfirmReward] = useState(null);

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

  function openConfirmModal(reward) {
    setConfirmReward(reward);
  }

  function closeConfirmModal() {
    setConfirmReward(null);
  }

  async function handleRedeem() {
    if (!confirmReward) return;

    const { key: rewardKey, label: rewardName } = confirmReward;
    setConfirmReward(null);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-violet-400">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-6">
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
    <div className="min-h-screen">
      <div className="my-2 mx-10">
        <LinkButton href="/" color="yellow" shape="shape2">
          <h1 className="text-2xl font-bold ">Rewards</h1>
        </LinkButton>
      </div>

      <div className="flex justify-between mb-2 text-primary">
        <div className="ml-10 mt-10 pr-10 h-fit p-5 max-w-fit bg-mypink rotate-5">
          <p>you have:</p>
          <p className="text-2xl font-bold">{data.currentUserPoints} Points</p>
        </div>
        <RewardsIllustration />
      </div>

      <Divider />

      {/* Rewards Section */}
      <div className="py-6">
        {rewards.length === 0 ? (
          <p className="text-primary text-sm text-center py-4">
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
                      : "bg-white/2 border-white/5 opacity-70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xl font-bold text-primary">
                        {reward.label}
                      </p>
                      <div className="gap-2 mt-2">
                        Redeem for -
                        <span className="text-amber-400 font-bold text-sm">
                          {reward.cost} pts
                        </span>
                        {!canAfford && (
                          <div className="text-xs text-slate-500">
                            (need {reward.cost - data.currentUserPoints} more)
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      action={() => openConfirmModal(reward)}
                      disabled={!canAfford || isRedeeming}
                      color={
                        canAfford
                          ? ["yellow", "purple", "green", "blue", "pink"][
                              Math.floor(Math.random() * 5)
                            ]
                          : "gray"
                      }
                      shape="shape2"
                      noForm={true}
                      className="text-sm font-bold"
                    >
                      {isRedeeming ? "..." : "Redeem"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Divider />
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

      <Modal
        isOpen={!!confirmReward}
        onClose={closeConfirmModal}
        onConfirm={handleRedeem}
        title="Confirm Redemption"
        confirmText="Yes, Redeem"
        cancelText="Cancel"
      >
        {confirmReward && (
          <div className="text-center">
            <p className="text-gray-700 mb-2">
              Are you sure you want to redeem
            </p>
            <p className="font-bold text-lg text-gray-900 mb-2">
              &quot;{confirmReward.label}&quot;
            </p>
            <p className="text-gray-600">
              for{" "}
              <span className="font-bold text-amber-600">
                {confirmReward.cost} points
              </span>
              ?
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
