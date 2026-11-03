import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Suspense } from "react";
import { ContactForm, ContactFormFromUrl } from "@/components/ContactForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Raul: Lessons or a Mixing Quote",
  description:
    "Ask a question, book a trial lesson, or get a quote for your song.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Section pattern="dots" space="page">
      <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900">
            What are you working on?
          </h1>
          <p
            className="mt-3 max-w-lg leading-relaxed text-ink-700"
          >
            Tell me what you’d like to learn or what you’re making. Half-baked is fine. I read these
            myself and answer around my day job, so expect to hear back within{" "}
            {siteConfig.responseTime.lessons} about lessons and within{" "}
            {siteConfig.responseTime.studio} with a studio quote.
          </p>

          <div className="mt-8 max-w-2xl">
            <Suspense fallback={<ContactForm />}>
              <ContactFormFromUrl />
            </Suspense>
          </div>
        </div>

        <div className="text-sm text-ink-700">
          <p className="font-semibold text-ink-900">Prefer email?</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-1 block transition-colors hover:text-marigold-600"
          >
            {siteConfig.email}
          </a>

          <p className="mt-6 font-semibold text-ink-900">Just want to book a lesson?</p>
          <Link href="/lessons#book" className="mt-1 block transition-colors hover:text-marigold-600">
            Go to the calendar
          </Link>
        </div>
      </div>
    </Section>
  );
}
