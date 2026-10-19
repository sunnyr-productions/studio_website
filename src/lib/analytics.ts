import { track } from "@vercel/analytics";

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
  /** Visitor clicked one of the two door cards on the homepage. */
  "Door Clicked": { door: "lessons" | "studio" };
};

export function trackEvent<Name extends keyof ConversionEvents>(
  name: Name,
  properties: ConversionEvents[Name],
) {
  track(name, properties);
}
