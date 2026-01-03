"use server";

import { adminDb } from "@/app/_lib/firebase/admin";
import { RandomConnectionString } from "@/app/_lib/utils/string";
import { requireAuth } from "@/app/_lib/auth/server";
import { redirect } from "next/navigation";

export async function getUserConnectionCode() {
  const currentUser = await requireAuth();
  const userDoc = await adminDb.collection("users").doc(currentUser.uid).get();
  return userDoc.data()?.connectionString || null;
}

export async function createUser(nickname) {
  if (!nickname) {
    throw new Error("Nickname is required");
  }

  const currentUser = await requireAuth();
  const connectionString = RandomConnectionString();

  await adminDb.collection("users").doc(currentUser.uid).set({
    nickname,
    connectionString,
    createdAt: new Date(),
  });

  redirect(`/connect?code=${connectionString}`);
}
