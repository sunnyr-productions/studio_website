import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import raulHeadshot from "../../../public/images/raul-headshot.jpg";

export const metadata: Metadata = {
  title: "About",
  description: "Get to know Raul, the teacher and engineer behind The sunny*r Studio.",
  alternates: { canonical: "/about" },
};

const gearGroups = [
  {
    title: "Room & monitoring",
    items: [
      "DIY-treated home studio (Corvallis, OR)",
      "Tascam 2x2 audio interface",
      "PreSonus Eris Studio 5 monitors",
      "HiFi-Man HE400i planar magnetic headphones",
    ],
  },
  {
    title: "Mics & recording",
    items: [
      "Cardioid dynamic mic",
      "Large-diaphragm condenser (LDC)",
      "Small-diaphragm condenser (SDC) pair",
      "Omnidirectional dynamic mic",
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
      "FabFilter — complete collection",
      "SoundToys — complete collection",
      "Waves, UAD, GoodHertz, and classic analog-gear emulations",
    ],
  },
];

export default function AboutPage() {
  return (
    <Section pattern="waveform" className="pt-16">
      <div className="grid gap-10 sm:grid-cols-[240px_1fr] sm:items-start">
        <div className="animate-fade-up animate-float relative h-48 w-48 overflow-hidden rounded-full ring-2 ring-marigold-200 shadow-[3px_4px_0_0_var(--sketch-shadow)] sm:h-60 sm:w-60">
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

        <div>
          <h1
            style={{ animationDelay: "80ms" }}
            className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-ink-900"
          >
            About The sunny*r Studio
          </h1>
          <p
            data-mode-only="lessons"
            style={{ animationDelay: "110ms" }}
            className="animate-fade-up mt-4 font-display text-lg italic leading-relaxed text-marigold-800"
          >
            The short version: I teach the way I wish I&apos;d been taught — patiently, and
            around what you actually want to play.
          </p>
          <p
            data-mode-only="studio"
            style={{ animationDelay: "110ms" }}
            className="animate-fade-up mt-4 font-display text-lg italic leading-relaxed text-periwinkle-700"
          >
            The short version: audio engineering is my full-time job, and I bring that same ear
            to your record.
          </p>
          <p style={{ animationDelay: "140ms" }} className="animate-fade-up mt-4 leading-relaxed text-ink-700">
            I&apos;m Raul — a musician for as long as I can remember. I was singing before I
            could speak in full sentences, I&apos;ve been playing guitar for 16 years, writing
            and producing music for 10, and recording and engineering for 7. Music has never
            been a side interest for me; it&apos;s just how I&apos;m wired.
          </p>
          <p className="mt-4 leading-relaxed text-ink-700">
            I was Music Director of <em>On the Rocks</em>, a men&apos;s a cappella group at the
            University of Oregon, where I coached vocal technique alongside performance and
            stage presence — and I sang in a wedding and event band during college. These days I
            work full-time as an audio and software engineer for a podcasting production
            company, which keeps the technical side of my ear sharp day to day.
          </p>
          <p className="mt-4 leading-relaxed text-ink-700">
            I&apos;m neurodivergent, and I work especially well with students who&apos;ve had a
            hard time learning in more traditional settings — but honestly, I just like working
            with people, so I&apos;m open to teaching anyone. My own music teachers were always
            my most impactful ones growing up, and I try to pay that forward: I&apos;m not a
            strict or rigid teacher. Lessons follow <em>your</em> interests and your pace, not a
            fixed curriculum. Folk, pop, indie, alternative, R&amp;B, funk — whatever you&apos;re
            into, we&apos;ll build on it.
          </p>
          <p className="mt-4 leading-relaxed text-ink-700">
            Lessons happen at my sound-treated home studio in Corvallis, OR, or online — and
            when a student (or anyone else) is ready to record, mix, or master something, that
            same studio and experience carries over into client work.
          </p>

          <Reveal delay={100}>
            <Card accent="marigold" className="mt-8">
              <h2 className="font-display text-lg font-semibold text-ink-900">Studio & gear</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {gearGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-periwinkle-700">
                      {group.title}
                    </h3>
                    <ul className="mt-2 space-y-1 text-sm text-ink-700">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span aria-hidden="true" className="text-periwinkle-600">
                            &bull;
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          <p className="mt-8 font-display text-lg italic text-marigold-800">
            Good things grow on the sunny*r side — bring whatever you&apos;re working on, and
            let&apos;s see what it grows into.
          </p>

          <div className="mt-4 flex flex-wrap gap-4">
            <span data-mode-only="lessons" className="contents">
              <Button href="/lessons">Book a lesson</Button>
              <Button href="/contact" variant="secondary">
                Say hello
              </Button>
            </span>
            <span data-mode-only="studio" className="contents">
              <Button href="/contact">Get a quote</Button>
              <Button href="/portfolio" variant="secondary">
                Hear the work
              </Button>
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
