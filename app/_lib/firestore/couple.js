"use server";

import { requireAuth } from "@/app/_lib/auth/server";
import { adminDb } from "@/app/_lib/firebase/admin";
import { redirect } from "next/navigation";

export async function getCoupleDetails() {
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
  const partnerUid = coupleData.users.find((uid) => uid !== currentUser.uid);

  const currentUserDetails = coupleData.userDetails[currentUser.uid];
  const partnerDetails = coupleData.userDetails[partnerUid];

  const expenses = coupleData.expenses || [];

  // Calculate monthly total (current month)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.createdAt);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  const monthlyTotal = monthlyExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  // Calculate who owes whom (based on monthly expenses, split 50/50)
  const currentUserPaid = monthlyExpenses
    .filter((e) => e.paidBy === currentUser.uid)
    .reduce((sum, e) => sum + e.amount, 0);

  const partnerPaid = monthlyExpenses
    .filter((e) => e.paidBy === partnerUid)
    .reduce((sum, e) => sum + e.amount, 0);

  const fairShare = monthlyTotal / 2;
  const currentUserOwes = Math.max(0, fairShare - currentUserPaid);
  const partnerOwes = Math.max(0, fairShare - partnerPaid);

  // Net balance (positive means partner owes user, negative means user owes partner)
  const netBalance = partnerOwes - currentUserOwes;

  // Sort expenses by date, newest first
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return {
    userId: currentUser.uid,
    partnerId: partnerUid,
    userNickname: currentUserDetails?.nickname || "You",
    partnerNickname: partnerDetails?.nickname || "Partner",
    userPoints: currentUserDetails?.points || 0,
    partnerPoints: partnerDetails?.points || 0,
    currentUserOwes,
    partnerOwes,
    netBalance,
    monthlyTotal,
    expenses: sortedExpenses,
  };
}

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
