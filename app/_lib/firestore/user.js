"use server";

import { adminDb } from "@/app/_lib/firebase/admin";
import { RandomConnectionString } from "@/app/_lib/utils/string";
import { requireAuth, getCurrentUser } from "@/app/_lib/auth/server";
import { redirect } from "next/navigation";

export async function getPostSignInRedirect() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return "/signin";
  }

  const userDoc = await adminDb.collection("users").doc(currentUser.uid).get();
  const userData = userDoc.data();

  // No nickname → go to nickname page
  if (!userData?.nickname) {
    return "/nickname";
  }

  // No coupleId → go to connect page
  if (!userData?.coupleId) {
    return "/connect";
  }

  // All set → go to home
  return "/";
}

export async function getUserConnectionCode() {
  const currentUser = await requireAuth();
  const userDoc = await adminDb.collection("users").doc(currentUser.uid).get();
  return userDoc.data()?.connectionString || null;
}

export async function createUser(nickname) {
  if (!nickname) {
    throw new Error("Nickname is required");
  }

  const currentUser = await requireAuth();
  const connectionString = RandomConnectionString();

  await adminDb.collection("users").doc(currentUser.uid).set({
    nickname,
    connectionString,
    createdAt: new Date(),
  });

  redirect(`/connect?code=${connectionString}`);
}

export async function getCurrentNickname() {
  const currentUser = await requireAuth();
  const userDoc = await adminDb.collection("users").doc(currentUser.uid).get();
  return userDoc.data()?.nickname || null;
}

export async function updateNickname(newNickname) {
  if (!newNickname || newNickname.trim().length === 0) {
    throw new Error("Nickname is required");
  }

  const currentUser = await requireAuth();
  const nickname = newNickname.trim();

  // Update in users collection
  await adminDb.collection("users").doc(currentUser.uid).update({
    nickname,
  });

  // Update in couples collection
  const couplesSnapshot = await adminDb
    .collection("couples")
    .where("users", "array-contains", currentUser.uid)
    .limit(1)
    .get();

  if (!couplesSnapshot.empty) {
    const coupleDoc = couplesSnapshot.docs[0];
    await adminDb
      .collection("couples")
      .doc(coupleDoc.id)
      .update({
        [`userDetails.${currentUser.uid}.nickname`]: nickname,
      });
  }

  return { success: true, nickname };
}
