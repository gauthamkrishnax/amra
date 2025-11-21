import { LogoBig } from "@/ui/components/logo";
import Splashscreen from "@/ui/svg/splashScreen";

export default function Loading() {
  return (
    <div className="flex h-screen flex-col items-center justify-between overflow-hidden py-20">
      <LogoBig className="mt-20"> </LogoBig>
      <Splashscreen className="ml-40"></Splashscreen>
    </div>
  );
}
