import { redirect } from "next/navigation";

import content from "@/content/signIn";
import {
  createCouple,
  findUserByCode,
  getUser,
} from "@/lib/firebase/firestore";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import Button from "@/ui/components/button";
import Textbox from "@/ui/components/textbox";

export default async function Connect() {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const user = await getUser(firebaseServerApp, currentUser.uid);

  async function handleConnect(formData) {
    "use server";

    const partnerCode = formData.get("partnerCode");

    console.log(partnerCode);

    if (!partnerCode || partnerCode.trim() === "") {
      console.log("No code entered");
      return { error: "Please enter a code" };
    }

    const { firebaseServerApp, currentUser } =
      await getAuthenticatedAppForUser();

    // Find the partner by their code
    const partner = await findUserByCode(
      firebaseServerApp,
      partnerCode.trim().toUpperCase(),
    );

    if (!partner) {
      console.log("Invalid code");
      return { error: "Invalid code. Please check and try again." };
    }

    // Check if trying to connect with themselves
    if (partner.uid === currentUser.uid) {
      console.log("You cannot connect with yourself!");
      return { error: "You cannot connect with yourself!" };
    }

    try {
      // Create the couple connection
      await createCouple(firebaseServerApp, currentUser.uid, partner.uid);

      // Redirect to success page or home
      redirect("/"); // Update this to your desired destination
    } catch (error) {
      if (error.message === "Connection already exists") {
        console.log("You are already connected with this person!");
        return { error: "You are already connected with this person!" };
      }
      console.log("Failed to create connection. Please try again.");
      return { error: "Failed to create connection. Please try again." };
    }
  }

  return (
    <>
      <h1 className="mb-10 max-w-3xs pt-10 text-4xl font-bold">
        {content.connectDescription}
      </h1>
      <div className="bg-secondary -mx-10 mb-5 px-10 py-5">
        <h2 className="mb-2 text-xl font-semibold">Your Love code:</h2>
        <span className="text-4xl font-bold text-black">{user.code}</span>
      </div>
      <form action={handleConnect}>
        <Textbox
          variant="filled"
          label="Enter your partner's love code:"
          name="partnerCode"
          required
          maxLength={7}
          style={{ textTransform: "uppercase" }}
        />
        <Button type="submit">Connect</Button>
      </form>
    </>
  );
}
