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
import { testimonials } from "@/content/testimonials";
import { siteConfig } from "@/lib/site-config";
import { faqPageSchema } from "@/lib/structured-data";

const { cancellationNoticeHours, lateCancelPercent, paymentMethods, trial } = lessonPricing;

export const metadata: Metadata = {
  title: "Guitar, Voice & Production Lessons in Corvallis, OR",
  description: `One-on-one lessons built around the music you love, from an autistic, ADHD teacher. In Southtown Corvallis or online, with a $${trial.price} trial.`,
  alternates: { canonical: "/lessons" },
};

const link = "link-drawn";

const faqs = [
  {
    q: "Do you teach kids?",
    a: "Yes, from about potty-training age. For younger kids, let’s talk first, and a parent should stay. Parents are always welcome to sit in.",
  },
  {
    q: "My kid has quit lessons before. Will this be different?",
    a: "I can’t make anyone love music. I can build lessons around what your kid is into and never shame them for missed practice.",
  },
  {
    q: "Am I too old to start?",
    a: "No. We’ll set the pace around your goals and your schedule.",
  },
  {
    q: "Do I need an instrument?",
    a: "Not to start. I have guitars, a bass, a keyboard and microphones you can use here.",
  },
  {
    q: "Can we do this online?",
    a: "Yes for voice, production and audio engineering. Guitar works best in person, where I can see your hands. I can record online lessons if you’d like.",
  },
  {
    q: "When are you available?",
    a: "Weekday evenings, with more openings on weekends.",
  },
  {
    q: "Do you teach piano?",
    a: "No. I play enough keyboard for my own productions, but you deserve a teacher who really plays.",
  },
  {
    q: "Do you teach bass?",
    a: "Only as an add-on for current students. If bass is your main instrument, a specialist will serve you better.",
  },
];

export default function LessonsPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(faqs)} />

      <Section space="hero">
        <div className="max-w-3xl">
          <h1 className="font-display text-[clamp(2.5rem,3vw+1.75rem,4.25rem)] font-semibold leading-[1.08] tracking-tight text-ink-900">
            Guitar, voice and music production lessons in Corvallis
          </h1>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-700">
            <p>
              One-on-one lessons for any level, at my home studio in Corvallis’s Southtown
              neighborhood or over video. We start
              with music you love and build the skills from there.
            </p>
            <p>
              I’m autistic and ADHD, and I teach with that in mind.{" "}
              <Link href="/lessons/neurodivergent-learners" className={link}>
                How that shapes my lessons
              </Link>
              . I’m also new to private music lessons. I’ve directed an a cappella group and tutored
              computer science, but you’d be one of my first one-on-one music students.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="#book">Book a ${trial.price} trial</Button>
            <Button href="/contact?service=lessons" variant="secondary">
              Ask me something
            </Button>
          </div>
        </div>
      </Section>

      <PhotoBanner photo={media.overlook} />

      <Section id="lesson-types" space="tight">
        <SectionHeading title="What you can learn" />
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
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-700">
          <p>
            Each lesson follows a loose plan that adapts to what you need that day. I explain things
            with analogies, and if one doesn’t click, I’ll find another.
          </p>
          <p>
            There’s no minimum practice time, and you won’t get in trouble for a missed week. If
            practice isn’t happening, that tells me the material needs to change.
          </p>
        </div>
      </Section>

      <Section width="narrow" space="tight">
        <SectionHeading title="Your first half hour" />
        <p className="mt-4 text-lg leading-relaxed text-ink-700">
          The ${trial.price} trial is mostly a conversation about what you want to learn and what you
          listen to. If you already play or sing, bring something to show me. If I don’t think I’m
          the right teacher for you, I’ll say so.
        </p>
      </Section>

      <Section id="pricing">
        <SectionHeading title="Prices" lede="Same price for every subject." />
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
          Pay at the lesson with {paymentMethods}. Cancelling or rescheduling is free with{" "}
          {cancellationNoticeHours} hours’ notice. After that it’s {lateCancelPercent}%, and a no-show
          is the full price. Details are in the{" "}
          <Link href="/terms#lessons" className={link}>
            policies
          </Link>
          .
        </p>
      </Section>

      <Section id="book" className="scroll-mt-4">
        <SectionHeading title="Pick a time" />
        {siteConfig.calLink ? (
          <>
            <p className="mt-2 max-w-xl leading-relaxed text-ink-700">
              Pick any open slot, and you’ll get the details by email.
            </p>
            <div
              style={{ borderRadius: "var(--radius-sketch-sm)" }}
              className="card mt-8 overflow-hidden bg-cream-50"
            >
              <LazyCalEmbed calLink={siteConfig.calLink} />
            </div>
          </>
        ) : (
          <Card accent="marigold" className="mt-8 max-w-2xl">
            <p className="leading-relaxed text-ink-700">
              Tell me what you’d like to learn and when you’re free, and I’ll find a time.
            </p>
            <Button href="/contact?service=lessons" className="mt-5">
              Request a time
            </Button>
          </Card>
        )}
      </Section>

      <Section width="narrow" space="tight">
        <SectionHeading title="Coming over" />
        <p className="mt-4 text-lg leading-relaxed text-ink-700">
          The studio is in Southtown Corvallis, within biking distance of campus, with free street
          parking.
          You’ll get the address when you book. Please don’t knock or ring, since that sets off my
          dog. The door will be unlocked. He sheds, so let me know about allergies. The studio is
          upstairs, and we ask for shoes off.
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
          Working on a song?{" "}
          <Link href="/studio" className={link}>
            See the studio
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
