import Logo from "@/app/_components/ui/Logo";
import NavIcon from "@/app/_components/NavIcon";

export default function MainLayout({ children }) {
  return (
    <div className="max-w-lg mx-auto sm:border-12 border-primary">
      <nav className="px-10 pt-10">
        <div className="flex justify-between gap-2">
          <Logo />
          <NavIcon />
        </div>
      </nav>
      {children}
    </div>
  );
}
