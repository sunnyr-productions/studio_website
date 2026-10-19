import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioTrackList } from "@/components/audio/PortfolioTrackList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { DoorHero } from "@/components/ui/DoorHero";
import { Faq } from "@/components/ui/Faq";
import { GrowthDivider } from "@/components/ui/GrowthDivider";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatStrip } from "@/components/ui/StatStrip";
import { Testimonials } from "@/components/ui/Testimonials";
import { ValueProps } from "@/components/ui/ValueProps";
import { getHeroPhotos } from "@/content/media";
import { modes } from "@/content/modes";
import { portfolioTracks } from "@/content/portfolio/tracks";
import { services } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import { siteConfig } from "@/lib/site-config";
import { faqPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Mixing, Mastering & Recording in Corvallis, OR",
  description:
    "Mixing from $175/song, mastering from $60/track, and recording sessions in Corvallis, Oregon or remote. Two revision rounds on every mix.",
  alternates: { canonical: "/studio" },
};

const mode = modes.studio;

export default function StudioPage() {
  // An empty portfolio is a dead end, so the secondary CTA points at the
  // services below until there are tracks to hear.
  const secondaryCta =
    portfolioTracks.length > 0 ? mode.secondaryCta : { label: "See services", href: "#services" };

  return (
    <>
      <JsonLd data={faqPageSchema(mode.faqs)} />

      <Section pattern="dots" surface="sky" space="hero">
        <DoorHero mode={mode} secondaryCta={secondaryCta} photo={getHeroPhotos().studio} />
        <div className="mt-14">
          <StatStrip mode={mode} />
        </div>
        <GrowthDivider className="mt-14" />
      </Section>

      <Section surface="dusk" id="services" className="scroll-mt-4">
        <Reveal>
          <SectionHeading
            title="Mixing, mastering & recording"
            lede="These prices are starting points. Tell me about your project and I’ll send you a fixed quote before anything starts."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 70}>
              <Card accent={service.accent} className="flex h-full flex-col">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
                  {service.name}
                </h3>
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
                  <div className="flex gap-4">
                    <Link
                      href={`/studio/${service.slug}`}
                      className="inline-block py-2 text-sm font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600"
                    >
                      Details
                      <span className="sr-only"> for {service.name.toLowerCase()}</span>
                    </Link>
                    <Link
                      href={`/contact?service=${service.slug}`}
                      className="inline-block py-2 text-sm font-semibold text-periwinkle-700 underline decoration-periwinkle-300 underline-offset-2 transition-colors hover:text-periwinkle-600"
                    >
                      Get a quote
                      <span className="sr-only"> for {service.name.toLowerCase()}</span>
                    </Link>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {portfolioTracks.length > 0 && (
        <Section surface="tint">
          <Reveal>
            <SectionHeading
              title="Recent work"
              action={
                <Button href="/portfolio" variant="ghost" className="hidden sm:inline-flex">
                  Hear more
                </Button>
              }
            />
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <PortfolioTrackList tracks={portfolioTracks.slice(0, 3)} />
          </Reveal>
          <Button href="/portfolio" variant="ghost" className="mt-8 sm:hidden">
            Hear more
          </Button>
        </Section>
      )}

      <Section>
        <ValueProps mode={mode} />
      </Section>

      <Section surface="ink">
        <HowItWorks mode={mode} />
      </Section>

      {testimonials.length > 0 && (
        <Section>
          <Testimonials />
        </Section>
      )}

      <Section surface="tint" id="faq">
        <Faq mode={mode} />
      </Section>

      <Section space="tight">
        <CtaPanel
          title="Got a song that’s ready?"
          body={`Tell me how many tracks, when you need it, and what you want it to sound like. I’ll send a quote within ${siteConfig.responseTime.studio}.`}
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
