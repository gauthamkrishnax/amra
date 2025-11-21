"use client";

import { onAuthStateChanged } from "firebase/auth";

import { useEffect, useState } from "react";

import { auth } from "@/app/lib/firebase/clientApp";

export function useUser() {
  const [user, setUser] = useState();

  useEffect(() => {
    return onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
  }, []);

  return user;
}
