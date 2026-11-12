import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  // React's view transitions on navigation: the fog passing between pages
  // (PageWeather.tsx). Experimental in Next 16.
  experimental: {
    viewTransition: true,
  },
  // AVIF first: photos come out much smaller than WebP at the same quality.
  // Browsers without it get WebP, and the original JPEGs stay the source.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The old /services pages moved to /studio when the site split into two doors.
  async redirects() {
    return [
      { source: "/services", destination: "/studio", permanent: true },
      { source: "/services/:path*", destination: "/studio/:path*", permanent: true },
      { source: "/studio/consultation", destination: "/studio", permanent: true },
      { source: "/studio/mix-master-bundle", destination: "/studio", permanent: true },
      { source: "/portfolio", destination: "/music", permanent: true },
      { source: "/blog/5-tips-for-better-home-recordings", destination: "/blog", permanent: true },
      { source: "/blog/choosing-your-first-audio-interface", destination: "/blog", permanent: true },
      { source: "/blog/how-loud-should-your-master-be-lufs", destination: "/blog", permanent: true },
      { source: "/blog/in-person-vs-online-music-lessons", destination: "/blog", permanent: true },
      { source: "/blog/mixing-vs-mastering-whats-the-difference", destination: "/blog", permanent: true },
      { source: "/blog/what-mastering-actually-does", destination: "/blog", permanent: true },
    ];
  },
};

// withBotId adds the rewrites Vercel BotID's invisible challenge needs (see
// src/instrumentation-client.ts and the checks in the API routes).
export default withBotId(nextConfig);
