import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { LogoLockup } from "@/components/ui/LogoLockup";
import { Falls } from "@/components/layout/Scenery";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    // Pulled up over the scenery's resting place, so the river reaches the edge
    // just above the copy and falls behind it. Clipped, since the cliffs beside
    // the falls run on past the screen's edges.
    <footer className="surface-night relative -mt-[var(--footer-dusk)] overflow-hidden pb-2 pt-[var(--footer-dusk)] sm:pb-3">
      <Falls />
      {/* Above every sky layer, which would otherwise drift across the footer's copy. */}
      <div className="column-inset relative z-[var(--z-copy)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-10 pt-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/"
            aria-label={siteConfig.name}
            className="group inline-block rounded-sm"
          >
            <LogoLockup />
          </Link>
          <p className="mt-4 font-display text-base italic text-marigold-800">
            Pronounced “sunnier.”
          </p>
          <p className="mt-2 max-w-sm text-sm text-ink-700">{siteConfig.tagline}</p>
        </div>

        <div className="flex flex-col gap-6 sm:items-end">
          <div className="flex flex-wrap gap-3 sm:justify-end">
            <Button href="/lessons#book" variant="primary" className="text-sm">
              Book a trial lesson
            </Button>
            <Button href="/contact?service=mixing" variant="secondary" className="text-sm">
              Ask about a song
            </Button>
          </div>

          {/* Full sitemap, so every page stays linked for visitors and crawlers. */}
          <nav aria-label="All pages">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-700 sm:justify-end">
              {siteConfig.footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="nav-link"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="border-t border-white/15 px-6 py-4 text-center text-xs text-ink-500">
        &copy; {year} {siteConfig.name}. All rights reserved.
        <span className="mx-2" aria-hidden="true">·</span>
        <Link href="/terms" className="nav-link">
          Terms &amp; policies
        </Link>
        <span className="mx-2" aria-hidden="true">·</span>
        <Link href="/privacy" className="nav-link">
          Privacy
        </Link>
      </div>
      </div>
    </footer>
  );
}
