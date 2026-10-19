import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getAllPosts } from "@/lib/blog";
import { products } from "@/lib/products";
import { portfolioTracks } from "@/content/portfolio/tracks";

/**
 * Sitemap for crawlers. Static pages plus every blog post. Transactional and
 * API routes (checkout success/cancel, /api/*) are intentionally excluded —
 * they carry no search value and are disallowed in robots.ts too.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  // Bump a date here when that page's content meaningfully changes; leaving
  // every page stamped "now" tells crawlers nothing and wastes their trust.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date("2026-10-15"), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/lessons`, lastModified: new Date("2026-10-15"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/studio`, lastModified: new Date("2026-10-15"), changeFrequency: "monthly", priority: 0.9 },
    // Empty pages stay out of the sitemap (and are noindexed) until they have content.
    ...(portfolioTracks.length > 0
      ? [{ url: `${base}/portfolio`, lastModified: new Date("2026-10-15"), changeFrequency: "monthly" as const, priority: 0.7 }]
      : []),
    ...(products.length > 0
      ? [{ url: `${base}/store`, lastModified: new Date("2026-10-15"), changeFrequency: "monthly" as const, priority: 0.6 }]
      : []),
    { url: `${base}/blog`, lastModified: new Date("2026-10-15"), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date("2026-10-15"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date("2026-10-15"), changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/terms`, lastModified: new Date("2026-10-07"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date("2026-10-07"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
