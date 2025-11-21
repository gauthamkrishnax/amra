import { redirect } from "next/navigation";

import content from "@/content/signIn";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import SignIn from "@/ui/components/authButton";
import { LogoSmall } from "@/ui/components/logo";

export default async function Page() {
  const { currentUser } = await getAuthenticatedAppForUser();
  if (currentUser) {
    redirect("/connect");
  }
  return (
    <div className="flex h-screen flex-col p-10">
      <LogoSmall className=""></LogoSmall>
      <div className="flex grow flex-col justify-between">
        {" "}
        <h1 className="max-w-3xs pt-10 text-4xl font-bold">
          {content.description}
        </h1>
        <SignIn initialUser={currentUser}></SignIn>
      </div>
    </div>
  );
}
