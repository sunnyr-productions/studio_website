import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { PhotoStrip } from "@/components/ui/Photo";
import { getStudioPhotos } from "@/content/media";
import raulHeadshot from "../../../public/images/raul-headshot.jpg";

export const metadata: Metadata = {
  title: "About Raul, Music Teacher & Audio Engineer in Corvallis",
  description:
    "Meet Raul: guitarist, singer, and audio engineer teaching lessons and mixing records from a home studio in Corvallis, Oregon.",
  alternates: { canonical: "/about" },
};

const gearGroups = [
  {
    title: "Room, monitoring & recording",
    items: [
      "DIY-treated home studio (Corvallis, OR)",
      "Tascam 2x2 audio interface",
      "PreSonus Eris Studio 5 monitors",
      "HiFi-Man HE400i planar magnetic headphones",
      "Zoom H2 portable recorder",
    ],
  },
  {
    title: "Instruments on hand",
    items: [
      "Music Man StingRay 5-string bass",
      "Fender Stratocaster",
      "Epiphone Les Paul 100",
      "Banjitar (banjo-guitar)",
      "Taylor 12e acoustic-electric guitar",
      "MIDI piano controllers & drum pads",
    ],
  },
  {
    title: "Software & plugins",
    items: [
      "Logic Pro X",
      "FabFilter (complete collection)",
      "SoundToys (complete collection)",
      "Waves, UAD, GoodHertz, and classic analog-gear emulations",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <Section pattern="waveform" space="page">
        <div className="grid gap-10 sm:grid-cols-[240px_1fr] sm:items-start">
          <div className="relative h-48 w-48 overflow-hidden rounded-full ring-2 ring-marigold-200 shadow-[3px_4px_0_0_var(--sketch-shadow)] sm:h-60 sm:w-60">
            <Image
              src={raulHeadshot}
              alt="Raul, the teacher and engineer behind The sunny*r Studio"
              fill
              sizes="(min-width: 640px) 15rem, 12rem"
              placeholder="blur"
              className="object-cover"
              priority
            />
          </div>

          <div className="max-w-[68ch]">
            <h1
              className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl"
            >
              Hi, I’m Raul
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              He/they. sunny*r is pronounced “sunnier.”
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              I’ve been a musician my entire life. There are home videos of me crawling on the floor with socks on my hands, singing Christmas carols with my brother before I could form full words. According to my parents, the only public tantrum I ever threw was at age two, over a First Act guitar on a shelf at Target.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              I started guitar lessons at 10, wanting to play Green Day. My teacher, a pretentious guy who saw himself as the next great classical guitarist, wasn’t interested in teaching anything but classical. He double-parked his car every time, and he once told me to tell my mom to stop giving him ties for Christmas. He wasn’t the only one, either: I’ve had more bad music teachers than good ones.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              The good ones made up for it. My next guitar teacher was honestly more interested in being a rock star, but he would listen to any song I brought in, figure it out by ear, and write out a tab for me. I thought that was so cool that I learned to do it myself. In middle and high school, my favorite teachers were my choir teachers. Choir was my escape from the stress of school, and they let me play the classroom piano, since I didn’t have one at home. Later, another guitar teacher listened to me play “Little Wing” and told me, “That’s correct, but it doesn’t feel like music.”
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              In college, I joined On the Rocks, an a cappella group at the University of Oregon, and became its music director. The first time I stood in front of a room of mostly older guys to teach a song, I was terrified, and getting 12 to 16 singers on the same page was a lot like herding cats. I arranged our version of{" "}
              <a
                href="https://open.spotify.com/track/2QffWR8a0kvTPZUYuZMB4A"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600"
              >
                “Move Me”
              </a>{" "}
              and helped produce the vocals on our album <em>In the Groove</em>. I also sang in a wedding band during those years, which is how I came to sing “Wobble” off a lyric sheet, in a suit, to someone’s grandmother.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              Today I do audio and software engineering at a podcast studio, and at home I make my own music as sunny*r. I’m just starting to teach music lessons and to mix and master for other artists, and all those teachers have shaped how I want to do it. I don’t want to be a scary teacher. If you forget to do last week’s work, that’s fine. What I care about is whether you’re learning, and how you learn best.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          title="The room and the gear"
          lede="I got lucky with the room. We moved into a house that happened to have a bedroom the right size for a small studio, and I found a really good deal on acoustic panels on Facebook Marketplace."
        />
        <div className="mt-6 max-w-[68ch] space-y-4 leading-relaxed text-ink-700">
          <p>
            The one instrument I’d save in a fire is my Strat. I was impatient as a kid and wanted it to look like John Frusciante’s, so I sanded it down myself. Since then it’s been my project guitar. I learned guitar repair on it, from changing the wiring to shielding the pickup cavity, and it’s the guitar I know best.
          </p>
          <p>
            The banjitar was another Facebook Marketplace find. It’s a banjo with six strings, tuned like a guitar. I wanted that tone for my productions, and I’m not too concerned about being the best banjitar player in the world.
          </p>
          <p>
            I also bring a little field microphone when my wife and I go to national parks. When we find a small, cavernous space, I wait until no one’s walking by, set the microphone down and clap. I can turn that recording into a reverb, so a place we visited can end up on a song.
          </p>
        </div>
        <PhotoStrip photos={getStudioPhotos()} className="mt-10" />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {gearGroups.map((group, i) => (
            <div key={group.title}>
              <Card accent={(["periwinkle", "coral", "marigold"] as const)[i % 3]} className="h-full">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-periwinkle-700">
                  {group.title}
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm text-ink-700">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-periwinkle-600">
                        &bull;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>
      </Section>

      <Section space="tight">
        <CtaPanel
          title="Want to work together?"
          body="Book a lesson, or tell me about the song you’re working on."
        >
          <Button href="/lessons#book">Book a lesson</Button>
          <Button href="/studio" variant="secondary">
            Mixing &amp; mastering
          </Button>
        </CtaPanel>
      </Section>
    </>
  );
}
