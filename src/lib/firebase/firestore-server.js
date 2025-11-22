"use server";

import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

import { cacheTag, revalidateTag } from "next/cache";

import { getAuthenticatedAppForUser } from "./serverApp";

/**
 * Reads the current user's couple document from Firestore
 * @returns {Promise<Object|null>} Couple data or null if not found
 */
export async function readCoupleData() {
  "use cache";
  cacheTag("couple-data");

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
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const coupleDoc = querySnapshot.docs[0];
  return { id: coupleDoc.id, ...coupleDoc.data() };
}

/**
 * Writes/creates data to the current user's couple document in Firestore
 * @param {Object} data - Data to write to the document
 */
export async function writeCoupleData(data) {
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
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("User is not part of a couple");
  }

  const coupleId = querySnapshot.docs[0].id;
  const coupleRef = doc(db, "couples", coupleId);

  await setDoc(
    coupleRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  // Revalidate the cached couple data
  revalidateTag("couple-data");
}
