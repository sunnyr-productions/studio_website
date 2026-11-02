import type { Metadata } from "next";
import Link from "next/link";
import { LazyCalEmbed } from "@/components/booking/LazyCalEmbed";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Faq } from "@/components/ui/Faq";
import { PhotoBanner, PhotoStrip } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Testimonials } from "@/components/ui/Testimonials";
import { getStudioPhotos, media } from "@/content/media";
import { lessonPages } from "@/content/lesson-pages";
import { lessonPricing, lessonTypes, pricingTiers } from "@/content/lessons";
import { homeVisitNote } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import { siteConfig } from "@/lib/site-config";
import { faqPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Guitar, Voice & Production Lessons in Corvallis, OR",
  description:
    "One-on-one guitar, voice, production and audio engineering lessons in Corvallis, Oregon and online, from an autistic, ADHD teacher. Starts with a $20 half-hour conversation.",
  alternates: { canonical: "/lessons" },
};

const link =
  "font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600";

const whatItsLike = [
  {
    title: "If you didn’t practice",
    body: "I won’t be upset, and there’s no minimum. Either something more important was going on, or I gave you something you didn’t want to work on, and then we need to find something you do. My own practice isn’t very organized either. Sometimes I run scales, and sometimes I put music on shuffle and try to work out the chords before the song ends.",
  },
  {
    title: "If it gets to be too much",
    body: "I pay close attention to body language, and we’ll lighten the load. It’s like a washing machine that’s too full: it struggles and makes loud noises, so you stop it, take some out, let it finish, and then give it more. Not to compare you to a washing machine. I don’t get upset easily, so I won’t make it worse.",
  },
  {
    title: "If you don’t know something",
    body: "Say so. If you already knew everything, you wouldn’t be seeing me. I’ll do the same. Experience doesn’t mean I know everything, but it does help me find the answer a little quicker.",
  },
  {
    title: "If something feels wrong for your hands or your voice",
    body: "Then we’ll look for what works for you, even if it doesn’t look like what I do. The internet is full of people selling the one right way to play. There’s a lot of them, so they can’t all be right.",
  },
];

const faqs = [
  {
    q: "Have you taught before?",
    a: "Private music lessons are new for me, so you’d be one of my first students. I taught parts to 12 to 16 singers at a time as music director of an a cappella group, and I tutor computer science now.",
  },
  {
    q: "Do you teach kids?",
    a: "Yes, from about potty-trained and up, and we can talk about younger kids with a parent there. Parents are always welcome to sit in and don’t have to. If your child needs accommodations, tell me ahead of time so I can prepare.",
  },
  {
    q: "Can you make my kid love it?",
    a: "No. I can make lessons as enjoyable as possible and build them around what your kid likes, but you can lead a horse to water. If what you want and what your kid wants don’t match, I’ll try to find a compromise.",
  },
  {
    q: "Do I need my own instrument?",
    a: "Not to start. You can use my guitars, bass or keyboard during lessons. If you stick with it, I’m happy to help you pick your own.",
  },
  {
    q: "In person or online?",
    a: "Either. Voice, production and engineering work well on video, over Microsoft Teams, and I can record the lesson if you ask. Guitar goes better in the room, because I can see your hands.",
  },
  {
    q: "When can you teach?",
    a: "Mostly weekday evenings and weekends, since I have a day job.",
  },
  {
    q: "What if I need to cancel?",
    a: `It’s free with at least ${lessonPricing.cancellationNoticeHours} hours’ notice. With less, there’s a ${lessonPricing.lateCancelPercent}% fee, and a no-show is the full lesson.`,
  },
  {
    q: "Do you teach piano?",
    a: "No. I know enough piano and theory to show you things, and I play bass too, but I’d rather send you to a real piano teacher.",
  },
];

export default function LessonsPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(faqs)} />

      <Section space="hero">
        <div className="max-w-3xl">
          <h1 className="font-display text-[clamp(2.5rem,3vw+1.75rem,4.25rem)] font-semibold leading-[1.08] tracking-tight text-ink-900">
            Music lessons in Corvallis, starting with what you want to play
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-700">
            That’s the first thing I’ll ask. I teach guitar, voice, music production and audio
            engineering, one-on-one, at my home studio in Southtown or online. I’m autistic and have
            ADHD, and I know what it’s like when lessons aren’t built for you.{" "}
            <Link href="/lessons/neurodivergent-learners" className={link}>
              More on how I teach neurodivergent students
            </Link>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="#book">Book a trial</Button>
            <Button href="/contact?service=lessons" variant="secondary">
              Ask a question
            </Button>
          </div>
        </div>
      </Section>

      <PhotoBanner photo={media.overlook} />

      <Section id="lesson-types" space="tight">
        <SectionHeading title="What I teach" />
        <ul className="mt-6 border-t border-ink-900/20">
          {lessonTypes.map((lesson) => (
            <li
              key={lesson.slug}
              className="grid gap-2 border-b border-ink-900/20 py-5 sm:grid-cols-[1fr_2fr_auto] sm:items-baseline sm:gap-6"
            >
              <h3 className="font-display text-xl font-semibold text-ink-900">{lesson.name}</h3>
              <p className="leading-relaxed text-ink-700">{lesson.blurb}</p>
              <Link href={`/lessons/${lessonPages[lesson.slug].pageSlug}`} className={link}>
                More
                <span className="sr-only"> about {lesson.name.toLowerCase()}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section width="narrow">
        <SectionHeading title="What lessons are like" />
        {whatItsLike.map((item) => (
          <div key={item.title} className="mt-8">
            <h3 className="font-display text-xl font-semibold text-ink-900">{item.title}</h3>
            <p className="mt-2 text-lg leading-relaxed text-ink-700">{item.body}</p>
          </div>
        ))}
      </Section>

      <Section width="narrow" space="tight">
        <SectionHeading title="The first lesson" />
        <p className="mt-4 text-lg leading-relaxed text-ink-700">
          It’s half an hour, it’s ${lessonPricing.trial.price}, and it’s mostly a conversation. I’ll
          ask why you want lessons and what you listen to. If you already play or sing, I’d love to
          hear something you enjoy. By the end, you’ll have a sense of how I teach, and I’ll have an
          idea of where to start. If I don’t think I’m the right teacher for you, I’ll tell you. I’m
          not here to just take your money.
        </p>
      </Section>

      <Section id="pricing">
        <SectionHeading title="What it costs" lede="One rate, whatever we’re working on." />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} accent={tier.accent} className="h-full">
              <h3 className="font-display text-lg font-semibold text-ink-900">{tier.name}</h3>
              <p className="mt-1 text-sm font-semibold text-marigold-800">{tier.price}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{tier.forWho}</p>
            </Card>
          ))}
        </div>
        <PhotoStrip photos={getStudioPhotos()} className="mt-10" />
        <p className="mt-8 max-w-3xl leading-relaxed text-ink-700">
          You pay at the lesson, by {lessonPricing.paymentMethods}. The full{" "}
          <Link href="/terms#lessons" className={link}>
            lesson policies
          </Link>{" "}
          are short.
        </p>
      </Section>

      <Section id="book" className="scroll-mt-4">
        <SectionHeading title="Book a trial lesson" />
        {siteConfig.calLink ? (
          <>
            <p className="mt-2 max-w-xl leading-relaxed text-ink-700">
              Pick any open time. You’ll get a confirmation email with the details.
            </p>
            <div
              style={{ borderRadius: "var(--radius-sketch-sm)" }}
              className="mt-8 overflow-hidden border-[1.5px] border-ink-900/20 bg-cream-50 shadow-[3px_4px_0_0_var(--sketch-shadow)]"
            >
              <LazyCalEmbed calLink={siteConfig.calLink} />
            </div>
          </>
        ) : (
          <Card accent="marigold" className="mt-8 max-w-2xl">
            <p className="leading-relaxed text-ink-700">
              Send me a note with what you’d like to learn and a few times that work, and I’ll reply
              with an open slot.
            </p>
            <Button href="/contact?service=lessons" className="mt-5">
              Request a lesson
            </Button>
          </Card>
        )}
      </Section>

      <Section width="narrow" space="tight">
        <SectionHeading title="Coming to the house" />
        <p className="mt-4 text-lg leading-relaxed text-ink-700">
          I’m in Southtown, in a residential neighborhood away from campus, with free street parking.
          I’ll send the address when you book. {homeVisitNote}
        </p>
      </Section>

      {testimonials.length > 0 && (
        <Section>
          <Testimonials />
        </Section>
      )}

      <Section id="faq">
        <Faq faqs={faqs} />
        <p className="mt-10 text-sm text-ink-500">
          Looking for mixing or recording instead?{" "}
          <Link href="/studio" className={link}>
            That’s over here
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
