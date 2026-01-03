"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createCouple, checkCouple } from "@/app/_lib/firestore/couple";
import { getUserConnectionCode } from "@/app/_lib/firestore/user";
import SubmitButton from "@/app/_components/SubmitButton";

export default function ConnectPage({ searchParams }) {
  const router = useRouter();
  const [code, setCode] = useState("");

  // Poll for couple status every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const hasCouple = await checkCouple();
      if (hasCouple) {
        router.push("/");
      }
    }, 3000);

    // Check immediately on mount
    checkCouple().then((hasCouple) => {
      if (hasCouple) {
        router.push("/");
      }
    });

    return () => clearInterval(interval);
  }, [router]);

  // Get code from URL params or user doc
  useEffect(() => {
    async function fetchCode() {
      const params = await searchParams;
      if (params.code) {
        setCode(params.code);
      } else {
        const userCode = await getUserConnectionCode();
        if (userCode) setCode(userCode);
      }
    }
    fetchCode();
  }, [searchParams]);

  async function handleSubmit(formData) {
    const partnerCode = formData.get("code");
    await createCouple(partnerCode);
  }

  return (
    <div>
      <h1>ConnectPage {code}</h1>
      <form action={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your partner's code"
          name="code"
        />
        <SubmitButton>Connect</SubmitButton>
      </form>
    </div>
  );
}
