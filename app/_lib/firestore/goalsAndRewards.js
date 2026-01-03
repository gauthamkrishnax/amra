"use server";

import { requireAuth } from "@/app/_lib/auth/server";
import { adminDb } from "@/app/_lib/firebase/admin";
import { redirect } from "next/navigation";

export async function saveGoals(formData) {
  const currentUser = await requireAuth();

  const goals = {
    goal1: formData.get("goal1"),
    goal2: formData.get("goal2"),
    goal3: formData.get("goal3"),
  };

  // Find the couple document for current user
  const couplesSnapshot = await adminDb
    .collection("couples")
    .where("users", "array-contains", currentUser.uid)
    .limit(1)
    .get();

  if (couplesSnapshot.empty) {
    throw new Error(
      "Couple not found. Please connect with your partner first.",
    );
  }

  const coupleDoc = couplesSnapshot.docs[0];

  // Update the userDetails for current user with goals
  await adminDb
    .collection("couples")
    .doc(coupleDoc.id)
    .update({
      [`userDetails.${currentUser.uid}.goals`]: goals,
    });

  redirect("/setRewards");
}

export async function saveRewards(formData) {
  const currentUser = await requireAuth();

  const rewards = {
    reward1: formData.get("reward1"),
    reward2: formData.get("reward2"),
    reward3: formData.get("reward3"),
  };

  // Find the couple document for current user
  const couplesSnapshot = await adminDb
    .collection("couples")
    .where("users", "array-contains", currentUser.uid)
    .limit(1)
    .get();

  if (couplesSnapshot.empty) {
    throw new Error(
      "Couple not found. Please connect with your partner first.",
    );
  }

  const coupleDoc = couplesSnapshot.docs[0];

  // Update the userDetails for current user with rewards
  await adminDb
    .collection("couples")
    .doc(coupleDoc.id)
    .update({
      [`userDetails.${currentUser.uid}.rewards`]: rewards,
    });

  redirect("/");
}

export async function getGoalsAndRewards() {
  const currentUser = await requireAuth();

  const couplesSnapshot = await adminDb
    .collection("couples")
    .where("users", "array-contains", currentUser.uid)
    .limit(1)
    .get();

  if (couplesSnapshot.empty) {
    return null;
  }

  const coupleData = couplesSnapshot.docs[0].data();
  return coupleData.userDetails[currentUser.uid] || null;
}

export async function getPartnerGoals() {
  const currentUser = await requireAuth();

  const couplesSnapshot = await adminDb
    .collection("couples")
    .where("users", "array-contains", currentUser.uid)
    .limit(1)
    .get();

  if (couplesSnapshot.empty) {
    return null;
  }

  const coupleDoc = couplesSnapshot.docs[0];
  const coupleData = coupleDoc.data();

  // Find partner's UID (the one that isn't current user)
  const partnerUid = coupleData.users.find((uid) => uid !== currentUser.uid);

  if (!partnerUid) {
    return null;
  }

  const partnerDetails = coupleData.userDetails[partnerUid];

  return {
    partnerId: partnerUid,
    nickname: partnerDetails?.nickname || "Partner",
    goals: partnerDetails?.goals || null,
  };
}

export async function addPointsToPartner(formData) {
  const currentUser = await requireAuth();

  const checkedGoals = formData.getAll("goals");
  const pointsToAdd = checkedGoals.length;

  if (pointsToAdd === 0) {
    throw new Error("Please check at least one goal");
  }

  const couplesSnapshot = await adminDb
    .collection("couples")
    .where("users", "array-contains", currentUser.uid)
    .limit(1)
    .get();

  if (couplesSnapshot.empty) {
    throw new Error("Couple not found");
  }

  const coupleDoc = couplesSnapshot.docs[0];
  const coupleData = coupleDoc.data();

  // Find partner's UID
  const partnerUid = coupleData.users.find((uid) => uid !== currentUser.uid);

  if (!partnerUid) {
    throw new Error("Partner not found");
  }

  // Get current points
  const currentPoints = coupleData.userDetails[partnerUid]?.points || 0;

  // Update partner's points
  await adminDb
    .collection("couples")
    .doc(coupleDoc.id)
    .update({
      [`userDetails.${partnerUid}.points`]: currentPoints + pointsToAdd,
    });

  return { pointsAdded: pointsToAdd, newTotal: currentPoints + pointsToAdd };
}

export async function getRewardsPageData() {
  const currentUser = await requireAuth();

  const couplesSnapshot = await adminDb
    .collection("couples")
    .where("users", "array-contains", currentUser.uid)
    .limit(1)
    .get();

  if (couplesSnapshot.empty) {
    return null;
  }

  const coupleData = couplesSnapshot.docs[0].data();

  // Find partner's UID
  const partnerUid = coupleData.users.find((uid) => uid !== currentUser.uid);

  if (!partnerUid) {
    return null;
  }

  const currentUserDetails = coupleData.userDetails[currentUser.uid];
  const partnerDetails = coupleData.userDetails[partnerUid];

  return {
    currentUserPoints: currentUserDetails?.points || 0,
    currentUserNickname: currentUserDetails?.nickname || "You",
    partnerNickname: partnerDetails?.nickname || "Partner",
    partnerRewards: partnerDetails?.rewards || null,
  };
}

export async function redeemReward(rewardKey) {
  const currentUser = await requireAuth();

  // Define costs
  const costs = {
    reward1: 20,
    reward2: 50,
    reward3: 100,
  };

  const cost = costs[rewardKey];
  if (!cost) {
    throw new Error("Invalid reward");
  }

  const couplesSnapshot = await adminDb
    .collection("couples")
    .where("users", "array-contains", currentUser.uid)
    .limit(1)
    .get();

  if (couplesSnapshot.empty) {
    throw new Error("Couple not found");
  }

  const coupleDoc = couplesSnapshot.docs[0];
  const coupleData = coupleDoc.data();

  const currentPoints = coupleData.userDetails[currentUser.uid]?.points || 0;

  if (currentPoints < cost) {
    throw new Error(
      `Not enough points. You need ${cost} points but only have ${currentPoints}.`,
    );
  }

  // Deduct points
  const newPoints = currentPoints - cost;

  await adminDb
    .collection("couples")
    .doc(coupleDoc.id)
    .update({
      [`userDetails.${currentUser.uid}.points`]: newPoints,
    });

  return { cost, newTotal: newPoints };
}
