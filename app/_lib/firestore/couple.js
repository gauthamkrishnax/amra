"use server";

import { requireAuth } from "@/app/_lib/auth/server";
import { adminDb } from "@/app/_lib/firebase/admin";
import { redirect } from "next/navigation";

export async function checkCouple() {
  const currentUser = await requireAuth();
  const couplesSnapshot = await adminDb
    .collection("couples")
    .where("users", "array-contains", currentUser.uid)
    .limit(1)
    .get();
  return !couplesSnapshot.empty;
}

export async function createCouple(connectionString) {
  if (!connectionString) {
    throw new Error("Connection string is required");
  }

  const currentUser = await requireAuth();

  // Find partner by connectionString
  const partnerSnapshot = await adminDb
    .collection("users")
    .where("connectionString", "==", connectionString)
    .limit(1)
    .get();

  if (partnerSnapshot.empty) {
    throw new Error("Invalid connection code. Partner not found.");
  }

  const partnerDoc = partnerSnapshot.docs[0];
  const partnerData = partnerDoc.data();
  const partnerId = partnerDoc.id;

  // Prevent connecting to yourself
  if (partnerId === currentUser.uid) {
    throw new Error("You cannot connect with yourself.");
  }

  // Get current user's data
  const currentUserDoc = await adminDb
    .collection("users")
    .doc(currentUser.uid)
    .get();
  if (!currentUserDoc.exists) {
    throw new Error("Current user profile not found.");
  }
  const currentUserData = currentUserDoc.data();

  // Create couple document
  const coupleRef = await adminDb.collection("couples").add({
    users: [currentUser.uid, partnerId],
    userDetails: {
      [currentUser.uid]: {
        nickname: currentUserData.nickname,
      },
      [partnerId]: {
        nickname: partnerData.nickname,
      },
    },
    createdAt: new Date(),
  });

  // Update both users with coupleId
  const batch = adminDb.batch();
  batch.update(adminDb.collection("users").doc(currentUser.uid), {
    coupleId: coupleRef.id,
  });
  batch.update(adminDb.collection("users").doc(partnerId), {
    coupleId: coupleRef.id,
  });
  await batch.commit();

  redirect("/setGoals");
}
