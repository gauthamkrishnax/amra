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
