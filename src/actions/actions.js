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
  const couple = await readCoupleData();
  const uid = couple.currentUser.uid;

  const userData = couple.userData || {};

  userData[uid] = {
    ...userData[uid],
    goals: goals,
  };

  await writeCoupleData({ userData });

  revalidatePath("/goalTracker");
}

export async function addPartnerRewards(rewards) {
  const couple = await readCoupleData();
  const uid = couple.currentUser.uid;

  const userData = couple.userData || {};

  userData[uid] = {
    ...userData[uid],
    rewards: rewards,
  };

  await writeCoupleData({ userData });

  revalidatePath("/partnerRewards");
}
export async function addPartnerPoints(points, partnerUid) {
  const couple = await readCoupleData();

  const userData = couple.userData || {};

  userData[partnerUid] = {
    ...userData[partnerUid],
    points: points,
  };

  await writeCoupleData({ userData });

  revalidatePath("/goalQuestionare");
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

export async function getPartnerInfo() {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    throw new Error("User must be authenticated");
  }

  const db = getFirestore(firebaseServerApp);
  const couplesRef = collection(db, "couples");
  const q = query(
    couplesRef,
    where("users", "array-contains", currentUser.uid),
  );
  const coupleSnap = await getDocs(q);

  if (coupleSnap.empty) {
    return null;
  }

  const coupleData = coupleSnap.docs[0].data();
  const partnerUid = coupleData.users.find((uid) => uid !== currentUser.uid);

  if (!partnerUid) {
    return null;
  }
  const partnerRef = doc(db, "users", partnerUid);
  const partnerSnap = await getDoc(partnerRef);

  if (!partnerSnap.exists()) {
    return null;
  }

  const partnerData = partnerSnap.data();

  const partnerGoals = coupleData.userData?.[partnerUid]?.goals || null;

  return {
    partnerUid,
    nickname: partnerData.nickname || null,
    goals: partnerGoals,
  };
}
