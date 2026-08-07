import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Crawler directives. Everything is crawlable except API routes and the
 * post-checkout confirmation pages, which are user-specific and have no search
 * value. Points crawlers at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/store/success", "/store/cancel"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
