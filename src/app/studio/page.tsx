import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Testimonials } from "@/components/ui/Testimonials";
import { servicePages } from "@/content/service-pages";
import { services, studioTerms } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import { siteConfig } from "@/lib/site-config";
import { faqPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Mixing, Mastering & Recording in Corvallis, OR",
  description:
    "Mixing from $175 a song, mastering from $60 a track, and recording in Corvallis, Oregon or remotely. My first five mixing clients pay $125 a song.",
  alternates: { canonical: "/studio" },
};

const { depositPercent, extraRevisionFee, firstVersionWeeks, introMix, revisionRounds } = studioTerms;

const link =
  "font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600";

const faqs = [
  {
    q: "How long does it take?",
    a: `You’ll have a first version of a mix within ${firstVersionWeeks} weeks, and I can often go quicker if you need it. For an EP or album, we’ll agree on a timeline first.`,
  },
  {
    q: "How do revisions work?",
    a: `${revisionRounds} rounds are included on every mix. A round is one list of notes sent together, and extra rounds are $${extraRevisionFee} each.`,
  },
  {
    q: "How do I pay?",
    a: `I’ll quote it before I start. It’s ${depositPercent}% up front and the rest before I send final files.`,
  },
  {
    q: "What do I get at the end?",
    a: "WAV and MP3 files. Stems or multitracks can be added on. After a recording session, you get your multitracks and a rough bounce the same week.",
  },
  {
    q: "Should the same person mix and master?",
    a: "Ideally not, because a fresh pair of ears catches things. If your budget allows for a separate mastering engineer, I’d encourage it. If budget or simplicity matters more, I’ll do both from $210 a song.",
  },
];

export default function StudioPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(faqs)} />

      <Section space="hero">
        <div className="max-w-3xl">
          <p className="font-semibold tracking-[0.04em] text-periwinkle-700">
            Mixing, mastering and recording in Corvallis, Oregon, and remotely
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,3vw+1.75rem,4.25rem)] font-semibold leading-[1.08] tracking-tight text-ink-900">
            Send me your song, and tell me what you want it to do
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-700">
            I’m new to doing this for clients. I’ve mixed my own releases and projects with friends,
            and audio is part of my day job, but I don’t have a client list to show you. So my first five mixing
            clients pay ${introMix.price} a song instead of $175, in
            exchange for a testimonial and permission to show the work.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/contact?service=mixing">Be one of the five</Button>
            <Button href="/music" variant="secondary">
              Hear my work
            </Button>
          </div>
        </div>
      </Section>

      <Section id="services" space="tight" className="scroll-mt-4">
        <SectionHeading title="What I do" />
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
        <SectionHeading title="What working with me is like" />
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-700">
          <p>
            Before I touch anything, I listen to your song the way you sent it and ask what you want
            from it. Mixing to me is like sculpting: the emotion is already in there, and I’m carving
            away to expose it.
          </p>
          <p>
            I’ll try anything you ask for, because the only bad idea is an unexplored one. If I think
            a note hurts the song, I’ll still give you your version, and I’ll give you mine too.
          </p>
          <p>
            And I mix with my ears. There’s plenty of advice online about what a vocal EQ curve is
            supposed to look like, and I followed a lot of it, until I noticed that nobody listens to
            a curve. I wrote about that, and about{" "}
            <Link href="/blog/the-song-i-mixed-twice" className={link}>
              the song I had to mix twice
            </Link>
            .
          </p>
        </div>
      </Section>

      <Section width="narrow" space="tight" id="a-cappella">
        <SectionHeading title="A cappella groups" />
        <p className="mt-4 text-lg leading-relaxed text-ink-700">
          I spent college as music director of On the Rocks at the University of Oregon. I taught the
          parts, ran rehearsals, arranged our version of “Move Me,” and helped produce the vocals on
          our album <em>In the Groove</em>, which mostly meant helping everyone sing like they did in
          the garage where we rehearsed. If your group needs an arrangement, part tapes, or someone
          to run vocals in a session, I’d love to hear from you. That includes groups at OSU.
        </p>
      </Section>

      {testimonials.length > 0 && (
        <Section>
          <Testimonials />
        </Section>
      )}

      <Section id="faq">
        <Faq faqs={faqs} />
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/contact?service=mixing">Tell me about your song</Button>
          <p className="text-sm text-ink-500">
            I’ll send a quote within {siteConfig.responseTime.studio}. Looking for{" "}
            <Link href="/lessons" className={link}>
              lessons
            </Link>{" "}
            instead?
          </p>
        </div>
      </Section>
    </>
  );
}
