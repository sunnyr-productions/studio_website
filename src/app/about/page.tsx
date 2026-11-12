import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Photo, PhotoStrip } from "@/components/ui/Photo";
import { Scrapbook, type ScrapbookItem } from "@/components/ui/Scrapbook";
import { getStudioPhotos, media } from "@/content/media";

export const metadata: Metadata = {
  title: "About Raul, Music Teacher & Audio Engineer in Corvallis",
  description:
    "Raul is a music teacher, audio engineer and songwriter in Corvallis, Oregon.",
  alternates: { canonical: "/about" },
};

const link = "link-drawn";

// Instruments stay general on purpose: students visit the house, so no makes and models.
const gearGroups = [
  {
    title: "Monitoring",
    items: ["PreSonus Eris Studio 5 monitors", "HiFi-Man HE400i headphones"],
  },
  {
    title: "Instruments on hand",
    items: [
      "Electric, acoustic and classical guitars",
      "A 5-string bass",
      "A banjitar",
      "Akai MPK Mini, a gift from my brother and still on my desk",
    ],
  },
  {
    title: "Software",
    items: ["Logic Pro"],
  },
];

const scrapbook: ScrapbookItem[] = [
  { photo: media.polaroid, caption: "On the Rocks, on some rocks", tilt: -2, placement: "lg:col-start-1" },
  { photo: media.band, caption: "With the wedding band", tilt: 1.5, placement: "lg:col-start-1" },
  {
    photo: media.arena,
    caption: "On the Rocks at center court",
    print: "night",
    tilt: -1,
    // Small source (960px wide), so this keeps it from going soft on sharp screens.
    placement: "lg:col-start-2 lg:max-w-xl lg:self-center",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section space="page">
        <div className="grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto]">
          <Photo
            photo={media.portrait}
            frame="medallion"
            sizes="(min-width: 1024px) 323px, 238px"
            preload
            // The margins leave room for the rays, which reach past the photo.
            className="m-8 w-56 lg:mx-auto lg:my-10 lg:w-[19rem]"
          />

          <div className="max-w-[68ch] lg:row-span-2">
            <h1
              className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl"
            >
              About Raul
            </h1>
            <p className="mt-2 text-sm text-ink-500">He/they.</p>
            <p className="mt-4 leading-relaxed text-ink-700">
              I’ve been singing for as long as I can remember and started guitar lessons at ten. Choir carried me through middle and high school, and music theory showed me how much music runs on patterns, which is still how I like to explain it.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              I’m autistic and ADHD, and I wasn’t diagnosed until adulthood. As a kid I struggled to keep up with practice and often felt behind in lessons. That’s a big part of why I teach the way I do.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              At the University of Oregon, I was music director of the a cappella group On the Rocks. I taught parts to 12 to 16 singers, ran rehearsals, arranged our version of{" "}
              <a
                href="https://open.spotify.com/track/2QffWR8a0kvTPZUYuZMB4A"
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                “Move Me”
              </a>{" "}
              and helped produce the vocals on our album <em>In the Groove</em>. I also studied audio engineering, and later sang in a wedding band.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              I’ve lived in Corvallis for about three years. By day I work at a podcast studio, in audio and software engineering. I also tutor computer science and write my own music as sunny*r, mostly guitar-based indie pop.{" "}
              <Link href="/music" className={link}>
                Hear some of my music
              </Link>
              .
            </p>
          </div>

          <Scrapbook items={scrapbook} className="lg:contents" />
        </div>
      </Section>

      <Section width="narrow" space="tight">
        <SectionHeading title="About the name" />
        <div className="mt-6 space-y-4 leading-relaxed text-ink-700">
          <p>
            It’s pronounced “sunnier.” Spelled out, it’s also “sunny R,” as in Raul, and the asterisk
            stands in for a star. The logo is an ambigram, so it reads the same upside down.
          </p>
        </div>
      </Section>

      <Section>
        <SectionHeading
          title="The room and what’s in it"
          lede="A converted bedroom in our house, treated with acoustic panels and set up for recording and mixing."
        />
        <PhotoStrip
          photos={[
            ...getStudioPhotos(),
            { ...media.taylor, label: "My acoustic" },
            { ...media.stratBridge, label: "My electric" },
          ]}
          className="mt-10"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {gearGroups.map((group, i) => (
            <div key={group.title}>
              <Card accent={(["periwinkle", "coral", "marigold"] as const)[i % 3]} className="h-full">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-periwinkle-700">
                  {group.title}
                </h3>
                <ul className="list-asterisk mt-3 space-y-1.5 text-sm text-ink-700">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
