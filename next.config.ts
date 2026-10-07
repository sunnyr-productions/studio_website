import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  /* config options here */
};

// withBotId adds the rewrites Vercel BotID's invisible challenge needs (see
// src/instrumentation-client.ts and the checks in the API routes).
export default withBotId(nextConfig);
