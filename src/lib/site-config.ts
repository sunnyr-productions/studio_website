import type { StudioMode } from "@/content/modes";

export type NavItem = {
  label: string;
  href: string;
  /**
   * Which door this page belongs to. Omitted = shown in both.
   * Mode-specific items are hidden (CSS, not JS) in the other mode to cut the
   * nav clutter of mixing both functions — every page stays reachable from
   * the footer sitemap, so nothing is orphaned for visitors or crawlers.
   */
  modes?: StudioMode[];
};

export const siteConfig = {
  name: "The sunny*r Studio",
  tagline: "Guitar, vocal, production & engineering lessons taught patiently — plus mixing and mastering for musicians ready to level up.",
  motto: "Good things grow on the sunny*r side.",
  email: "raulpatel0224@gmail.com",
  /** Canonical production origin — set NEXT_PUBLIC_SITE_URL in Vercel. No trailing slash. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  /** Studio location — used for local-SEO structured data. */
  location: { city: "Corvallis", region: "OR", regionName: "Oregon", country: "US" },
  calLink: process.env.NEXT_PUBLIC_CAL_LINK ?? "raul/lesson",
  nav: [
    { label: "Home", href: "/" },
    { label: "Lessons", href: "/lessons", modes: ["lessons"] },
    { label: "Services", href: "/services", modes: ["studio"] },
    { label: "Portfolio", href: "/portfolio", modes: ["studio"] },
    { label: "Store", href: "/store" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[] as NavItem[],
  /** Every page, always linked, regardless of mode. */
  footerLinks: [
    { label: "Lessons", href: "/lessons" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Store", href: "/store" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
