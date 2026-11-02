import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Suspense } from "react";
import { ContactForm, ContactFormFromUrl } from "@/components/ContactForm";
import { siteConfig } from "@/lib/site-config";
import { trialPhrase } from "@/content/lessons";

export const metadata: Metadata = {
  title: "Contact: Book Lessons or Get a Mixing Quote",
  description:
    "Ask a question, book a trial lesson, or request a quote for mixing, mastering, or recording. Raul replies personally.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Section pattern="dots" space="page">
      <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900">
            Tell me what you’re up to
          </h1>
          <p
            className="mt-3 max-w-lg leading-relaxed text-ink-700"
          >
            Tell me what you’re after. Lessons can start with {trialPhrase}, and studio work gets a
            quote before anything starts. If you just have a question, ask.
          </p>

          <div className="mt-8 max-w-2xl">
            <Suspense fallback={<ContactForm />}>
              <ContactFormFromUrl />
            </Suspense>
          </div>
        </div>

        <div className="text-sm text-ink-700">
          <p className="font-semibold text-ink-900">When you’ll hear back</p>
          <p className="mt-1">
            Lessons: within {siteConfig.responseTime.lessons}.
            <br />
            Studio quotes: within {siteConfig.responseTime.studio}.
          </p>

          <p className="mt-6 font-semibold text-ink-900">Prefer email?</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-1 block transition-colors hover:text-marigold-600"
          >
            {siteConfig.email}
          </a>

          <p className="mt-6 font-semibold text-ink-900">Booking a lesson instead?</p>
          <Link href="/lessons#book" className="mt-1 block transition-colors hover:text-marigold-600">
            Go straight to scheduling
          </Link>
        </div>
      </div>
    </Section>
  );
}
