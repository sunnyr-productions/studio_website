import type { StudioMode } from "@/content/modes";
import { products } from "@/lib/products";
import { portfolioTracks } from "@/content/portfolio/tracks";

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
  tagline: "Guitar, vocal, production & engineering lessons taught patiently, plus mixing and mastering for musicians ready to level up.",
  motto: "Good things grow on the sunny*r side.",
  email: "raulpatel0224@gmail.com",
  /** Reply-time promise — form success message, contact page, auto-reply. */
  responseTime: "2 business days",
  /** Canonical production origin — set NEXT_PUBLIC_SITE_URL in Vercel. No trailing slash. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  /** Studio location — used for local-SEO structured data. */
  location: { city: "Corvallis", region: "OR", regionName: "Oregon", country: "US" },
  /**
   * Cal.com booking link, e.g. "username/lesson". Null until NEXT_PUBLIC_CAL_LINK
   * is set — the lessons page then falls back to a contact CTA instead of
   * rendering Cal's "link seems to be wrong" error.
   */
  calLink: process.env.NEXT_PUBLIC_CAL_LINK?.trim() || null,
  nav: [
    { label: "Home", href: "/" },
    { label: "Lessons", href: "/lessons", modes: ["lessons"] },
    { label: "Services", href: "/services", modes: ["studio"] },
    // Portfolio and Store are left out of the menus until they have something
    // in them — an empty page in the nav is a dead end. Both stay reachable by
    // URL and in the sitemap.
    ...(portfolioTracks.length > 0
      ? [{ label: "Portfolio", href: "/portfolio", modes: ["studio" as const] }]
      : []),
    ...(products.length > 0 ? [{ label: "Store", href: "/store" }] : []),
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[] as NavItem[],
  /** Every page with content, always linked, regardless of mode. */
  footerLinks: [
    { label: "Lessons", href: "/lessons" },
    { label: "Services", href: "/services" },
    ...(portfolioTracks.length > 0 ? [{ label: "Portfolio", href: "/portfolio" }] : []),
    ...(products.length > 0 ? [{ label: "Store", href: "/store" }] : []),
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
