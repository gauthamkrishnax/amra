import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase/clientApp";
import { RandomConnectionString } from "@/lib/utils/string-utils";

/**
 * Creates a new user in the database
 * @param {Object} user - The user object
 * @param {string} nickname - The nickname of the user
 * @param {string} code - The code of the user
 */
export async function createUser(user, nickname, code) {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    name: user.displayName,
    email: user.email,
    nickname,
    createdAt: serverTimestamp(),
    code: RandomConnectionString(),
  });
}
