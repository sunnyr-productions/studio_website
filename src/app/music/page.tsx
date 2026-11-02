import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioTrackList } from "@/components/audio/PortfolioTrackList";
import { Button } from "@/components/ui/Button";
import { PhotoBanner } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { media } from "@/content/media";
import { portfolioTracks } from "@/content/portfolio/tracks";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Hear Raul's work: a cappella recordings with On the Rocks at the University of Oregon, and his own songs as sunny*r.",
  alternates: { canonical: "/music" },
};

const onTheRocks = [
  { id: "2QffWR8a0kvTPZUYuZMB4A", title: "Move Me", note: "From In the Groove. I arranged this one, helped produce the vocals, and sang on it." },
  { id: "1NRRlr4SCcnyGAY9ZUWryY", title: "Skate", note: "From In the Groove. I helped produce the vocals and sang on it." },
  { id: "4ZYxWcnQhF0pFAMCCEyjl6", title: "Say My Name", note: "From Evergreen. I’m one of the featured soloists." },
  { id: "0TyroIpUFupEh2blFpDoaf", title: "Cruise (Wagon Wheel Remix)", note: "From Evergreen. I sing the “Wagon Wheel” section." },
];

export default function MusicPage() {
  return (
    <>
      <Section space="page" width="narrow">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          Music
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-700">
          I’m new to mixing for clients, so this page is mostly work of a different kind: a cappella
          recordings I sang on, arranged or produced vocals for, and my own first single, which I’m
          including even though it’s not my best work.
        </p>
      </Section>

      {portfolioTracks.length > 0 && (
        <Section width="narrow" space="tight">
          <SectionHeading title="Client work" />
          <div className="mt-8">
            <PortfolioTrackList tracks={portfolioTracks} />
          </div>
        </Section>
      )}

      <PhotoBanner photo={media.stageSoloists} />

      <Section width="narrow" space="tight">
        <SectionHeading title="On the Rocks" />
        <p className="mt-3 leading-relaxed text-ink-700">
          I was music director of this a cappella group at the University of Oregon. I didn’t record
          or mix these, so listen for the singing and arrangements.
        </p>
        <div className="mt-8 space-y-8">
          {onTheRocks.map((track) => (
            <div key={track.id}>
              <h3 className="font-display text-xl font-semibold text-ink-900">{track.title}</h3>
              <p className="mt-1 mb-3 text-ink-700">{track.note}</p>
              <iframe
                title={`${track.title} by On the Rocks on Spotify`}
                src={`https://open.spotify.com/embed/track/${track.id}`}
                width="100%"
                height="152"
                loading="lazy"
                allow="encrypted-media"
                style={{ border: 0, borderRadius: 12 }}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section width="narrow" space="tight">
        <SectionHeading title="“Changed,” twice" />
        <p className="mt-3 leading-relaxed text-ink-700">
          My first release as sunny*r, which I later went back and re-released.{" "}
          <Link
            href="/blog/the-song-i-mixed-twice"
            className="font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600"
          >
            Here’s what went wrong the first time
          </Link>
          .
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {[
            { id: "8mxlsYJZuSg", label: "First version" },
            { id: "uMzK5g5riKk", label: "Second version" },
          ].map((video) => (
            <div key={video.id}>
              <h3 className="mb-2 font-semibold text-ink-900">{video.label}</h3>
              <iframe
                title={`Changed by sunny*r, ${video.label.toLowerCase()}, on YouTube`}
                src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                loading="lazy"
                allowFullScreen
                className="aspect-video w-full"
                style={{ border: 0, borderRadius: 12 }}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section width="narrow" space="tight">
        <div className="flex flex-wrap gap-4">
          <Button href="/contact?service=mixing">Tell me about your song</Button>
          <Button href="/lessons" variant="secondary">
            See lessons
          </Button>
        </div>
      </Section>
    </>
  );
}
