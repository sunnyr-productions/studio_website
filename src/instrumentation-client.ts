import { initBotId } from "botid/client/core";

/**
 * Runs before the app becomes interactive. Vercel BotID attaches its invisible
 * challenge to requests matching these routes; the matching server-side check
 * is isBot() in src/lib/bot-check.ts. Keep the route list in sync with the
 * routes that call it.
 *
 * Gated on NEXT_PUBLIC_VERCEL_ENV (set automatically on Vercel) — the same
 * signal bot-check.ts uses — so client and server are always on or off
 * together. Off Vercel (local dev, other hosts) the challenge can't load and
 * would block protected requests, so it's skipped there.
 */
if (process.env.NEXT_PUBLIC_VERCEL_ENV) {
  initBotId({
    protect: [
      { path: "/api/contact", method: "POST" },
      { path: "/api/checkout", method: "POST" },
    ],
  });
}
