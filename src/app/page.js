import { Heart } from "lucide-react";

import content from "@/content/global";

export default function Home() {
  return (
    <div className="grid h-screen place-items-center">
      <div className="bg-primary flex flex-col items-center justify-center rounded-full p-10">
        <Heart className="size-6 text-white" />
        <h1 className="text-xl font-extralight">{content.name}</h1>
      </div>
    </div>
  );
}
