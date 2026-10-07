import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Mixing, mastering, recording, and consultation services.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <Section pattern="dots" className="pt-16">
      <h1 className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-ink-900">
        Mixing &amp; Mastering
      </h1>
      <p style={{ animationDelay: "80ms" }} className="animate-fade-up mt-3 max-w-xl leading-relaxed text-ink-700">
        Client audio services, separate from lessons — good fit for lesson students ready to
        release something, or anyone who just needs a track to sound its best. Every project is
        different, so pricing below is a starting point — get in touch for a quote tailored to
        your track count, timeline, and goals.
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
                  Get a quote<span className="sr-only"> for {service.name.toLowerCase()}</span>
                </Link>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Button href="/contact">Get a quote</Button>
        <Button href="/lessons" variant="secondary">
          Looking for lessons instead?
        </Button>
      </div>

      <Reveal delay={80}>
        <p className="mt-8 text-center text-sm text-ink-500">
          Mixing and mastering is the studio side of the practice — the other door is{" "}
          <Link href="/lessons" className="font-semibold text-periwinkle-700 underline decoration-periwinkle-300 underline-offset-2 transition-colors hover:text-periwinkle-600">
            teaching
          </Link>
          .
        </p>
      </Reveal>
    </Section>
  );
}
