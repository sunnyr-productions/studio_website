import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CalEmbed } from "@/components/booking/CalEmbed";
import { GrowthDivider } from "@/components/ui/GrowthDivider";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";
import { lessonTypes } from "@/content/lessons";

export const metadata: Metadata = {
  title: "Lessons",
  description: "Guitar, vocal, production, and audio engineering lessons — taught patiently, for any kind of student.",
  alternates: { canonical: "/lessons" },
};

const pricingTiers = [
  {
    name: "Trial Lesson",
    price: "Discounted first session",
    forWho: "Low-pressure first meeting — see if it's a good fit before committing to anything.",
    accent: "marigold" as const,
  },
  {
    name: "Single Lesson",
    price: "$45 / hour",
    forWho: "Same flat rate across guitar, vocal, production, and audio engineering lessons.",
    accent: "periwinkle" as const,
  },
  {
    name: "4-Lesson Package",
    price: "Small discount vs. 4 singles",
    forWho: "For students ready to commit to steady, regular progress.",
    accent: "marigold" as const,
  },
  {
    name: "Monthly (Weekly Lesson)",
    price: "Best value, ongoing",
    forWho: "One lesson a week, every week — the easiest way to actually build a skill over time.",
    accent: "periwinkle" as const,
  },
];

export default function LessonsPage() {
  return (
    <>
      <Section pattern="dots" className="pt-16 pb-10">
        <h1 className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-ink-900">
          Lessons
        </h1>
        <p style={{ animationDelay: "80ms" }} className="animate-fade-up mt-3 max-w-2xl leading-relaxed text-ink-700">
          One-on-one lessons in guitar, voice, production, and audio engineering — taught
          patiently, and never rigidly. Every lesson is shaped around what <em>you</em> want to
          get out of music, whether that&apos;s your first chord or your tenth release. Growth
          isn&apos;t rushed here — it just needs <span className="marker">consistent sunlight</span>.
        </p>
        <p style={{ animationDelay: "140ms" }} className="animate-fade-up mt-3 max-w-2xl leading-relaxed text-ink-700">
          I&apos;m neurodivergent myself, and work especially well with students who&apos;ve had
          trouble learning in more traditional settings — but honestly, I just like working with
          people, so I&apos;m open to any kind of student, any genre, any starting point. Folk,
          pop, indie, alternative, R&amp;B, funk, or whatever you&apos;re into — let&apos;s build
          on it.
        </p>

        <GrowthDivider className="mt-8 max-w-sm" />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {lessonTypes.map((lesson, i) => (
            <Reveal key={lesson.slug} delay={i * 80}>
              <Card
                accent={lesson.accent}
                className={`h-full ${lesson.featured ? "ring-2 ring-marigold-300" : ""}`}
              >
                {lesson.featured && (
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-marigold-800">
                    Most requested
                  </p>
                )}
                <h2 className="mt-1 font-display text-xl font-semibold text-ink-900">
                  {lesson.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{lesson.blurb}</p>
                <p className="mt-4 text-xs font-semibold text-ink-500">{lesson.format}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-cream-100">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
            Pricing
          </h2>
          <p className="mt-2 max-w-xl leading-relaxed text-ink-700">
            One flat rate, no matter which lesson type — simple on purpose.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pricingTiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 70}>
              <Card accent={tier.accent} className="h-full">
                <h3 className="font-display text-lg font-semibold text-ink-900">{tier.name}</h3>
                <p className="mt-1 text-sm font-semibold text-marigold-800">{tier.price}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{tier.forWho}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-ink-700">
          In-person lessons happen at my sound-treated home studio in Corvallis, OR. Online
          lessons work great for voice, production, and audio engineering — guitar tends to go
          better in-person, since hands-on technique is harder to see clearly over video.
        </p>
      </Section>

      <Section className="pb-20">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
            Pick a time that works for you
          </h2>
          {siteConfig.calLink ? (
            <>
              <p className="mt-2 max-w-xl leading-relaxed text-ink-700">
                Availability updates in real time below — book directly and you&apos;ll get a
                confirmation email with everything you need.
              </p>
              <div
                style={{ borderRadius: "var(--radius-sketch-sm)" }}
                className="mt-8 overflow-hidden border-[1.5px] border-ink-900/20 bg-cream-50 shadow-[3px_4px_0_0_var(--sketch-shadow)]"
              >
                <CalEmbed calLink={siteConfig.calLink} />
              </div>
            </>
          ) : (
            <Card accent="marigold" className="mt-8 max-w-2xl">
              <p className="leading-relaxed text-ink-700">
                Online booking is coming soon. For now, send a quick note with the lesson
                you&apos;re interested in and a few times that work for you — I&apos;ll reply
                with an open slot for your trial lesson.
              </p>
              <Button href="/contact" className="mt-5">
                Request a lesson
              </Button>
            </Card>
          )}
          <p className="mt-8 text-sm text-ink-500">
            Teaching is one side of the practice — the other door is{" "}
            <Link
              href="/services"
              className="font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600"
            >
              mixing &amp; mastering
            </Link>
            .
          </p>
        </Reveal>
      </Section>
    </>
  );
}
