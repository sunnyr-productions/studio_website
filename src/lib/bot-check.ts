import "server-only";
import { checkBotId } from "botid/server";

/**
 * Vercel BotID verdict for the current request (routes are registered in
 * src/instrumentation-client.ts).
 *
 * Only runs when NEXT_PUBLIC_VERCEL_ENV is set (automatic on Vercel) — the
 * same signal that turns the client-side challenge on, so the two can never
 * disagree. (Checking without the client challenge would flag every visitor.)
 * Fails open: if the check itself errors, each route's own guards (e.g. the
 * contact form's honeypot) still apply, and a real person's message isn't
 * lost to a BotID outage.
 */
export async function isBot(): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_VERCEL_ENV) return false;
  try {
    return (await checkBotId()).isBot;
  } catch (error) {
    console.error("BotID check failed; allowing request", error);
    return false;
  }
}
