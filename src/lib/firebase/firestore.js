import { doc, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase/clientApp";

export async function createUser(user) {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, { name: user.displayName, email: user.email });
}
