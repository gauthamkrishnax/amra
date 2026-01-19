"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createCouple, checkCouple } from "@/app/_lib/firestore/couple";
import { getUserConnectionCode } from "@/app/_lib/firestore/user";
import SubmitButton from "@/app/_components/SubmitButton";
import Logo from "@/app/_components/ui/Logo";
import TextInput from "@/app/_components/ui/TextInput";
import ConnectIllustration from "@/app/_illustrations/connect";

export default function ConnectPage({ searchParams }) {
  const router = useRouter();
  const [code, setCode] = useState("");

  // Poll for couple status every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const hasCouple = await checkCouple();
      if (hasCouple) {
        router.push("/setGoals");
      }
    }, 3000);

    // Check immediately on mount
    checkCouple().then((hasCouple) => {
      if (hasCouple) {
        router.push("/setGoals");
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
    console.log("Partner code submitted:", partnerCode);
    await createCouple(partnerCode);
  }

  return (
    <div className="pb-30 flex flex-col justify-between min-h-dvh">
      <div>
        <Logo className="px-10 pt-10" />

        <p className="px-10 my-5 text-3xl max-w-3/4">
          Connect with your Partner
        </p>
      </div>
      <div>
        <ConnectIllustration className="w-full/2 h-auto" />
      </div>
      <div className="px-10 pt-5 flex flex-col justify-left bg-myyellow h-25 rounded-md mt-8">
        <p>Your Love code :</p>
        <h1 className="text-black font-bold text-2xl">{code}</h1>
      </div>
      <form action={handleSubmit}>
        <div className="flex flex-col mt-8 px-10">
          {" "}
          <TextInput
            id="code"
            label="Enter your partner's code"
            type="text"
            placeholder="Partner code"
            name="code"
          />
        </div>
        <div className="px-10 mt-4">
          <SubmitButton>Connect</SubmitButton>
        </div>
      </form>
      <div className="mt-8"></div>
    </div>
  );
}
