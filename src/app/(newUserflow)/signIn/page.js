import { redirect } from "next/navigation";

import content from "@/content/signIn";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import SignIn from "@/ui/components/authButton";

export default async function Page() {
  const { currentUser } = await getAuthenticatedAppForUser();

  // If user is already authenticated, redirect to home page
  if (currentUser) {
    redirect("/");
  }

  // Serialize user object to pass to client component
  const serializedUser = currentUser
    ? {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
      }
    : null;

  return (
    <div className="flex grow flex-col justify-between">
      {" "}
      <h1 className="max-w-3xs pt-10 text-4xl font-bold">
        {content.description}
      </h1>
      <SignIn initialUser={serializedUser}></SignIn>
    </div>
  );
}
