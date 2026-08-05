import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PortfolioTrackList } from "@/components/audio/PortfolioTrackList";
import { Reveal } from "@/components/ui/Reveal";
import { portfolioTracks } from "@/content/portfolio/tracks";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Sample mixes and masters.",
};

export default function PortfolioPage() {
  return (
    <Section pattern="dots" className="pt-16">
      <h1 className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-ink-900">
        Portfolio
      </h1>
      <p style={{ animationDelay: "80ms" }} className="animate-fade-up mt-3 max-w-xl leading-relaxed text-ink-700">
        A few sample tracks to get a feel for the work — click play on any waveform below.
        (Placeholder tone samples for now; real mixes coming soon.)
      </p>

      <Reveal delay={140} className="mt-10 max-w-2xl">
        <PortfolioTrackList tracks={portfolioTracks} />
      </Reveal>
    </Section>
  );
}
