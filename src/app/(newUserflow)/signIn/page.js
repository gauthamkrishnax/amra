import { redirect } from "next/navigation";

import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import SignIn from "@/ui/components/authButton";

export default async function SignInPage() {
  const { currentUser } = await getAuthenticatedAppForUser();
  if (currentUser) {
    redirect("/connect");
  }
  return <SignIn initialUser={currentUser?.toJSON()} />;
}
