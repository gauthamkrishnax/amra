"use server";

import { getFirestore } from "firebase/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { revalidatePath } from "next/cache";

import {
  readCoupleData,
  writeCoupleData,
} from "@/lib/firebase/firestore-server";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";

export async function addGoals(goals) {
  const { currentUser } = await getAuthenticatedAppForUser();
  const uid = currentUser.uid;

  const couple = await readCoupleData();

  const userData = couple.userData || {};

  userData[uid] = {
    ...userData[uid],
    goals: goals,
  };

  await writeCoupleData({ userData });

  revalidatePath("/goalTracker");
}

export async function getUserNickName() {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    throw new Error("User must be authenticated");
  }

  const db = getFirestore(firebaseServerApp);
  const userRef = doc(db, "users", currentUser.uid);

  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  const data = userSnap.data();
  return data.nickname || null;
}
