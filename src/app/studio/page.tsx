import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { HeroWithPhoto, StageSection } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Testimonials } from "@/components/ui/Testimonials";
import { getHeroPhotos, media } from "@/content/media";
import { servicePages } from "@/content/service-pages";
import { services, studioPrices, studioTerms } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import { siteConfig } from "@/lib/site-config";
import { faqPageSchema } from "@/lib/structured-data";

const { depositPercent, extraRevisionFee, introMix } = studioTerms;

export const metadata: Metadata = {
  title: "Mixing, Mastering & Recording in Corvallis, OR",
  description: `Mixing from $${studioPrices.mixing} a song, mastering from $${studioPrices.mastering} a track and recording from $${studioPrices.recording} an hour. First five mixing clients pay $${introMix.price}.`,
  alternates: { canonical: "/studio" },
};

const link =
  "font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600";

const faqs = [
  {
    q: "How long will it take?",
    a: "I’ll get you a first mix within two weeks, sooner if you have a deadline. Bigger projects get their own schedule.",
  },
  {
    q: "What’s a round of revisions?",
    a: `Everything you want changed, sent together in one list. Two rounds come with every mix, and more are $${extraRevisionFee} each.`,
  },
  {
    q: "How does payment work?",
    a: `You get a quote first. A ${depositPercent}% deposit books your spot, and you pay the rest before I send final files.`,
  },
  {
    q: "What files do I get?",
    a: "A WAV and an MP3 of the finished song, plus any other format you need. Stems or multitracks cost extra. If you recorded here, the multitracks and a rough bounce reach you that same week.",
  },
  {
    q: "Should one person mix and master?",
    a: `A different person is better, since new ears catch what mine have stopped hearing. I’m happy to do both from $${studioPrices.mixAndMaster} a song when budget or simplicity wins.`,
  },
];

export default function StudioPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(faqs)} />

      <Section space="hero">
        <HeroWithPhoto photo={getHeroPhotos().studio} accent="periwinkle">
          <p className="font-semibold tracking-[0.04em] text-periwinkle-700">
            Corvallis, Oregon, and remote
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,3vw+1.75rem,4.25rem)] font-semibold leading-[1.08] tracking-tight text-ink-900">
            Mixing, mastering and recording for independent musicians
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-700">
            The first thing I’ll ask about your song is what you want it to do to people. The first
            thing you should ask me is who I’ve worked for, and the honest answer is mostly myself and
            my friends. I’ve been recording and mixing since my teens, and audio is part of my job at
            a podcast studio, but I haven’t run this as a business before. So I’m charging my first
            five mixing clients ${introMix.price} a song, down from ${studioPrices.mixing}, and asking
            each of them for a testimonial and the OK to share the result.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/contact?service=mixing">Send me a song</Button>
            <Button href="/music" variant="secondary">
              Hear some music
            </Button>
          </div>
        </HeroWithPhoto>
      </Section>

      <Section id="services" space="tight" className="scroll-mt-4">
        <SectionHeading title="What I can do for you" />
        <ul className="mt-6 border-t border-ink-900/20">
          {services.map((service) => (
            <li
              key={service.slug}
              id={service.slug}
              className="grid scroll-mt-4 gap-2 border-b border-ink-900/20 py-5 sm:grid-cols-[1fr_2fr_auto] sm:items-baseline sm:gap-6"
            >
              <div>
                <h3 className="font-display text-xl font-semibold text-ink-900">{service.name}</h3>
                <p className="mt-1 text-sm font-semibold text-marigold-800">{service.startingPrice}</p>
              </div>
              <p className="leading-relaxed text-ink-700">{service.blurb}</p>
              {servicePages[service.slug] ? (
                <Link href={`/studio/${service.slug}`} className={link}>
                  More
                  <span className="sr-only"> about {service.name.toLowerCase()}</span>
                </Link>
              ) : (
                <Link href={`/contact?service=${service.slug}`} className={link}>
                  Ask
                  <span className="sr-only"> about {service.name.toLowerCase()}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section width="narrow">
        <SectionHeading title="How I work on a song" />
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-700">
          <p>
            For the first while, I don’t touch a single plugin. I get the session organized, listen
            all the way through to exactly what you sent, and play any reference tracks you included,
            because I want to know whether it’s the tone of that record you love or the way its
            guitars sit. Then I work from the big picture inward, with small moves on whole groups of
            tracks. I think of it like a block of marble: your song’s already in there, and too much
            chiseling is how you lose it.
          </p>
          <p>
            If you hear something I don’t, we try it. Ideas are cheap to test, and I’m wrong often
            enough to want to find out. When I truly disagree with a note, you’ll get the version you
            asked for along with the one I’d pick, and you decide.
          </p>
          <p>
            You can read about what I’ve learned the hard way in{" "}
            <Link href="/blog/the-song-i-mixed-twice" className={link}>
              the song I released twice
            </Link>{" "}
            and my complaint about{" "}
            <Link href="/blog/mix-with-your-ears" className={link}>
              mixing by eye
            </Link>
            .
          </p>
        </div>
      </Section>

      <StageSection id="a-cappella" photo={media.stageGroup}>
        <SectionHeading title="If you sing a cappella" />
        <p className="mt-4 text-lg leading-relaxed text-ink-700">
          We should talk. I was music director of On the Rocks at the University of Oregon, where I
          taught every part, ran rehearsals, arranged “Move Me” and helped produce the vocals on our
          album <em>In the Groove</em>. Singers who sounded great in our rehearsal garage tended to
          tighten up once they had headphones on, so much of my job was getting them back to that
          garage in their heads. I can write you an arrangement, make part tapes that put your line in
          one ear and the group in the other, or run your vocal session. OSU groups, I’m right here in
          town.
        </p>
      </StageSection>

      {testimonials.length > 0 && (
        <Section>
          <Testimonials />
        </Section>
      )}

      <Section id="faq">
        <Faq faqs={faqs} />
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/contact?service=mixing">Send me a song</Button>
          <p className="text-sm text-ink-500">
            Expect a quote within {siteConfig.responseTime.studio}. Want to learn instead?{" "}
            <Link href="/lessons" className={link}>
              See lessons
            </Link>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
