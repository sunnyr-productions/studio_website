import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GrowthDivider } from "@/components/ui/GrowthDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Photo } from "@/components/ui/Photo";
import { getHeroPhotos } from "@/content/media";
import { Reveal } from "@/components/ui/Reveal";
import { Scribble } from "@/components/ui/Scribble";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { HomeSections } from "@/components/layout/HomeSections";
import { StatStrip } from "@/components/ui/StatStrip";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { Faq } from "@/components/ui/Faq";
import { PortfolioTrackList } from "@/components/audio/PortfolioTrackList";
import { services } from "@/content/services";
import { lessonTypes } from "@/content/lessons";
import { modes, type ModeContent } from "@/content/modes";
import { testimonials } from "@/content/testimonials";
import { portfolioTracks } from "@/content/portfolio/tracks";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Hero copy for both doors. Each element holds both versions and CSS shows the
 * active one (see the `data-mode` rules in globals.css), which keeps this page
 * static and flash-free while the document still has a single <h1>.
 */
function Hero() {
  const doors = [modes.lessons, modes.studio].map((mode) => {
    const isLessons = mode.id === "lessons";
    return {
      mode,
      accentText: isLessons ? "text-marigold-800" : "text-periwinkle-700",
      scribbleColor: isLessons ? "var(--color-marigold-500)" : "var(--color-periwinkle-500)",
      // An empty portfolio is a dead end, so the studio door points at
      // services until there are tracks to hear.
      secondaryCta:
        mode.secondaryCta.href === "/portfolio" && portfolioTracks.length === 0
          ? { label: "See services", href: "/services" }
          : mode.secondaryCta,
    };
  });

  const heroPhotos = getHeroPhotos();
  const hasPhoto = Boolean(heroPhotos.lessons || heroPhotos.studio);

  return (
    <div className={hasPhoto ? "grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]" : ""}>
      <HeroCopy doors={doors} />
      {hasPhoto && (
        <div style={{ animationDelay: "200ms" }} className="animate-fade-up">
          {doors.map(({ mode }) => {
            const photo = heroPhotos[mode.id];
            return (
              photo && (
                <div key={mode.id} data-mode-only={mode.id}>
                  <Photo
                    photo={photo}
                    accent={mode.id === "lessons" ? "marigold" : "periwinkle"}
                    aspect="aspect-[4/5]"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    priority
                    className="mx-auto max-w-md lg:max-w-none"
                  />
                </div>
              )
            );
          })}
        </div>
      )}
    </div>
  );
}

type Door = {
  mode: ModeContent;
  accentText: string;
  scribbleColor: string;
  secondaryCta: { label: string; href: string };
};

function HeroCopy({ doors }: { doors: Door[] }) {
  return (
    <div className="max-w-2xl">
      <p className="animate-fade-up font-semibold tracking-[0.08em]">
        {doors.map(({ mode, accentText }) => (
          <span key={mode.id} data-mode-only={mode.id} className={accentText}>
            {mode.eyebrow}
          </span>
        ))}
      </p>
      <h1
        style={{ animationDelay: "80ms" }}
        className="animate-fade-up mt-3 text-[clamp(2.75rem,3vw+2rem,4.5rem)] font-display font-semibold leading-[1.05] tracking-tight text-ink-900"
      >
        {doors.map(({ mode, scribbleColor }) => (
          <span key={mode.id} data-mode-only={mode.id}>
            {mode.headlineLead} <Scribble color={scribbleColor}>{mode.headlineAccent}</Scribble>.
          </span>
        ))}
      </h1>
      <p
        style={{ animationDelay: "160ms" }}
        className="animate-fade-up mt-5 text-lg leading-relaxed text-ink-700"
      >
        {doors.map(({ mode }) => (
          <span key={mode.id} data-mode-only={mode.id}>
            {mode.body}
          </span>
        ))}
      </p>
      <p
        style={{ animationDelay: "220ms" }}
        className="animate-fade-up mt-3 font-display text-lg italic"
      >
        {doors.map(({ mode, accentText }) => (
          <span key={mode.id} data-mode-only={mode.id} className={accentText}>
            {siteConfig.motto}
          </span>
        ))}
      </p>
      {doors.map(({ mode, secondaryCta }) => (
        <div
          key={mode.id}
          data-mode-only={mode.id}
          style={{ animationDelay: "280ms" }}
          className="animate-fade-up mt-8 flex flex-wrap gap-4"
        >
          <Button href={mode.primaryCta.href}>{mode.primaryCta.label}</Button>
          <Button href={secondaryCta.href} variant="secondary">
            {secondaryCta.label}
          </Button>
        </div>
      ))}
    </div>
  );
}

const whyHeadings: Record<ModeContent["id"], { eyebrow: string; title: string }> = {
  lessons: {
    eyebrow: "Why learn here",
    title: "I teach the way I wish I'd been taught",
  },
  studio: {
    eyebrow: "Why work with me",
    title: "What you can expect from me",
  },
};

/** Heading on the left, the three reasons stacked on the right with hairlines. */
function ValueProps({ mode }: { mode: ModeContent }) {
  return (
    <div data-mode-only={mode.id} className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
      <Reveal>
        <SectionHeading {...whyHeadings[mode.id]} />
      </Reveal>
      <ul className="border-t border-ink-900/15">
        {mode.valueProps.map((item, i) => (
          <li key={item.title} className="border-b border-ink-900/15 py-6">
            <Reveal delay={i * 100}>
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900">
                {item.title}
              </h3>
              <p className="mt-2 leading-relaxed text-ink-700">{item.body}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <JsonLd data={faqPageSchema([...modes.lessons.faqs, ...modes.studio.faqs])} />
      <Section pattern="dots" surface="sky" space="hero">
        <div className="animate-fade-up mb-10">
          <p className="mb-2.5 text-sm text-ink-500">
            <span className="font-semibold text-ink-700">What brings you here?</span> Pick a side
            and the whole page follows your lead.
          </p>
          <ModeToggle />
        </div>
        <Hero />
        <div className="mt-14">
          <StatStrip mode={modes.lessons} />
          <StatStrip mode={modes.studio} />
        </div>
        <GrowthDivider className="mt-14" />
      </Section>

      <HomeSections
        ids={[
          "why",
          "how",
          "lessons",
          "services",
          ...(portfolioTracks.length > 0 ? ["portfolio"] : []),
          ...(testimonials.length > 0 ? ["testimonials"] : []),
          "faq",
          "cta",
        ]}
      >
        <Section data-sect="why">
          <ValueProps mode={modes.lessons} />
          <ValueProps mode={modes.studio} />
        </Section>

        <Section data-sect="how" surface="ink">
          <HowItWorks mode={modes.lessons} />
          <HowItWorks mode={modes.studio} />
        </Section>

        <Section data-sect="lessons" pattern="sprout">
          <Reveal>
            <SectionHeading
              title="Lessons"
              lede="Pick whichever is closest to what you want to do. They're all the same price."
              action={
                <Button href="/lessons" variant="ghost" className="hidden sm:inline-flex">
                  View all lessons
                </Button>
              }
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {lessonTypes.map((lesson, i) => (
              <Reveal key={lesson.slug} delay={i * 80}>
                <Card accent={lesson.accent} className="h-full">
                  <h3 className="font-display text-lg font-semibold text-ink-900">{lesson.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{lesson.blurb}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Button href="/lessons" variant="ghost" className="mt-8 sm:hidden">
            View all lessons
          </Button>
        </Section>

        <Section data-sect="services" surface="dusk">
          <Reveal>
            <SectionHeading
              title={
                <>
                  <span data-mode-only="lessons">Also offering: mixing &amp; mastering</span>
                  <span data-mode-only="studio">Mixing &amp; mastering</span>
                </>
              }
              lede={
                <>
                  <span data-mode-only="lessons">
                    When you’ve got a song you want to put out, I can mix and master it too.
                  </span>
                  <span data-mode-only="studio">
                    These prices are starting points. Tell me about your project and I’ll send
                    you a real number.
                  </span>
                </>
              }
              action={
                <Button href="/services" variant="ghost" className="hidden sm:inline-flex">
                  View services
                </Button>
              }
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
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

        {portfolioTracks.length > 0 && (
          <Section data-sect="portfolio" surface="tint">
            <Reveal>
              <SectionHeading
                title="Recent work"
                action={
                  <Button href="/portfolio" variant="ghost" className="hidden sm:inline-flex">
                    Hear more
                  </Button>
                }
              />
            </Reveal>
            <Reveal delay={100} className="mt-10">
              <PortfolioTrackList tracks={portfolioTracks.slice(0, 3)} />
            </Reveal>
            <Button href="/portfolio" variant="ghost" className="mt-8 sm:hidden">
              Hear more
            </Button>
          </Section>
        )}

        {testimonials.length > 0 && (
          <Section data-sect="testimonials">
            <Reveal>
              <SectionHeading title="What people say" />
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 100}>
                  <Card className="relative overflow-hidden">
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute -left-2 -top-6 font-display text-8xl ${
                        t.accent === "periwinkle" ? "text-periwinkle-200" : "text-marigold-200"
                      }`}
                    >
                      &ldquo;
                    </span>
                    <p className="relative leading-relaxed text-ink-700">{t.quote}</p>
                    <p className="relative mt-4 text-sm font-semibold text-ink-900">
                      — {t.name}
                      {t.role ? `, ${t.role}` : ""}
                    </p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </Section>
        )}

        <Section data-sect="faq" surface="tint">
          <Faq mode={modes.lessons} />
          <Faq mode={modes.studio} />
        </Section>

        <Section data-sect="cta" space="tight">
          <CtaPanel
            title="Want to give it a try?"
            body="Book a first lesson, or tell me about the song you're working on. Either way, I'll write back myself within 2 business days."
          >
            <Button href="/lessons">Book a lesson</Button>
            <Button href="/contact" variant="secondary">
              Start a project
            </Button>
          </CtaPanel>
        </Section>
      </HomeSections>
    </>
  );
}
