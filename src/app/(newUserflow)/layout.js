import { LogoSmall } from "@/ui/components/logo";
import SwigglieLine from "@/ui/svg/swigglieLine";

export default function Layout({ children }) {
  return (
    <div className="relative flex h-screen flex-col justify-between">
      <div className="flex grow flex-col p-10">
        <LogoSmall className=""></LogoSmall>
        {children}
      </div>
      <div className="relative h-56 overflow-hidden">
        <SwigglieLine className="absolute -right-10 bottom-10 -left-10 z-0 md:hidden"></SwigglieLine>
      </div>
    </div>
  );
}
