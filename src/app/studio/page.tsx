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

const link = "link-drawn";

const faqs = [
  {
    q: "How long will it take?",
    a: `A first version within ${studioTerms.firstVersionWeeks} weeks, or sooner if you have a deadline. Bigger projects get their own schedule.`,
  },
  {
    q: "What’s a round of revisions?",
    a: `One list of all the changes you want. Every mix includes ${studioTerms.revisionRounds}, and extra rounds are $${extraRevisionFee} each.`,
  },
  {
    q: "How does payment work?",
    a: `You get a quote first. A ${depositPercent}% deposit holds your spot, and the rest is due before final files.`,
  },
  {
    q: "What files do I get?",
    a: "A WAV and an MP3, or any format you need. Stems and multitracks are an add-on.",
  },
  {
    q: "Should the same person mix and master?",
    a: `Ideally not, since fresh ears catch more. I’m happy to do both, from $${studioPrices.mixAndMaster} a song, if budget or simplicity matters more.`,
  },
];

export default function StudioPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(faqs)} />

      <Section space="hero">
        <HeroWithPhoto photo={getHeroPhotos().studio}>
          <p className="font-semibold tracking-[0.04em] text-periwinkle-700">
            Corvallis, Oregon, and remote
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,3vw+1.75rem,4.25rem)] font-semibold leading-[1.08] tracking-tight text-ink-900">
            Mixing, mastering and recording for independent musicians
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-700">
            I mix and master remotely and record at my home studio in Corvallis. I’ve been recording
            and mixing for about ten years and work as an audio engineer at a podcast studio, but
            client work is new for me. So my first five mixing clients pay
            ${introMix.price} a song instead of ${studioPrices.mixing}, in exchange for a testimonial.
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
            Before I change anything, I listen to your song and any references you send, and ask what
            you like about them. Then I make small, broad moves to bring out what’s already there. I
            trust my ears over formulas: if it sounds good, it sounds good.
          </p>
          <p>
            If you want to try an idea, we try it. If I disagree with a note, I’ll send your version
            and mine, and you choose.{" "}
            <Link href="/blog/mix-with-your-ears" className={link}>
              More on how I mix
            </Link>
            .
          </p>
        </div>
      </Section>

      <StageSection id="a-cappella" photo={media.stageGroup}>
        <SectionHeading title="If you sing a cappella" />
        <p className="mt-4 text-lg leading-relaxed text-ink-700">
          I was music director of On the Rocks at the University of Oregon, where I arranged, taught
          parts and helped produce the vocals on our album <em>In the Groove</em>. I can arrange for
          your group, make part tapes for learning, or run your vocal sessions. OSU groups, I’m
          local.
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
            You’ll have a quote within {siteConfig.responseTime.studio}. Want to learn instead?{" "}
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
