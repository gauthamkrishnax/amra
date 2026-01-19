"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import HomeIcon from "@/app/_icons/home";
import SettingsIcon from "@/app/_icons/settings";

export default function NavIcon() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <Link href="/settings">
        <SettingsIcon />
      </Link>
    );
  }

  return (
    <Link href="/">
      <HomeIcon />
    </Link>
  );
}
