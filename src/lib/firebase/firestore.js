import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { RandomConnectionString } from "@/lib/utils/string-utils";

/**
 * Creates a new user in the database
 * @param {Object} firebaseApp - The Firebase app instance
 * @param {Object} user - The user object
 * @param {string} nickname - The nickname of the user
 */
export async function createUser(firebaseApp, user, nickname) {
  const db = getFirestore(firebaseApp);
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    name: user.displayName,
    email: user.email,
    nickname,
    createdAt: serverTimestamp(),
    code: RandomConnectionString(),
  });
}

/**
 * Gets a user from the database
 * @param {Object} firebaseApp - The Firebase app instance
 * @param {string} uid - The UID of the user
 * @returns {Object} The user object
 */
export async function getUser(firebaseApp, uid) {
  const db = getFirestore(firebaseApp);
  const userRef = doc(db, "users", uid);
  const user = await getDoc(userRef);
  return user.data();
}
