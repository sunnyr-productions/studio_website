import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DoorLink } from "@/components/home/DoorLink";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Testimonials } from "@/components/ui/Testimonials";
import { getHeroPhotos } from "@/content/media";
import { lessonPricing } from "@/content/lessons";
import { testimonials } from "@/content/testimonials";
import raulHeadshot from "../../public/images/raul-headshot.jpg";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

type DoorCardContent = {
  id: "lessons" | "studio";
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
    title: "Lessons",
    pitch: "Guitar, voice, production and audio engineering, one-on-one, at your pace. Any age and any genre.",
    proof: `Start with a $${lessonPricing.trial.price} half-hour trial.`,
    cta: "See lessons",
    href: "/lessons",
    accent: "marigold",
  },
  {
    id: "studio",
    title: "Mixing, mastering & recording",
    pitch: "For songs you're getting ready to release. Recording sessions are in Corvallis or over video.",
    proof: "Mixing from $175 a song, quoted before I start.",
    cta: "See the studio",
    href: "/studio",
    accent: "periwinkle",
  },
];

function DoorCard({ door }: { door: DoorCardContent }) {
  const photo = getHeroPhotos()[door.id];
  const isLessons = door.id === "lessons";
  return (
    <div
      style={{ borderRadius: "var(--radius-sketch)" }}
      className={`surface-card group relative flex h-full flex-col gap-4 border-[1.5px] border-ink-900/80 p-6 transition-transform duration-300 motion-safe:hover:-translate-y-1 sm:p-8 ${
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
          <span aria-hidden="true">→</span>
        </DoorLink>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Section space="hero">
        <div className="grid items-center gap-8 sm:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <h1 className="text-[clamp(2.75rem,3vw+2rem,4.5rem)] font-display font-semibold leading-[1.05] tracking-tight text-ink-900">
              I teach music and mix records in Corvallis, Oregon.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-700">
              I’m Raul. You can learn with me in person or online, or send me a song from anywhere.
            </p>
          </div>
          <div className="relative row-start-1 h-32 w-32 overflow-hidden rounded-full border-[1.5px] border-ink-900/80 sm:col-start-2 sm:h-56 sm:w-56">
            <Image
              src={raulHeadshot}
              alt="Raul"
              fill
              sizes="(min-width: 640px) 14rem, 8rem"
              placeholder="blur"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-2">
          {doors.map((door) => (
            <DoorCard key={door.id} door={door} />
          ))}
        </div>
      </Section>

      <Section width="narrow">
        <SectionHeading
          title="A bit about me"
          lede="I’ve played guitar since I was 10 and sung for longer than that. I learned to teach as Music Director of an a cappella group at the University of Oregon, and audio engineering is my full-time job. I teach and mix from a home studio I treated myself."
        />
        <Button href="/about" variant="secondary" className="mt-6">
          More about me
        </Button>
        <p className="mt-8 text-sm text-ink-500">
          Got a question? Try the{" "}
          <Link
            href="/lessons#faq"
            className="font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600"
          >
            lessons FAQ
          </Link>{" "}
          or the{" "}
          <Link
            href="/studio#faq"
            className="font-semibold text-periwinkle-700 underline decoration-periwinkle-300 underline-offset-2 transition-colors hover:text-periwinkle-600"
          >
            studio FAQ
          </Link>
          , or just{" "}
          <Link
            href="/contact"
            className="font-semibold text-marigold-800 underline decoration-marigold-300 underline-offset-2 transition-colors hover:text-marigold-600"
          >
            ask me
          </Link>
          .
        </p>
      </Section>

      {testimonials.length > 0 && (
        <Section>
          <Testimonials />
        </Section>
      )}
    </>
  );
}
