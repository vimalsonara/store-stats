import { MainNav } from "@/components/mainNav";
import { ThemeToggle } from "./themeToggle";
import { navConfig } from "@/config/nav";
import Auth from "./NavMenu";
import { MobileNav } from "./mobileNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MainNav items={navConfig.mainNav} />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <ThemeToggle />
            <Auth />
          </nav>
        </div>
      </div>
    </header>
  );
}
