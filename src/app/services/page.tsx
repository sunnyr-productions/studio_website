import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { modes } from "@/content/modes";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Mixing, Mastering & Recording in Corvallis, OR",
  description:
    "Mixing from $175/song, mastering from $60/track, and recording sessions in Corvallis, Oregon or remote. Two revision rounds on every mix.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <Section pattern="dots" surface="sky" space="page">
        <h1 className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-ink-900">
          Mixing &amp; Mastering
        </h1>
        <p
          style={{ animationDelay: "80ms" }}
          className="animate-fade-up mt-3 max-w-xl leading-relaxed text-ink-700"
        >
          Mixing, mastering, recording, and consultation for artists getting a release ready. Prices
          below are starting points. Send me your track count, timeline, and goals, and I’ll
          reply with a fixed quote.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 70}>
              <Card accent={service.accent} className="flex h-full flex-col">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
                  {service.name}
                </h2>
                <p className="mt-2 leading-relaxed text-ink-700">{service.blurb}</p>
                <ul className="mt-4 space-y-1 text-sm text-ink-700">
                  {service.details.map((detail) => (
                    <li key={detail} className="flex gap-2">
                      <span aria-hidden="true" className="text-marigold-600">
                        &bull;
                      </span>
                      {detail}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                  <p className="text-sm font-semibold text-marigold-800">{service.startingPrice}</p>
                  <Link
                    href={`/contact?service=${service.slug}`}
                    className="text-sm font-semibold text-periwinkle-700 underline decoration-periwinkle-300 underline-offset-2 transition-colors hover:text-periwinkle-600"
                  >
                    Get a quote
                    <span className="sr-only"> for {service.name.toLowerCase()}</span>
                  </Link>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section surface="ink">
        <HowItWorks mode={modes.studio} always />
      </Section>

      <Section space="tight">
        <CtaPanel
          title="Tell me about the project"
          body="Send your track count, timeline, and a reference or two. A fixed quote comes back within 2 business days."
        >
          <Button href="/contact">Get a quote</Button>
          <Button href="/lessons" variant="secondary">
            Looking for lessons instead?
          </Button>
        </CtaPanel>
      </Section>
    </>
  );
}
