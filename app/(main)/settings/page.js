import Link from "next/link";
import SignOutButton from "@/app/_components/ui/SignOutButton";
import LinkButton from "@/app/_components/ui/LinkButton";
import Divider from "@/app/_components/ui/Divider";

const MENU_ITEMS = [
  {
    href: "/setGoals?from=settings",
    label: "Set Goals",
    color: "blue",
  },
  {
    href: "/setRewards?from=settings",
    label: "Set Rewards",
    color: "green",
  },
  {
    href: "/nickname",
    label: "Change Nickname",
    color: "purple",
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen ">
      <div className="my-2 mx-10">
        <LinkButton href="/" color="yellow" shape="shape2">
          <h1 className="text-2xl font-bold ">Settings</h1>
        </LinkButton>
      </div>

      <Divider />

      <div className=" my-10 mx-10">
        <div className="flex flex-col gap-10 mb-30">
          {MENU_ITEMS.map((item) => (
            <LinkButton
              key={item.href}
              href={item.href}
              color={item.color}
              shape="shape4"
            >
              <h1 className="text-2xl font-bold ">{item.label}</h1>
            </LinkButton>
          ))}
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}
