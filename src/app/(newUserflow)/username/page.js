import { redirect } from "next/navigation";

import { createUser } from "@/lib/firebase/firestore";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import Button from "@/ui/components/button";
import Textbox from "@/ui/components/textbox";

export default async function Username() {
  const { currentUser } = await getAuthenticatedAppForUser();

  async function handleSubmit(formData) {
    "use server";

    const nickname = formData.get("nickname");

    if (!nickname || nickname.trim() === "") {
      return;
    }

    // Fetch the current user inside the Server Action
    const { firebaseServerApp, currentUser: user } =
      await getAuthenticatedAppForUser();
    await createUser(firebaseServerApp, user, nickname.trim());

    // Redirect to the next page after successful creation
    redirect("/connect");
  }

  return (
    <div>
      <h1 className="mb-10 max-w-3xs pt-10 text-4xl font-bold">
        What should your partner call you?
      </h1>
      <form action={handleSubmit}>
        <Textbox label="Enter your nickname:" name="nickname" required />
        <Button type="submit">Continue</Button>
      </form>
    </div>
  );
}
