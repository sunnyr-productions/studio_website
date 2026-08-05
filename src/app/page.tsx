import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GrowthDivider } from "@/components/ui/GrowthDivider";
import { Reveal } from "@/components/ui/Reveal";
import { Scribble } from "@/components/ui/Scribble";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { StatStrip } from "@/components/ui/StatStrip";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { Faq } from "@/components/ui/Faq";
import { services } from "@/content/services";
import { lessonTypes } from "@/content/lessons";
import { modes, type ModeContent } from "@/content/modes";
import { siteConfig } from "@/lib/site-config";

/**
 * Hero copy for one door. Both are rendered; CSS shows the active one (see
 * the `data-mode` rules in globals.css), which keeps this page static and
 * flash-free.
 */
function ModeHero({ mode }: { mode: ModeContent }) {
  const isLessons = mode.id === "lessons";
  const accentText = isLessons ? "text-marigold-800" : "text-periwinkle-700";
  const scribbleColor = isLessons
    ? "var(--color-marigold-500)"
    : "var(--color-periwinkle-500)";

  return (
    <div data-mode-only={mode.id} className="max-w-2xl">
      <p className={`animate-fade-up font-semibold tracking-[0.08em] ${accentText}`}>
        {mode.eyebrow}
      </p>
      <h1
        style={{ animationDelay: "80ms" }}
        className="animate-fade-up mt-3 text-[clamp(2.75rem,3vw+2rem,4.5rem)] font-display font-semibold leading-[1.05] tracking-tight text-ink-900"
      >
        {mode.headlineLead}{" "}
        <Scribble color={scribbleColor}>{mode.headlineAccent}</Scribble>.
      </h1>
      <p
        style={{ animationDelay: "160ms" }}
        className="animate-fade-up mt-5 text-lg leading-relaxed text-ink-700"
      >
        {mode.body}
      </p>
      <p
        style={{ animationDelay: "220ms" }}
        className={`animate-fade-up mt-3 font-display text-lg italic ${accentText}`}
      >
        {siteConfig.motto}
      </p>
      <div
        style={{ animationDelay: "280ms" }}
        className="animate-fade-up mt-8 flex flex-wrap gap-4"
      >
        <Button href={mode.primaryCta.href}>{mode.primaryCta.label}</Button>
        <Button href={mode.secondaryCta.href} variant="secondary">
          {mode.secondaryCta.label}
        </Button>
      </div>
    </div>
  );
}

function ValueProps({ mode }: { mode: ModeContent }) {
  return (
    <div data-mode-only={mode.id} className="grid gap-8 sm:grid-cols-3">
      {mode.valueProps.map((item, i) => (
        <Reveal key={item.title} delay={i * 100}>
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink-900">
            {item.title}
          </h2>
          <p className="mt-2 leading-relaxed text-ink-700">{item.body}</p>
        </Reveal>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Section pattern="dots" className="pt-20 sm:pt-28">
        <div className="animate-fade-up mb-10">
          <ModeToggle />
        </div>
        <ModeHero mode={modes.lessons} />
        <ModeHero mode={modes.studio} />
        <div className="mt-14">
          <StatStrip mode={modes.lessons} />
          <StatStrip mode={modes.studio} />
        </div>
        <GrowthDivider className="mt-14" />
      </Section>

      <div className="home-sections">
        <Section data-sect="why" className="py-14 sm:py-16">
          <ValueProps mode={modes.lessons} />
          <ValueProps mode={modes.studio} />
        </Section>

        <Section data-sect="how" className="bg-cream-100">
          <HowItWorks mode={modes.lessons} />
          <HowItWorks mode={modes.studio} />
        </Section>

        <Section data-sect="lessons" pattern="sprout">
          <Reveal className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
              Lessons
            </h2>
            <Button href="/lessons" variant="ghost" className="hidden sm:inline-flex">
              View all lessons
            </Button>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {lessonTypes.map((lesson, i) => (
              <Reveal key={lesson.slug} delay={i * 80}>
                <Card accent={lesson.accent} className="h-full">
                  <h3 className="font-display text-lg font-semibold text-ink-900">
                    {lesson.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{lesson.blurb}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Button href="/lessons" variant="ghost" className="mt-8 sm:hidden">
            View all lessons
          </Button>
        </Section>

        <Section data-sect="services">
          <Reveal className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
              <span data-mode-only="lessons">Also offering: mixing &amp; mastering</span>
              <span data-mode-only="studio">Mixing &amp; mastering</span>
            </h2>
            <Button href="/services" variant="ghost" className="hidden sm:inline-flex">
              View services
            </Button>
          </Reveal>
          <Reveal delay={60}>
            <p className="mt-2 max-w-xl leading-relaxed text-ink-700">
              <span data-mode-only="lessons">
                For lesson students ready to release something, or anyone who just needs a track
                to sound its best.
              </span>
              <span data-mode-only="studio">
                Every project is different — pricing below is a starting point, and a quote comes
                back shaped around your track count, timeline, and goals.
              </span>
            </p>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {services.slice(0, 3).map((service, i) => (
              <Reveal key={service.slug} delay={i * 80}>
                <Card accent={service.accent} className="h-full">
                  <h3 className="font-display text-lg font-semibold text-ink-900">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{service.blurb}</p>
                  <p className="mt-4 text-sm font-semibold text-marigold-800">
                    {service.startingPrice}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Button href="/services" variant="ghost" className="mt-8 sm:hidden">
            View services
          </Button>
        </Section>

        <Section data-sect="portfolio" className="bg-cream-100">
          <Reveal className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
              Recent work
            </h2>
            <Button href="/portfolio" variant="ghost" className="hidden sm:inline-flex">
              Hear more
            </Button>
          </Reveal>
          <Reveal delay={100}>
            <Card accent="periwinkle" className="mt-8">
              <p className="leading-relaxed text-ink-700">
                Sample mixes and masters are on the way here — check back soon, or head to the
                portfolio page directly.
              </p>
              <Button href="/portfolio" variant="ghost" className="mt-4 sm:hidden">
                Hear more
              </Button>
            </Card>
          </Reveal>
        </Section>

        <Section data-sect="testimonials">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
              What people say
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Reveal delay={0}>
              <Card className="relative overflow-hidden">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-2 -top-6 font-display text-8xl text-marigold-200"
                >
                  &ldquo;
                </span>
                <p className="relative leading-relaxed text-ink-700">
                  Turned my messy home recordings into something that actually sounds
                  professional. Patient, clear, and genuinely fun to work with.
                </p>
                <p className="relative mt-4 text-sm font-semibold text-ink-900">
                  — Placeholder Client, Artist
                </p>
              </Card>
            </Reveal>
            <Reveal delay={100}>
              <Card className="relative overflow-hidden">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-2 -top-6 font-display text-8xl text-periwinkle-200"
                >
                  &ldquo;
                </span>
                <p className="relative leading-relaxed text-ink-700">
                  I went from not knowing what a compressor did to running my own home sessions
                  confidently. Lessons were exactly what I needed.
                </p>
                <p className="relative mt-4 text-sm font-semibold text-ink-900">
                  — Placeholder Student
                </p>
              </Card>
            </Reveal>
          </div>
        </Section>

        <Section data-sect="faq" className="bg-cream-100">
          <Faq mode={modes.lessons} />
          <Faq mode={modes.studio} />
        </Section>

        <Section
          data-sect="cta"
          className="animate-drift-bg bg-gradient-to-br from-periwinkle-100 via-cream-100 to-marigold-100 text-center"
        >
          <Reveal>
            <p className="font-display text-2xl italic text-marigold-800 sm:text-3xl">
              {siteConfig.motto}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-ink-700">
              Book a first lesson, or tell me about a project you need mixed or mastered — either
              way, I&apos;ll get back to you with next steps.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/lessons">Book a lesson</Button>
              <Button href="/contact" variant="secondary">
                Start a project
              </Button>
            </div>
            <GrowthDivider className="mx-auto mt-12 max-w-xs" />
          </Reveal>
        </Section>
      </div>
    </>
  );
}
