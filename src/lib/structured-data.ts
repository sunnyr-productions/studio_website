import { lessonPricing } from "@/content/lessons";
import { studioPrices } from "@/content/services";
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
const PERSON_ID = `${base}/about#raul`;
const LOGO = `${base}/images/sunnyr-logo.png`;
const AUTHOR_NAME = "Raul";
/** Raul as the author of a post or the founder of the studio: named, and pointing at his page. */
const AUTHOR = { "@type": "Person", "@id": PERSON_ID, name: AUTHOR_NAME, url: `${base}/about` };

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
    founder: AUTHOR,
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
          lessonPricing.trial.price,
        ),
        serviceOffer("Mixing", "A balanced, release-ready mix from your raw tracks.", studioPrices.mixing),
        serviceOffer("Mastering", "Streaming-ready loudness and tonal polish.", studioPrices.mastering),
        serviceOffer("Recording sessions", "Studio tracking, engineered start to finish.", studioPrices.recording),
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
    author: AUTHOR,
    publisher: { "@id": STUDIO_ID },
  };
}

/**
 * Raul, on the About page: who runs the studio, what he knows, and where he
 * studied, all as the page itself says. `image` is the portrait's path.
 */
export function personSchema(image: string) {
  return {
    "@context": "https://schema.org",
    ...AUTHOR,
    image: `${base}${image}`,
    jobTitle: "Music teacher and audio engineer",
    worksFor: { "@id": STUDIO_ID },
    homeLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.location.city,
        addressRegion: siteConfig.location.region,
        addressCountry: siteConfig.location.country,
      },
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: "University of Oregon" },
    knowsAbout: ["Guitar", "Singing", "Music production", "Audio engineering", "Mixing", "A cappella arranging"],
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
