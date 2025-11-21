import { LogIn } from "lucide-react";

import signIn from "@/content/signIn";

import Button from "../ui/components/button";
import { LogoSmall } from "../ui/components/logo";

export default function Page() {
  return (
    <div className="flex h-screen flex-col p-10">
      <LogoSmall className=""></LogoSmall>
      <div className="flex grow flex-col justify-between">
        {" "}
        <h1 className="max-w-3xs pt-10 text-4xl font-bold">
          {signIn.description}
        </h1>
        <Button className="mb-40 ml-8 font-bold">
          {signIn.button}
          <LogIn></LogIn>
        </Button>
      </div>
    </div>
  );
}
