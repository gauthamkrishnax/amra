import Box from "@/app/_components/ui/box";
import Divider from "@/app/_components/ui/Divider";
import LinkButton from "@/app/_components/ui/LinkButton";
import { getCoupleDetails } from "@/app/_lib/firestore/couple";

export const metadata = {
  title: "Amra - Love app",
  description:
    "Amra is a love app that helps you and your partner manage your finances together.",
};

export default async function Home() {
  const coupleDetails = await getCoupleDetails();

  return (
    <div className="pb-10">
      <h1 className="text-2xl px-10 pb-5 font-bold text-primary">
        Hey {coupleDetails.userNickname}!
      </h1>
      <Divider />
      <div className="relative pb-15">
        <Box
          title="You have:"
          content={`${coupleDetails.userPoints} Points`}
          className="bg-mypink pr-20 rotate-5"
        ></Box>
        <Box
          title="Monthly Spend"
          content={`₹ ${coupleDetails.monthlyTotal}`}
          contentSize="4xl"
          className="bg-mygreen pr-5 absolute right-0 top-10 -rotate-5"
        ></Box>
      </div>
      <Divider />
      <div className="py-10 px-10 flex flex-col gap-10">
        <LinkButton href="/expenses" color="blue" shape="shape4">
          <span className="text-primary font-bold text-2xl min-w-min">
            Expenses
          </span>
        </LinkButton>
        <LinkButton href="/rewards" color="yellow" shape="shape2">
          <span className="text-primary font-bold text-2xl min-w-min">
            Rewards
          </span>
        </LinkButton>
        <LinkButton href="/goalCheck" color="pink" shape="shape1">
          <span className="text-primary font-bold text-2xl min-w-min">
            {`How did ${coupleDetails.partnerNickname} do today?`}
          </span>
        </LinkButton>
      </div>
      <Divider />
    </div>
  );
}
