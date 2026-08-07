import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { LogoLockup } from "@/components/ui/LogoLockup";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { HeaderModeToggle } from "./HeaderModeToggle";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="relative z-50 border-b border-ink-900/5 bg-cream-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label={siteConfig.name}
          className="group rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold-600"
        >
          <LogoLockup className="scale-90 origin-left lg:scale-100" />
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden lg:block" aria-label="Main">
            <ul className="flex items-center gap-6">
              {siteConfig.nav.map((item) => (
                <li
                  key={item.href}
                  data-mode-only={item.modes?.length === 1 ? item.modes[0] : undefined}
                >
                  <Link
                    href={item.href}
                    className="relative text-sm font-medium text-ink-700 transition-colors duration-200 hover:text-marigold-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold-600 after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-marigold-500 after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <HeaderModeToggle />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
