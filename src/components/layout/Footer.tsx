import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { LogoLockup } from "@/components/ui/LogoLockup";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-night mt-auto px-2 pb-2 pt-[230px] sm:px-3 sm:pb-3">
      <div className="panel-glass relative">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-10 pt-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/"
            aria-label={siteConfig.name}
            className="group inline-block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold-600"
          >
            <LogoLockup />
          </Link>
          <p className="mt-4 font-display text-base italic text-marigold-800">
            Say it “sunnier.” If you said “sunny R,” you found the other half of the pun.
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
                    className="transition-colors hover:text-marigold-600"
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
        <Link href="/terms" className="transition-colors hover:text-marigold-600">
          Terms &amp; policies
        </Link>
        <span className="mx-2" aria-hidden="true">·</span>
        <Link href="/privacy" className="transition-colors hover:text-marigold-600">
          Privacy
        </Link>
      </div>
      </div>
    </footer>
  );
}
