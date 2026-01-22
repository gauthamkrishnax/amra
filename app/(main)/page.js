import Box from "@/app/_components/ui/box";
import Logo from "@/app/_components/ui/Logo";
import { getCoupleDetails } from "@/app/_lib/firestore/couple";

export const metadata = {
  title: "Amra - Love app",
  description:
    "Amra is a love app that helps you and your partner manage your finances together.",
};

export default async function Home() {
  const coupleDetails = await getCoupleDetails();

  return (
    <div>
      <Box title="You have:" content="35 Points" className="pr-20 "></Box>
      <Logo />
    </div>
  );
}
