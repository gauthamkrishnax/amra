"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/clientApp";
import { RandomConnectionString } from "@/lib/utils/string-utils";

/**
 * Creates a new user document in Firestore
 * @param {Object} user - Firebase Auth user object
 * @param {string} nickname - User's chosen nickname
 * @throws {Error} If user creation fails
 */
export async function createUser(user, nickname) {
  if (!user?.uid) {
    throw new Error("Invalid user object");
  }

  if (!nickname?.trim()) {
    throw new Error("Nickname is required");
  }

  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    name: user.displayName || "",
    email: user.email || "",
    nickname: nickname.trim(),
    createdAt: serverTimestamp(),
    code: RandomConnectionString(),
  });
}

/**
 * Retrieves a user document from Firestore
 * @param {string} uid - User ID
 * @returns {Object|null} User data or null if not found
 */
export async function getUser(uid) {
  if (!uid) {
    throw new Error("User ID is required");
  }

  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null;
  }

  return userDoc.data();
}

/**
 * Finds a user by their unique connection code
 * @param {string} code - Connection code (case-insensitive)
 * @returns {Object|null} User object with uid, or null if not found
 */
export async function findUserByCode(code) {
  if (!code?.trim()) {
    throw new Error("Connection code is required");
  }

  const normalizedCode = code.trim().toUpperCase();
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("code", "==", normalizedCode));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const userDoc = querySnapshot.docs[0];
  return { uid: userDoc.id, ...userDoc.data() };
}

/**
 * Creates a connection between two users in the couples collection
 * Uses a deterministic document ID to ensure only one connection exists per pair
 * @param {string} user1Id - First user's UID
 * @param {string} user2Id - Second user's UID
 * @returns {string} The couple document ID
 * @throws {Error} If validation fails or creation fails
 */
export async function createCouple(user1Id, user2Id) {
  if (!user1Id || !user2Id) {
    throw new Error("Both user IDs are required");
  }

  if (user1Id === user2Id) {
    throw new Error("Cannot create couple with the same user");
  }

  // Create deterministic ID by sorting user IDs
  const sortedIds = [user1Id, user2Id].sort();
  const coupleId = `${sortedIds[0]}_${sortedIds[1]}`;

  const coupleRef = doc(db, "couples", coupleId);
  const coupleData = {
    users: [user1Id, user2Id],
    createdAt: serverTimestamp(),
  };

  // Note: We don't check if couple exists first because:
  // 1. Checking requires read permission which fails for non-existent docs
  // 2. Deterministic ID ensures same couple always has same ID
  // 3. Overwriting with same data is idempotent
  await setDoc(coupleRef, coupleData);

  return coupleId;
}
