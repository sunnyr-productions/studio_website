import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Prose } from "@/components/ui/Prose";
import { lessonPricing } from "@/content/lessons";
import { studioTerms } from "@/content/services";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Policies",
  description:
    "Lesson booking and cancellation, studio quotes and revisions, digital download terms, and website terms for The sunny*r Studio.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "October 7, 2026";

const { hourlyRate, trial, pack, cancellationNoticeHours, paymentMethods } = lessonPricing;

/**
 * Plain-language terms. Section ids (#lessons, #studio, #store) are linked
 * from the lessons page and elsewhere — keep them stable.
 */
export default function TermsPage() {
  return (
    <Section pattern="dots" className="pt-16">
      <article className="max-w-2xl">
        <h1 className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-ink-900">
          Terms &amp; Policies
        </h1>
        <p className="mt-2 text-sm text-ink-500">Last updated {LAST_UPDATED}</p>

        <Prose className="mt-6">
          <p>
            The short version: be upfront with me and I&apos;ll be upfront with you. These terms
            cover using this website and booking lessons, studio work, or downloads from{" "}
            {siteConfig.name}, run by Raul Patel in {siteConfig.location.city},{" "}
            {siteConfig.location.regionName}. Questions about anything here? Email{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>

          <h2 id="lessons">Lessons</h2>
          <ul>
            <li>
              <strong>Rates.</strong> Trial lesson ${trial.price} ({trial.minutes} minutes). Single
              lessons ${hourlyRate}/hour. A {pack.lessons}-lesson pack is ${pack.price}.
            </li>
            <li>
              <strong>Payment.</strong> Lessons are paid in person at the lesson, by{" "}
              {paymentMethods}. Packs are paid in full at the first lesson of the pack. For online
              lessons, please send payment by Venmo before we start.
            </li>
            <li>
              <strong>Rescheduling and cancelling.</strong> Free with at least{" "}
              {cancellationNoticeHours} hours&apos; notice. Cancellations with less notice, and
              no-shows, are charged in full (or count as a used lesson from a pack).
            </li>
            <li>
              <strong>If I need to cancel,</strong> you choose: reschedule at no cost, or a full
              refund for that lesson.
            </li>
            <li>
              <strong>Students under 18</strong> are booked by a parent or guardian, who is
              responsible for scheduling and payment.
            </li>
          </ul>

          <h2 id="studio">Mixing, mastering &amp; recording</h2>
          <ul>
            <li>
              <strong>Quotes first.</strong> Every project starts with a written quote covering
              scope (songs, track counts, deliverables), price, timeline, and payment terms. Work
              begins once you approve it.
            </li>
            <li>
              <strong>Deposit.</strong> Projects are booked with a {studioTerms.depositPercent}%
              deposit of the quoted price. The balance is due before final files are delivered.
              Both are invoiced by email.
            </li>
            <li>
              <strong>Revisions.</strong> Two rounds of revisions are included on every mix.
              Additional rounds, or changes outside the original scope, are quoted case by case
              before any extra work starts — no surprise charges.
            </li>
            <li>
              <strong>Your music stays yours.</strong> You keep all rights to your songs and
              recordings. By sending files, you confirm you have the right to have them mixed,
              mastered, or recorded.
            </li>
            <li>
              <strong>Portfolio.</strong> I only feature finished work on this site or elsewhere
              with your permission.
            </li>
            <li>
              <strong>Backups.</strong> Please keep your own copies of everything you send — I take
              good care of project files, but can&apos;t guarantee long-term storage.
            </li>
          </ul>

          <h2 id="store">Digital downloads</h2>
          <ul>
            <li>
              <strong>Delivery.</strong> After checkout, a download link is emailed to you. It
              expires after 48 hours, so save the file once it arrives.
            </li>
            <li>
              <strong>Use.</strong> Downloads are for your personal use — practice, study, covers,
              and remixes. Please don&apos;t resell or redistribute the files themselves.
            </li>
            <li>
              <strong>Refunds.</strong> Because downloads can&apos;t be returned, sales are final.
              If a file is broken, missing, or not what was described,{" "}
              <Link href="/contact">get in touch</Link> and I&apos;ll fix it or refund you.
            </li>
            <li>
              Payments are processed by Stripe; card details never touch this site.
            </li>
          </ul>

          <h2 id="website">Using this website</h2>
          <p>
            The writing, audio, design, and logo on this site belong to {siteConfig.name}. Feel
            free to share links; please don&apos;t republish the content without permission.
          </p>
          <p>
            The site and blog posts are provided as-is, for general information. To the extent the
            law allows, {siteConfig.name}&apos;s liability for any claim related to its services is
            limited to the amount you paid for the service involved.
          </p>
          <p>
            These terms are governed by the laws of the State of Oregon. If they change, the
            updated version is posted here with a new date.
          </p>

          <p>
            See also the <Link href="/privacy">privacy policy</Link>.
          </p>
        </Prose>
      </article>
    </Section>
  );
}
