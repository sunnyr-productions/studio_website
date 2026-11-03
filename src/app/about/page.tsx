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
  description: "How a kid who dreaded music lessons ended up teaching them.",
  alternates: { canonical: "/about" },
};

const link =
  "font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600";

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
  { photo: media.polaroid, caption: "On the Rocks, on some rocks", tilt: "-rotate-2", placement: "lg:col-start-1" },
  { photo: media.band, caption: "The wedding band, dressed for “Wobble”", tilt: "rotate-1", placement: "lg:col-start-1" },
  {
    photo: media.arena,
    caption: "On the Rocks at center court",
    print: "night",
    tilt: "-rotate-1",
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
            aspect="aspect-[4/5]"
            sizes="(min-width: 1024px) 374px, 272px"
            preload
            className="w-64 lg:w-full"
          />

          <div className="max-w-[68ch] lg:row-span-2">
            <h1
              className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl"
            >
              About Raul
            </h1>
            <p className="mt-2 text-sm text-ink-500">He/they.</p>
            <p className="mt-4 leading-relaxed text-ink-700">
              My parents say I only ever threw one tantrum in public. I was two, and the cause was a First Act guitar on a store shelf (at Target, we think). I was already singing by then. There’s home video of me crawling around with socks on my hands, joining in on Christmas carols with my brother before I had all the words. The house ran on music: Eric Clapton CDs, Bollywood soundtracks, and ghazals, which are poems sung in Urdu or Hindi.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              I started Indian classical voice lessons at around eight, and they gave me lots of practice, if not much else. At ten I talked my way into guitar lessons by pointing out that the music store was right next to my taekwondo place. The first thing I learned was “Happy Birthday,” which I proudly played at a friend’s tenth birthday, and the first real song I remember butchering was “Sunshine of Your Love.” Given the name I ended up with, I find that pretty funny.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              My teachers were all over the map. My first guitar teacher had big classical plans for himself and no interest in the punk I wanted to play, and he double-parked every week and once sent word through me that my mom should stop buying him ties. The next one mostly wanted to be a rock star, but he’d take any song I brought in, work it out by ear and write it down for me. Watching that made me want to do it too, so I learned.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              Choir is where things turned around. My middle and high school choir teachers ran the one room in the building where I could relax, and they let me loose on the classroom piano, since we didn’t have one at home. AP music theory then showed me that music was full of patterns, the same comforting kind I liked in math. And somewhere along the way, a guitar teacher heard my flawless “Little Wing” and told me it didn’t feel like music, which was the first time anyone had asked me for more than accuracy.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              None of that fixed the other problem. I still couldn’t keep a practice routine, I still showed up ashamed, and I had no idea why until I was diagnosed autistic and ADHD as an adult. I try to remember that kid whenever a student tells me they didn’t get to it this week.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              In college I auditioned for On the Rocks at the University of Oregon and announced that I was a baritone. The music director told me otherwise, and I ended up the highest tenor in the group. Before my freshman year was out, he’d also decided I should take over from him, and I can still remember how terrified I was the first time I stood in front of those mostly older guys to teach them a song. We had 12 to 16 singers at a time, some into country and some into rap, reading music at very different levels. So I made part tapes, leaned hard on analogies, and got a lot of practice at explaining one thing six ways. We kept going through the pandemic by directing remotely. I also took classes where we spliced actual tape and mixed on a console. I arranged our version of{" "}
              <a
                href="https://open.spotify.com/track/2QffWR8a0kvTPZUYuZMB4A"
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                “Move Me”
              </a>{" "}
              and helped produce the vocals on our album <em>In the Groove</em>.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              I sang in a wedding band as well, which is how I came to read the lyrics of “Wobble” off a sheet, in a suit, to someone’s grandmother. Nobody at a wedding came to hear you. They came for the couple, and your job is to help the room feel something on their behalf. I’ve thought of music as a kind of service ever since, and I think that’s why I like teaching and mixing as much as performing.
            </p>
            <p className="mt-4 leading-relaxed text-ink-700">
              I’ve lived in Corvallis for about three years. My day job at a podcast studio is part audio and part software engineering, I tutor computer science on the side, and I write my own music as sunny*r. Lessons and client mixing are the newest things I’m doing, which is why you’re reading this.{" "}
              <Link href="/music" className={link}>
                Hear some of the music
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
            I needed an artist name one night in my now-wife’s college apartment, after playing everyone a song I was working on. I wanted something with sun in it, partly because a warm marigold yellow has always been my favorite color. I was joking about those names with a symbol in the middle when we landed on one that works twice: say it and it’s “sunnier,” spell it out and it’s “sunny R,” as in Raul. It was spelled sunny.r for a while, until I decided an asterisk looked more like a star, and it became sunny*r.
          </p>
          <p>
            I drew the logo at an awful office job where there wasn’t enough work and you had to look busy anyway. It’s an ambigram, so it reads the same upside down, and I filled a lot of paper before I found a pattern that worked.
          </p>
        </div>
      </Section>

      <Section>
        <SectionHeading
          title="The room and what’s in it"
          lede="The room is a stroke of luck. Our house happened to come with a bedroom the right size, and I found acoustic panels cheap on Facebook Marketplace, then spent a while measuring out where the monitors should go."
        />
        <div className="mt-6 max-w-[68ch] space-y-4 leading-relaxed text-ink-700">
          <p>
            Marketplace also gave me the banjitar, which has a banjo’s sound and a guitar’s tuning. I’m after the tone for my productions and have no plans to become a great banjitar player.
          </p>
          <p>
            If there were a fire, I’d grab my Strat. As an impatient kid, I sanded it down to look like John Frusciante’s, and it has been my test subject ever since. New wiring, a shielded pickup cavity and locking tuners all happened on that guitar, and it’s how I learned to fix things.
          </p>
          <p>
            My favorite odd habit involves a small field recorder. On trips to national parks with my wife, I look for little cave-like spots, wait for the hikers to pass, and record myself clapping. With some processing, that clap becomes a reverb I can use on a track, so a place we’ve been can end up inside a song.
          </p>
        </div>
        <PhotoStrip
          photos={[...getStudioPhotos(), media.taylor, media.stratBridge]}
          className="mt-10"
        />
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
    </>
  );
}
