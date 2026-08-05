import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { LogoLockup } from "@/components/ui/LogoLockup";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-cream-100">
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="block h-10 w-full text-cream-100 sm:h-14"
        aria-hidden="true"
      >
        <path
          d="M0,38 C120,12 240,54 360,30 C480,8 600,54 720,30 C840,8 960,54 1080,30 C1140,18 1170,36 1200,28 L1200,60 L0,60 Z"
          className="fill-current"
        />
        <path
          d="M0,38 C120,12 240,54 360,30 C480,8 600,54 720,30 C840,8 960,54 1080,30 C1140,18 1170,36 1200,28"
          fill="none"
          stroke="var(--color-ink-900)"
          strokeOpacity="0.15"
          strokeWidth="2"
        />
      </svg>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-12 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <LogoLockup className="scale-90 origin-left" />
          <p className="mt-4 font-display text-base italic text-marigold-800">
            {siteConfig.motto}
          </p>
          <p className="mt-2 max-w-sm text-sm text-ink-700">{siteConfig.tagline}</p>
        </div>

        <div className="flex flex-col gap-6 sm:items-end">
          <div>
            <span data-mode-only="lessons">
              <Button href="/lessons" variant="primary" className="text-sm">
                Book a lesson
              </Button>
            </span>
            <span data-mode-only="studio">
              <Button href="/contact" variant="primary" className="text-sm">
                Get a quote
              </Button>
            </span>
          </div>

          {/* Full sitemap — every page stays linked in both modes, so the
              mode-filtered header never orphans a page for a visitor or a
              crawler. */}
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
      <div className="border-t border-ink-900/5 px-6 py-4 text-center text-xs text-ink-500">
        &copy; {year} {siteConfig.name}. All rights reserved.{" "}
        <Link href="/contact" className="transition-colors hover:text-marigold-600">
          Get in touch
        </Link>
      </div>
    </footer>
  );
}
