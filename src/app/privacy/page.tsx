import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Prose } from "@/components/ui/Prose";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What The sunny*r Studio collects, why, and how to have it deleted.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "October 7, 2026";

/**
 * Describes what the code actually does — keep it in sync when adding a
 * service (e.g. a newsletter, new analytics, or file uploads).
 */
export default function PrivacyPage() {
  return (
    <Section pattern="dots" space="page" width="narrow">
      <article className="max-w-2xl">
        <h1 className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-ink-900">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-ink-500">Last updated {LAST_UPDATED}</p>

        <Prose className="mt-6">
          <p>
            {siteConfig.name} is a one-person studio, so this is simple: I collect only what I need
            to reply to you and deliver what you’ve booked or bought. I don’t sell your
            information, and there’s no advertising tracking on this site.
          </p>

          <h2 id="collect">What’s collected, and where it goes</h2>
          <ul>
            <li>
              <strong>Contact form.</strong> Your name, email, the service you pick, any project or
              lesson details, links you include, and your message. It’s sent to my inbox by
              email (via Resend). It isn’t stored in a database on this site.
            </li>
            <li>
              <strong>Lesson booking.</strong> Bookings are handled by Cal.com, which collects your
              name, email, and chosen time to schedule the lesson and send confirmations.
            </li>
            <li>
              <strong>Store purchases.</strong> Checkout is handled by Stripe. Card details go
              straight to Stripe and never reach this site; I receive your name, email, and what you
              bought, and your download link is emailed via Resend.
            </li>
            <li>
              <strong>Analytics.</strong> Vercel Web Analytics and Speed Insights count page views
              and measure load performance. They don’t use cookies and don’t identify you
              personally.
            </li>
            <li>
              <strong>Your browser.</strong> Your light/dark theme and lessons/studio choice are
              saved in your browser’s local storage so the site remembers them. That stays on
              your device.
            </li>
          </ul>

          <h2 id="use">How it’s used</h2>
          <p>
            To answer your message, schedule and teach lessons, deliver studio work and downloads,
            and keep basic business records. That’s it: no mailing lists unless you explicitly
            sign up for one.
          </p>

          <h2 id="choices">Your choices</h2>
          <p>
            You can ask to see, correct, or delete what I have about you at any time by emailing{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. Some records (like
            payment receipts) may need to be kept for tax purposes.
          </p>
          <p>
            This site isn’t meant for children under 13 to submit information. Parents or
            guardians booking lessons for a child can reach out directly.
          </p>

          <h2 id="changes">Changes</h2>
          <p>
            If this policy changes, the updated version is posted here with a new date. See also the{" "}
            <Link href="/terms">terms &amp; policies</Link>.
          </p>
        </Prose>
      </article>
    </Section>
  );
}
