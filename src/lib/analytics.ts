import { track } from "@vercel/analytics";
import type { StudioMode } from "@/content/modes";

/**
 * Conversion events sent to Vercel Web Analytics — the moments that turn a
 * visit into work. Typed so names and properties stay consistent across the
 * site.
 *
 * Note: Vercel shows custom events on the Pro plan and up; on Hobby these
 * calls are harmless no-ops in the dashboard.
 */
type ConversionEvents = {
  /** Contact form sent successfully. */
  "Inquiry Sent": { service: string };
  /** Cal.com booking confirmed inside the lessons-page embed. */
  "Lesson Booked": { event: string };
  /** Store "Buy Now" clicked (before the redirect to Stripe). */
  "Checkout Started": { product: string };
  /** Visitor picked a door on the mode toggle. */
  "Door Chosen": { door: StudioMode };
};

export function trackEvent<Name extends keyof ConversionEvents>(
  name: Name,
  properties: ConversionEvents[Name],
) {
  track(name, properties);
}
