import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about mixing, mastering, lessons, or a custom quote.",
};

export default function ContactPage() {
  return (
    <Section pattern="dots" className="pt-16">
      <div className="grid gap-10 sm:grid-cols-[1fr_320px]">
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
            the first lesson is a discounted trial so we can see if it&apos;s a good fit.
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

          <div style={{ animationDelay: "140ms" }} className="animate-fade-up mt-8 max-w-lg">
            <ContactForm />
          </div>
        </div>

        <Reveal delay={120} className="text-sm text-ink-700">
          <p className="font-semibold text-ink-900">Prefer email?</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-1 block transition-colors hover:text-marigold-600"
          >
            {siteConfig.email}
          </a>

          <p className="mt-6 font-semibold text-ink-900">Booking a lesson instead?</p>
          <a href="/lessons" className="mt-1 block transition-colors hover:text-marigold-600">
            Go straight to scheduling
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
