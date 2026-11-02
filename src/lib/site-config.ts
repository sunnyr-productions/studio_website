import { products } from "@/lib/products";

export type NavItem = {
  label: string;
  href: string;
};

export const siteConfig = {
  name: "The sunny*r Studio",
  tagline: "Guitar, voice, production and audio engineering lessons in Corvallis, Oregon, plus mixing and mastering.",
  email: "sunnyrmusic@gmail.com",
  /** Reply-time promise — form success message, contact page, auto-reply. */
  responseTime: {
    lessons: "1 to 2 business days",
    studio: "2 business days",
    /** Either side, or when the visitor has not said which. */
    any: "2 business days",
  },
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
    { label: "Lessons", href: "/lessons" },
    { label: "Studio", href: "/studio" },
    { label: "Music", href: "/music" },
    // The store stays out of the menus until it has something in it.
    ...(products.length > 0 ? [{ label: "Store", href: "/store" }] : []),
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[] as NavItem[],
  /** Every page with content, always linked. */
  footerLinks: [
    { label: "Lessons", href: "/lessons" },
    { label: "Studio", href: "/studio" },
    { label: "Music", href: "/music" },
    ...(products.length > 0 ? [{ label: "Store", href: "/store" }] : []),
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
