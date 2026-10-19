import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CalEmbed } from "@/components/booking/CalEmbed";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { DoorHero } from "@/components/ui/DoorHero";
import { Faq } from "@/components/ui/Faq";
import { GrowthDivider } from "@/components/ui/GrowthDivider";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { JsonLd } from "@/components/seo/JsonLd";
import { PhotoStrip } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatStrip } from "@/components/ui/StatStrip";
import { Testimonials } from "@/components/ui/Testimonials";
import { ValueProps } from "@/components/ui/ValueProps";
import { getHeroPhotos, getStudioPhotos } from "@/content/media";
import { lessonPricing, lessonTypes, pricingTiers } from "@/content/lessons";
import { lessonPages } from "@/content/lesson-pages";
import { modes } from "@/content/modes";
import { testimonials } from "@/content/testimonials";
import { faqPageSchema } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Guitar, Voice & Production Lessons in Corvallis, OR",
  description:
    "One-on-one guitar, voice, production, and audio engineering lessons in Corvallis, Oregon and online. Patient, student-led, any genre. $20 half-hour trial.",
  alternates: { canonical: "/lessons" },
};

const mode = modes.lessons;

export default function LessonsPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(mode.faqs)} />

      <Section pattern="dots" surface="sky" space="hero">
        <DoorHero
          mode={mode}
          secondaryCta={mode.secondaryCta}
          photo={getHeroPhotos().lessons}
        >
          <p
            style={{ animationDelay: "340ms" }}
            className="animate-fade-up mt-6 leading-relaxed text-ink-700"
          >
            I’m neurodivergent myself, and I work especially well with students who’ve had
            trouble learning in more traditional settings.
          </p>
        </DoorHero>
        <div className="mt-14">
          <StatStrip mode={mode} />
        </div>
        <GrowthDivider className="mt-14" />
      </Section>

      <Section>
        <ValueProps mode={mode} />
      </Section>

      <Section pattern="sprout" id="lesson-types">
        <Reveal>
          <SectionHeading
            title="What we can work on"
            lede="Pick whichever is closest to what you want to do. They’re all the same price."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {lessonTypes.map((lesson, i) => (
            <Reveal key={lesson.slug} delay={i * 80}>
              <Card accent={lesson.accent} className="h-full">
                <h3 className="font-display text-xl font-semibold text-ink-900">{lesson.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{lesson.blurb}</p>
                <p className="mt-4 text-xs font-semibold text-ink-500">{lesson.format}</p>
                <Link
                  href={`/lessons/${lessonPages[lesson.slug].pageSlug}`}
                  className="mt-3 inline-block text-sm font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600"
                >
                  Learn more
                  <span className="sr-only"> about {lesson.name.toLowerCase()}</span>
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section surface="sun" id="pricing">
        <Reveal>
          <SectionHeading
            title="Pricing"
            lede="One flat rate, no matter which lesson type. Simple on purpose."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
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
        <PhotoStrip photos={getStudioPhotos()} className="mt-10" />
        <p className="mt-10 max-w-3xl leading-relaxed text-ink-700">
          In-person lessons happen at my sound-treated home studio in Corvallis, OR. Online lessons
          work great for voice, production, and audio engineering. Guitar tends to go better
          in-person, since hands-on technique is harder to see clearly over video.
        </p>
        <p className="mt-3 max-w-3xl leading-relaxed text-ink-700">
          Lessons are paid in person, by {lessonPricing.paymentMethods}. Need to move one? Free with{" "}
          {lessonPricing.cancellationNoticeHours}+ hours’ notice. See the{" "}
          <Link
            href="/terms#lessons"
            className="font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600"
          >
            lesson policies
          </Link>
          .
        </p>
      </Section>

      <Section surface="ink">
        <HowItWorks mode={mode} />
      </Section>

      <Section id="book" className="scroll-mt-4">
        <Reveal>
          <SectionHeading title="Pick a time that works for you" />
          {siteConfig.calLink ? (
            <>
              <p className="mt-2 max-w-xl leading-relaxed text-ink-700">
                Grab any open slot below. You’ll get a confirmation email with the details.
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
                you’re interested in and a few times that work for you. I’ll reply with an
                open slot for your trial lesson.
              </p>
              <Button href="/contact?service=lessons" className="mt-5">
                Request a lesson
              </Button>
            </Card>
          )}
        </Reveal>
      </Section>

      {testimonials.length > 0 && (
        <Section>
          <Testimonials />
        </Section>
      )}

      <Section surface="tint" id="faq">
        <Faq mode={mode} />
      </Section>

      <Section space="tight">
        <CtaPanel
          title="Want to give it a try?"
          body={`Book a trial lesson, or send me a question first. Either way, I’ll write back myself, usually within ${siteConfig.responseTime.lessons}.`}
        >
          <Button href="#book">Book a lesson</Button>
          <Button href="/contact?service=lessons" variant="secondary">
            Ask a question
          </Button>
        </CtaPanel>
        <p className="mt-8 text-center text-sm text-ink-500">
          Teaching is one side of the practice. The other is{" "}
          <Link
            href="/studio"
            className="font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600"
          >
            mixing &amp; mastering
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
