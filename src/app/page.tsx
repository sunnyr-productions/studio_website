import type { Metadata } from "next";
import Link from "next/link";
import { DoorLink } from "@/components/home/DoorLink";
import { Button } from "@/components/ui/Button";
import { CtaPanel } from "@/components/ui/CtaPanel";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Scribble } from "@/components/ui/Scribble";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Testimonials } from "@/components/ui/Testimonials";
import { getHeroPhotos } from "@/content/media";
import { lessonPricing } from "@/content/lessons";
import { testimonials } from "@/content/testimonials";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

type DoorCardContent = {
  id: "lessons" | "studio";
  label: string;
  title: string;
  pitch: string;
  proof: string;
  cta: string;
  href: string;
  accent: "marigold" | "periwinkle";
};

// Lessons leads: equal weight in the design, but it's the easier side to find
// students for (roadmap D1).
const doors: DoorCardContent[] = [
  {
    id: "lessons",
    label: "Learn with me",
    title: "Music lessons",
    pitch:
      "Guitar, voice, production, and audio engineering, taught one-on-one and at your pace. Any age, any genre, any starting point.",
    proof: `A $${lessonPricing.trial.price} half-hour trial lesson, and you can stop there if it’s not for you.`,
    cta: "See lessons",
    href: "/lessons",
    accent: "marigold",
  },
  {
    id: "studio",
    label: "Create with me",
    title: "Mixing, mastering & recording",
    pitch:
      "Mixing and mastering for musicians who are ready to release, plus recording sessions in Corvallis or remotely.",
    proof: "Mixing from $175 a song, with a fixed quote first and two rounds of revisions.",
    cta: "See the studio",
    href: "/studio",
    accent: "periwinkle",
  },
];

function DoorCard({ door, delay }: { door: DoorCardContent; delay: number }) {
  const photo = getHeroPhotos()[door.id];
  const isLessons = door.id === "lessons";
  return (
    <Reveal delay={delay} className="h-full">
      <div
        style={{ borderRadius: "var(--radius-sketch)" }}
        className={`surface-card group relative flex h-full flex-col gap-5 border-[1.5px] border-ink-900/80 p-6 transition-transform duration-300 motion-safe:hover:-translate-y-1 sm:p-8 ${
          isLessons
            ? "shadow-[6px_8px_0_0_var(--color-marigold-400)]"
            : "shadow-[6px_8px_0_0_var(--color-periwinkle-400)]"
        }`}
      >
        {photo && (
          <Photo
            photo={photo}
            accent={door.accent}
            aspect="aspect-[4/3]"
            sizes="(min-width: 1024px) 40vw, 100vw"
            priority={isLessons}
          />
        )}
        <p
          className={`text-sm font-semibold tracking-[0.08em] ${
            isLessons ? "text-marigold-800" : "text-periwinkle-700"
          }`}
        >
          {door.label}
        </p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
          {door.title}
        </h2>
        <p className="leading-relaxed text-ink-700">{door.pitch}</p>
        <p className="text-sm font-semibold text-ink-900">{door.proof}</p>
        <div className="mt-auto pt-2">
          {/* The overlay (after:inset-0) makes the whole card the click target. */}
          <DoorLink
            door={door.id}
            href={door.href}
            className={`inline-flex items-center gap-2 font-semibold underline decoration-2 underline-offset-4 after:absolute after:inset-0 after:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marigold-600 ${
              isLessons
                ? "text-marigold-800 decoration-marigold-300"
                : "text-periwinkle-700 decoration-periwinkle-300"
            }`}
          >
            {door.cta}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </DoorLink>
        </div>
      </div>
    </Reveal>
  );
}

export default function Home() {
  return (
    <>
      <Section surface="sky" space="hero">
        <p className="animate-fade-up font-semibold tracking-[0.08em] text-marigold-800">
          Corvallis, OR &amp; online
        </p>
        <h1
          style={{ animationDelay: "80ms" }}
          className="animate-fade-up mt-3 max-w-3xl text-[clamp(2.75rem,3vw+2rem,4.5rem)] font-display font-semibold leading-[1.05] tracking-tight text-ink-900"
        >
          Music lessons, mixing &amp; mastering, a little{" "}
          <Scribble color="var(--color-marigold-500)">sunnier</Scribble>.
        </h1>
        <p
          style={{ animationDelay: "160ms" }}
          className="animate-fade-up mt-5 max-w-2xl text-lg leading-relaxed text-ink-700"
        >
          I’m Raul. I teach guitar, voice, and production, and I mix and master for other
          musicians. Pick whichever you’re here for.
        </p>

        <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-2">
          {doors.map((door, i) => (
            <DoorCard key={door.id} door={door} delay={i * 100} />
          ))}
        </div>
      </Section>

      <Section>
        <Reveal>
          <SectionHeading
            title="Who’s behind this"
            lede={
              <>
                I’ve played guitar for sixteen years and written and produced for ten. Audio
                engineering is my full-time job, so the studio side of music comes into everything
                I do. I’m neurodivergent myself, which shapes how I teach: patiently, with no fixed
                curriculum.
              </>
            }
            action={
              <Button href="/about" variant="ghost">
                More about me
              </Button>
            }
          />
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-8 text-sm text-ink-500">
            Questions first? The answers people ask most are in the{" "}
            <Link
              href="/lessons#faq"
              className="font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600"
            >
              lessons FAQ
            </Link>{" "}
            and the{" "}
            <Link
              href="/studio#faq"
              className="font-semibold text-periwinkle-700 underline decoration-periwinkle-300 underline-offset-2 transition-colors hover:text-periwinkle-600"
            >
              studio FAQ
            </Link>
            .
          </p>
        </Reveal>
      </Section>

      {testimonials.length > 0 && (
        <Section surface="tint">
          <Testimonials />
        </Section>
      )}

      <Section space="tight">
        <CtaPanel
          title="Want to give it a try?"
          body={`Book a first lesson, or tell me about the song you’re working on. Either way, I’ll write back myself, usually within ${siteConfig.responseTime.any}.`}
        >
          <Button href="/lessons#book">Book a lesson</Button>
          <Button href="/contact" variant="secondary">
            Start a project
          </Button>
        </CtaPanel>
      </Section>
    </>
  );
}
