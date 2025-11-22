import { Heart } from "lucide-react";

import content from "@/content/global";

export function LogoSmall() {
  return (
    <div className="text-1xl flex w-min flex-col items-center font-medium">
      <Heart className="" strokeWidth={3} size={20} />
      <h1 className="font-bold">{content.name}</h1>
    </div>
  );
}

export function LogoBig() {
  return (
    <div className="text-1xl flex h-screen flex-col items-center justify-center text-5xl font-medium">
      <Heart className="" strokeWidth={3} size={40} />
      <h1 className="font-bold">{content.name}</h1>
    </div>
  );
}
