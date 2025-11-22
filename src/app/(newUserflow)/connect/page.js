import content from "@/content/signIn";
import { getUser } from "@/lib/firebase/firestore";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { RandomConnectionString } from "@/lib/utils/string-utils";
import Button from "@/ui/components/button";
import Textbox from "@/ui/components/textbox";

export default async function Connect() {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const user = await getUser(firebaseServerApp, currentUser.uid);
  return (
    <>
      <h1 className="mb-10 max-w-3xs pt-10 text-4xl font-bold">
        {content.connectDescription}
      </h1>
      <div className="bg-secondary -mx-10 mb-5 px-10 py-5">
        <h2 className="mb-2 text-xl font-semibold">Your Love code:</h2>
        <span className="text-4xl font-bold text-black">{user.code}</span>
      </div>
      <Textbox variant="filled" label="Enter your partner's love code:" />
      <Button>Connect</Button>
    </>
  );
}
