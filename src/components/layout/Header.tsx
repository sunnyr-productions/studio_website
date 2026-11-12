import Link from "next/link";
import { LogoLockup } from "@/components/ui/LogoLockup";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { Sun } from "./Sun";

export function Header() {
  return (
    <header className="panel-glass column-inset sticky top-2 z-50 mt-2 sm:top-3 sm:mt-3">
      {/* The sun's light in the cloud: scattered through it, and at its edges. */}
      <span aria-hidden="true" className="header-sunlight header-sunlight-glow" />
      <span aria-hidden="true" className="header-sunlight header-sunlight-rim" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        {/* Named by what it shows, "the sunny*r studio" (the mark is labelled
            sunny*r), so the name matches the words you see. */}
        <Link href="/" className="group rounded-sm">
          <LogoLockup behindMark={<Sun />} />
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          <nav className="hidden lg:block" aria-label="Main">
            <NavLinks />
          </nav>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
