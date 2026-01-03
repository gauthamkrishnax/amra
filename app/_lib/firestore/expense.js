"use server";

import { requireAuth } from "@/app/_lib/auth/server";
import { adminDb } from "@/app/_lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function getCoupleNicknames() {
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

  const currentUserDetails = coupleData.userDetails[currentUser.uid];
  const partnerDetails = coupleData.userDetails[partnerUid];

  return {
    currentUser: {
      id: currentUser.uid,
      nickname: currentUserDetails?.nickname || "You",
    },
    partner: {
      id: partnerUid,
      nickname: partnerDetails?.nickname || "Partner",
    },
  };
}

export async function addExpense(formData) {
  const currentUser = await requireAuth();

  const category = formData.get("category");
  const title = formData.get("title");
  const amount = parseFloat(formData.get("amount"));
  const paidBy = formData.get("paidBy");

  if (!category || !title || !amount || !paidBy) {
    throw new Error("All fields are required");
  }

  if (isNaN(amount) || amount <= 0) {
    throw new Error("Please enter a valid amount");
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

  const expense = {
    id: Date.now().toString(),
    category,
    title,
    amount,
    paidBy,
    createdAt: new Date().toISOString(),
    createdBy: currentUser.uid,
  };

  await adminDb
    .collection("couples")
    .doc(coupleDoc.id)
    .update({
      expenses: FieldValue.arrayUnion(expense),
    });

  return { success: true, expense };
}

export async function getExpensesData() {
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

  // Sort by date, newest first
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return {
    currentUser: {
      id: currentUser.uid,
      nickname: currentUserDetails?.nickname || "You",
    },
    partner: {
      id: partnerUid,
      nickname: partnerDetails?.nickname || "Partner",
    },
    expenses: sortedExpenses,
  };
}

export async function deleteExpense(expenseId) {
  const currentUser = await requireAuth();

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
  const expenses = coupleData.expenses || [];

  // Find the expense to remove
  const expenseToRemove = expenses.find((e) => e.id === expenseId);

  if (!expenseToRemove) {
    throw new Error("Expense not found");
  }

  await adminDb
    .collection("couples")
    .doc(coupleDoc.id)
    .update({
      expenses: FieldValue.arrayRemove(expenseToRemove),
    });

  return { success: true };
}
