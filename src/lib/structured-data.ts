import { siteConfig } from "@/lib/site-config";

/**
 * Builders for the site's JSON-LD structured data. Everything derives from
 * siteConfig so the canonical URL, name, and location stay in one place.
 *
 * - LocalBusiness (sitewide, in the root layout) is the anchor entity; its
 *   @id is referenced as the publisher of blog posts.
 * - FAQPage rides on each page that renders its FAQ, with only that page's questions.
 * - Service and BreadcrumbList ride on the nested /studio and /lessons pages.
 * - BlogPosting rides on each post.
 */

const base = siteConfig.url;
const STUDIO_ID = `${base}/#studio`;
const LOGO = `${base}/images/sunnyr-logo.png`;
const AUTHOR_NAME = "Raul Patel";

type Faq = { q: string; a: string };
type PostLike = { slug: string; title: string; excerpt: string; date: string };

function serviceOffer(name: string, description: string, minPrice: number) {
  return {
    "@type": "Offer",
    itemOffered: { "@type": "Service", name, description },
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice,
      priceCurrency: "USD",
    },
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": STUDIO_ID,
    name: siteConfig.name,
    url: `${base}/`,
    image: LOGO,
    logo: LOGO,
    description: siteConfig.tagline,
    slogan: siteConfig.motto,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.country,
    },
    areaServed: [
      { "@type": "City", name: `${siteConfig.location.city}, ${siteConfig.location.region}` },
      "Online worldwide",
    ],
    priceRange: "$",
    knowsAbout: [
      "Guitar lessons",
      "Vocal lessons",
      "Music production",
      "Audio engineering",
      "Mixing",
      "Mastering",
      "Recording",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Lessons & studio services",
      itemListElement: [
        serviceOffer(
          "Music lessons",
          "One-on-one guitar, vocal, production, and audio engineering lessons at one flat rate.",
          45,
        ),
        serviceOffer("Mixing", "A balanced, release-ready mix from your raw tracks.", 175),
        serviceOffer("Mastering", "Streaming-ready loudness and tonal polish.", 60),
        serviceOffer("Recording sessions", "Studio tracking, engineered start to finish.", 75),
      ],
    },
  };
}

export function faqPageSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function blogPostingSchema(post: PostLike) {
  const url = `${base}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url,
    mainEntityOfPage: url,
    image: LOGO,
    author: { "@type": "Person", name: AUTHOR_NAME },
    publisher: { "@id": STUDIO_ID },
  };
}

/** A single service page: what it is, who offers it, and the starting price. */
export function serviceSchema({
  name,
  description,
  path,
  minPrice,
}: {
  name: string;
  description: string;
  path: string;
  minPrice: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${base}${path}`,
    provider: { "@id": STUDIO_ID },
    areaServed: [
      { "@type": "City", name: `${siteConfig.location.city}, ${siteConfig.location.region}` },
      "Online worldwide",
    ],
    offers: {
      "@type": "Offer",
      priceSpecification: { "@type": "PriceSpecification", minPrice, priceCurrency: "USD" },
    },
  };
}

/** Breadcrumb trail for nested pages; `path` is the page's own URL path. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}
