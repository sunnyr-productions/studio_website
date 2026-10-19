import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  // The old /services pages moved to /studio when the site split into two doors.
  async redirects() {
    return [
      { source: "/services", destination: "/studio", permanent: true },
      { source: "/services/:path*", destination: "/studio/:path*", permanent: true },
    ];
  },
};

// withBotId adds the rewrites Vercel BotID's invisible challenge needs (see
// src/instrumentation-client.ts and the checks in the API routes).
export default withBotId(nextConfig);
