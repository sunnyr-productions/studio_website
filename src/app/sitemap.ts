import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getAllPosts } from "@/lib/blog";
import { products } from "@/lib/products";
import { servicePages } from "@/content/service-pages";
import { services } from "@/content/services";
import { lessonTypes } from "@/content/lessons";
import { neurodivergentPage } from "@/content/neurodivergent-page";
import { lessonPages } from "@/content/lesson-pages";

/**
 * Sitemap for crawlers. Static pages plus every blog post. Transactional and
 * API routes (checkout success/cancel, /api/*) are intentionally excluded —
 * they carry no search value and are disallowed in robots.ts too.
 */
/**
 * When the pages' content last meaningfully changed: bump it then, and only
 * then. Stamping every page "now" on every build tells crawlers nothing and
 * wastes their trust. 2026-11-12: every page but the policies rewritten.
 */
const UPDATED = new Date("2026-11-12");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/lessons`, lastModified: UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/studio`, lastModified: UPDATED, changeFrequency: "monthly", priority: 0.9 },
    // Empty pages stay out of the sitemap (and are noindexed) until they have content.
    { url: `${base}/music`, lastModified: UPDATED, changeFrequency: "monthly", priority: 0.7 },
    ...(products.length > 0
      ? [{ url: `${base}/store`, lastModified: UPDATED, changeFrequency: "monthly" as const, priority: 0.6 }]
      : []),
    { url: `${base}/blog`, lastModified: UPDATED, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: UPDATED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: UPDATED, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/terms`, lastModified: new Date("2026-11-02"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date("2026-11-02"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const detailRoutes: MetadataRoute.Sitemap = [
    ...(neurodivergentPage.published
      ? [
          {
            url: `${base}/lessons/neurodivergent-learners`,
            lastModified: UPDATED,
            changeFrequency: "monthly" as const,
            priority: 0.8,
          },
        ]
      : []),
    ...lessonTypes.map((l) => ({
      url: `${base}/lessons/${lessonPages[l.slug].pageSlug}`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...services.filter((svc) => servicePages[svc.slug]).map((svc) => ({
      url: `${base}/studio/${svc.slug}`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...detailRoutes, ...postRoutes];
}
