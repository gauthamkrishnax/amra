import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
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

/**
 * Finds a user by their connection code
 * @param {Object} firebaseApp - The Firebase app instance
 * @param {string} code - The connection code
 * @returns {Object|null} The user object with uid, or null if not found
 */
export async function findUserByCode(firebaseApp, code) {
  const db = getFirestore(firebaseApp);
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("code", "==", code));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const userDoc = querySnapshot.docs[0];
  return { uid: userDoc.id, ...userDoc.data() };
}

/**
 * Creates a connection between two users in the couples collection
 * @param {Object} firebaseApp - The Firebase app instance
 * @param {string} user1Id - The UID of the first user
 * @param {string} user2Id - The UID of the second user
 * @returns {string} The couple ID
 */
export async function createCouple(firebaseApp, user1Id, user2Id) {
  const db = getFirestore(firebaseApp);

  // Create a deterministic couple ID by sorting the user IDs
  const sortedIds = [user1Id, user2Id].sort();
  const coupleId = `${sortedIds[0]}_${sortedIds[1]}`;

  const coupleRef = doc(db, "couples", coupleId);

  // Check if couple already exists
  const existingCouple = await getDoc(coupleRef);
  if (existingCouple.exists()) {
    throw new Error("Connection already exists");
  }

  await setDoc(coupleRef, {
    users: [user1Id, user2Id],
    createdAt: serverTimestamp(),
  });

  return coupleId;
}
