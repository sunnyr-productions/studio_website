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
  description: `One-on-one lessons built around songs you love, from an autistic, ADHD teacher. In Southtown or online, with a $${trial.price} trial.`,
  alternates: { canonical: "/lessons" },
};

const link =
  "font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600";

const faqs = [
  {
    q: "Do you teach kids?",
    a: "Yes, from around potty-training age, and younger if we’ve talked first and a parent stays. Parents can always sit in. You know your kid best, so tell me what would help, early enough that I can get ready.",
  },
  {
    q: "My kid has quit lessons twice. Will this be different?",
    a: "I can’t promise they’ll love it, because nobody can make that happen. I can promise lessons built around what they actually care about and a teacher who won’t shame them for skipping practice. If what you want for them and what they want don’t line up, we’ll talk about it and look for something in between.",
  },
  {
    q: "Do I need an instrument?",
    a: "Not at first. I have guitars, a bass and a keyboard you can use here. I have microphones too, though singing lessons rarely need one.",
  },
  {
    q: "Can we do this online?",
    a: "Voice, production and engineering work fine over video, and I’ll record the lesson if you ask. Guitar is better in person, where I can see what your hands are doing.",
  },
  {
    q: "When are you available?",
    a: "Weekday evenings, with more openings on weekends, around my day job.",
  },
  {
    q: "Do you teach piano?",
    a: "No. I know my way around a keyboard well enough to build chords and use it in my productions, but you deserve someone who really plays.",
  },
  {
    q: "Do you teach bass?",
    a: "If you’re already taking lessons with me and want to add it, sure. I play, but I’m not a bass specialist, so if it’s your main instrument, you’d be better off with someone who is.",
  },
];

export default function LessonsPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(faqs)} />

      <Section space="hero">
        <div className="max-w-3xl">
          <h1 className="font-display text-[clamp(2.5rem,3vw+1.75rem,4.25rem)] font-semibold leading-[1.08] tracking-tight text-ink-900">
            Guitar, voice and production lessons in Corvallis that start with your favorite songs
          </h1>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-700">
            <p>
              Bring me a song you can’t stop playing, and we’ll work backward from it to whatever you
              need to learn. I teach one person at a time, in my home studio in Southtown or over
              video, and it doesn’t matter whether you’ve never touched an instrument or you’ve been
              at it for years.
            </p>
            <p>
              You should know two things up front. I’m autistic and ADHD, so I know how it feels when
              a lesson wasn’t designed with you in mind.{" "}
              <Link href="/lessons/neurodivergent-learners" className={link}>
                How that shapes my teaching
              </Link>
              . And I’m new to teaching music one-on-one. I’ve taught rooms full of a cappella singers
              and I tutor computer science, but you’d be among my first one-on-one music students.
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
        <SectionHeading title="What a lesson is actually like" />
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-700">
          <p>
            I come in with an outline and often end up somewhere else, since what you need that day
            tends to be more interesting than what I planned. We’ll spend the time on real music,
            played at whatever level you’re at. I explain most things by comparing them to something
            else, because that’s how my own brain holds on to anything, and if my comparisons don’t
            land, we’ll try another angle.
          </p>
          <p>
            You won’t get in trouble here. If a week goes by and you never touched your instrument,
            I’m going to be curious about why. Maybe life got in the way, which is fine, or maybe the
            thing I assigned bored you, which is useful for me to know because I can fix it. There’s
            no required number of practice minutes. My own practice runs from scales one day to
            guessing chords along with a shuffled playlist the next, and it has worked out okay.
          </p>
          <p>
            When too much is coming at you at once, I can usually tell from your body language, and
            we’ll take some off the pile. Picture an overfull washing machine, banging around and
            complaining. You stop it, pull out a few towels, let it finish, and put them through
            afterward. I’m hard to rattle, so nothing that happens in a lesson is going to get a big
            reaction out of me.
          </p>
          <p>
            I’ll also tell you when I don’t know something, and I hope you’ll do the same. Looking
            things up together is a perfectly good use of a lesson.
          </p>
        </div>
      </Section>

      <Section width="narrow" space="tight">
        <SectionHeading title="Your first half hour" />
        <p className="mt-4 text-lg leading-relaxed text-ink-700">
          The trial costs ${trial.price}, lasts thirty minutes, and is mostly talking. I’ll want to
          know what brought you here, what you’re hoping for and what you listen to, and if you
          already play or sing, I’ll ask you to show me something. You’ll leave knowing how I teach,
          and I’ll leave with an idea of where we’d go next. If it seems like I’m the wrong teacher
          for you, I’ll say so, since taking your money anyway wouldn’t help either of us.
        </p>
      </Section>

      <Section id="pricing">
        <SectionHeading title="Prices" lede="Every subject costs the same." />
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
          Pay at the lesson with {paymentMethods}. You can cancel or reschedule for free with{" "}
          {cancellationNoticeHours} hours’ notice. After that it’s {lateCancelPercent}%, and a missed
          lesson is the full price. The rest is in the{" "}
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
              Choose any open slot and the details will land in your inbox.
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
              Tell me what you’d like to learn and when you’re free, and I’ll find us a time.
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
          Southtown is a quiet residential part of town, away from the student apartments, and there’s
          free parking on the street. You’ll get the address when you book. Please walk in rather than
          knocking or ringing, since my dog is lovely until he hears either one. I’ll leave the door
          unlocked, and I’ll likely be outside to meet you the first time anyway. He also sheds a lot,
          which matters if you have allergies. The studio is upstairs, where it’s carpeted, and we ask
          for shoes off up there unless that’s a problem for you.
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
          Here about a song instead?{" "}
          <Link href="/studio" className={link}>
            The studio’s this way
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
