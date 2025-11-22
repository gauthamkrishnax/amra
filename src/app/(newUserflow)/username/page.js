import { createUser } from "@/lib/firebase/firestore";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import Button from "@/ui/components/button";
import Textbox from "@/ui/components/textbox";

export default async function Username() {
  const { currentUser } = await getAuthenticatedAppForUser();

  return (
    <div>
      <h1 className="mb-10 max-w-3xs pt-10 text-4xl font-bold">
        What should your partner call you?
      </h1>
      <Textbox label="Enter your nickname:" />
    </div>
  );
}
