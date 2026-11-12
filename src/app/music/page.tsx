import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { PortfolioTrackList } from "@/components/audio/PortfolioTrackList";
import { Button } from "@/components/ui/Button";
import { Frame } from "@/components/ui/Frame";
import { PhotoBanner } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { media } from "@/content/media";
import { portfolioTracks } from "@/content/portfolio/tracks";

export const metadata: Metadata = {
  title: "Music by Raul and On the Rocks",
  description:
    "A cappella recordings from the University of Oregon, and the first sunny*r single in two versions.",
  alternates: { canonical: "/music" },
};

const onTheRocks: { id: string; title: string; note: ReactNode }[] = [
  {
    id: "2QffWR8a0kvTPZUYuZMB4A",
    title: "Move Me",
    note: (
      <>
        From <em>In the Groove</em>. My arrangement.
      </>
    ),
  },
  {
    id: "1NRRlr4SCcnyGAY9ZUWryY",
    title: "Skate",
    note: (
      <>
        From <em>In the Groove</em>.
      </>
    ),
  },
  {
    id: "4ZYxWcnQhF0pFAMCCEyjl6",
    title: "Say My Name",
    note: (
      <>
        From <em>Evergreen</em>. I’m one of the soloists.
      </>
    ),
  },
  {
    id: "0TyroIpUFupEh2blFpDoaf",
    title: "Cruise (Wagon Wheel Remix)",
    note: (
      <>
        From <em>Evergreen</em>. I sing the “Wagon Wheel” section.
      </>
    ),
  },
];

export default function MusicPage() {
  return (
    <>
      <Section space="page" width="narrow">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          Music
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-700">
          A cappella recordings from college and my first single as sunny*r. Client mixes will be
          added here as they’re released.
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
          I was music director of this University of Oregon a cappella group. I sang, arranged and
          helped produce the vocals. Someone else recorded and mixed these.
        </p>
        <div className="mt-8 space-y-8">
          {onTheRocks.map((track) => (
            <div key={track.id}>
              <h3 className="font-display text-xl font-semibold text-ink-900">{track.title}</h3>
              <p className="mt-1 mb-3 text-ink-700">{track.note}</p>
              <Frame variant="embed">
                <iframe
                  title={`${track.title} by On the Rocks on Spotify`}
                  src={`https://open.spotify.com/embed/track/${track.id}`}
                  height="152"
                  loading="lazy"
                  allow="encrypted-media"
                />
              </Frame>
            </div>
          ))}
        </div>
      </Section>

      <Section width="narrow" space="tight">
        <SectionHeading title="“Changed,” before and after" />
        <p className="mt-3 leading-relaxed text-ink-700">
          My first single, released twice. The first mix was muddy, so I redid it.{" "}
          <Link
            href="/blog/the-song-i-mixed-twice"
            className="link-drawn"
          >
            What I learned
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
              <Frame variant="embed">
                <iframe
                  title={`Changed by sunny*r, ${video.label.toLowerCase()}, on YouTube`}
                  src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                  loading="lazy"
                  allowFullScreen
                  className="aspect-video"
                />
              </Frame>
            </div>
          ))}
        </div>
      </Section>

      <Section width="narrow" space="tight">
        <div className="flex flex-wrap gap-4">
          <Button href="/contact?service=mixing">Send me a song</Button>
          <Button href="/lessons" variant="secondary">
            See lessons
          </Button>
        </div>
      </Section>
    </>
  );
}
