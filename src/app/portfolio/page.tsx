import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PortfolioTrackList } from "@/components/audio/PortfolioTrackList";
import { Reveal } from "@/components/ui/Reveal";
import { portfolioTracks } from "@/content/portfolio/tracks";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Mixing, mastering, and production work.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  const hasTracks = portfolioTracks.length > 0;

  return (
    <Section pattern="dots" className="pt-16">
      <h1 className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-ink-900">
        Portfolio
      </h1>
      <p style={{ animationDelay: "80ms" }} className="animate-fade-up mt-3 max-w-xl leading-relaxed text-ink-700">
        {hasTracks
          ? "A few tracks to get a feel for the work. Click play on any waveform below."
          : "Nothing is posted here yet. I only feature finished work with the artist's permission."}
      </p>

      {hasTracks ? (
        <Reveal delay={140} className="mt-10 max-w-2xl">
          <PortfolioTrackList tracks={portfolioTracks} />
        </Reveal>
      ) : (
        <Reveal delay={140} className="mt-10 max-w-2xl">
          <Card accent="periwinkle">
            <p className="leading-relaxed text-ink-700">
              Until there are tracks here, the quickest way to hear what I do is to ask: tell
              me about your project and I&apos;ll send examples close to the sound you&apos;re
              going for.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Button href="/contact">Get in touch</Button>
              <Button href="/services" variant="secondary">
                See services
              </Button>
            </div>
          </Card>
        </Reveal>
      )}
    </Section>
  );
}
