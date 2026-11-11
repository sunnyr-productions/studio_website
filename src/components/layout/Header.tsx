import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { LogoLockup } from "@/components/ui/LogoLockup";
import { MobileNav } from "./MobileNav";
import { Sun } from "./Sun";

export function Header() {
  return (
    <header className="panel-glass column-inset sticky top-2 z-50 mt-2 sm:top-3 sm:mt-3">
      {/* The sun's light in the cloud: scattered through it, and at its edges. */}
      <span aria-hidden="true" className="header-sunlight header-sunlight-glow" />
      <span aria-hidden="true" className="header-sunlight header-sunlight-rim" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <Link
          href="/"
          aria-label={siteConfig.name}
          className="group rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold-600"
        >
          <LogoLockup behindMark={<Sun />} />
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          <nav className="hidden lg:block" aria-label="Main">
            <ul className="flex items-center gap-6">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
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

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
