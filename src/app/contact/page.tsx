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
    <Section pattern="dots" space="page">
      <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          <h1 className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-ink-900">
            Let’s work together
          </h1>
          <p
            style={{ animationDelay: "80ms" }}
            className="animate-fade-up mt-3 max-w-lg leading-relaxed text-ink-700"
          >
            Tell me what you’re after and the form will ask the right follow-up questions. Lessons
            can start with {trialPhrase}, and studio projects get a quote before any work starts.
            Just curious about something? Ask. Questions are free.
          </p>

          <div style={{ animationDelay: "140ms" }} className="animate-fade-up mt-8 max-w-2xl">
            <Suspense fallback={<ContactForm />}>
              <ContactFormFromUrl />
            </Suspense>
          </div>
        </div>

        <Reveal delay={120} className="text-sm text-ink-700">
          <p className="font-semibold text-ink-900">When you’ll hear back</p>
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
