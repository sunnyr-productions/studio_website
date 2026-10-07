import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Suspense } from "react";
import { ContactForm, ContactFormFromUrl } from "@/components/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";
import { trialPhrase } from "@/content/lessons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about mixing, mastering, lessons, or a custom quote.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Section pattern="dots" className="pt-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          <h1 className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-ink-900">
            Let&apos;s work together
          </h1>
          <p
            data-mode-only="lessons"
            style={{ animationDelay: "80ms" }}
            className="animate-fade-up mt-3 max-w-lg leading-relaxed text-ink-700"
          >
            Tell me what you&apos;d like to learn — your instrument, where you&apos;re starting
            from, and what you&apos;re hoping to play. No experience required, and no pressure:
            the first lesson can be {trialPhrase}, so we can see if it&apos;s a good fit. Just have
            questions? Ask away — answering them here is free.
          </p>
          <p
            data-mode-only="studio"
            style={{ animationDelay: "80ms" }}
            className="animate-fade-up mt-3 max-w-lg leading-relaxed text-ink-700"
          >
            Tell me about the project — track count, rough timeline, and what you want it to
            sound like. I&apos;ll follow up with a quote shaped around the actual work, not a
            one-size-fits-all rate.
          </p>

          <div style={{ animationDelay: "140ms" }} className="animate-fade-up mt-8 max-w-2xl">
            <Suspense fallback={<ContactForm />}>
              <ContactFormFromUrl />
            </Suspense>
          </div>
        </div>

        <Reveal delay={120} className="text-sm text-ink-700">
          <p className="font-semibold text-ink-900">When you&apos;ll hear back</p>
          <p className="mt-1">Within {siteConfig.responseTime}.</p>

          <p className="mt-6 font-semibold text-ink-900">Prefer email?</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-1 block transition-colors hover:text-marigold-600"
          >
            {siteConfig.email}
          </a>

          <p className="mt-6 font-semibold text-ink-900">Booking a lesson instead?</p>
          <Link href="/lessons" className="mt-1 block transition-colors hover:text-marigold-600">
            Go straight to scheduling
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}
