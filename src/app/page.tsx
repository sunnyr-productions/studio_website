import type { Metadata } from "next";
import Image from "next/image";
import { DoorLink } from "@/components/home/DoorLink";
import { Button } from "@/components/ui/Button";
import { Scribble } from "@/components/ui/Scribble";
import { Section } from "@/components/ui/Section";
import { Testimonials } from "@/components/ui/Testimonials";
import { lessonPricing } from "@/content/lessons";
import { studioTerms } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import raulHeadshot from "../../public/images/raul-headshot.jpg";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const doors = [
  {
    id: "lessons",
    title: "I want to learn",
    body: `Guitar, voice, music production or audio engineering, in person in Corvallis or online. It starts with a $${lessonPricing.trial.price} half-hour conversation about what you want to play.`,
    cta: "See lessons",
    href: "/lessons",
  },
  {
    id: "studio",
    title: "I have a song",
    body: `Mixing, mastering and recording for independent artists. I’m new to doing this for clients, so my first five mixing clients pay $${studioTerms.introMix.price} a song instead of $175.`,
    cta: "See the studio",
    href: "/studio",
  },
] as const;

export default function Home() {
  return (
    <>
      <Section space="hero">
        <div className="grid items-center gap-8 sm:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <p className="font-semibold tracking-[0.04em] text-marigold-800">
              Music lessons and mixing in Corvallis, Oregon, and online
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,3vw+1.75rem,4.25rem)] font-semibold leading-[1.08] tracking-tight text-ink-900">
              For anyone who’s been told they’re doing music{" "}
              <Scribble color="var(--color-marigold-500)">wrong</Scribble>.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-700">
              I’m Raul. I teach music and mix songs, and I think the right way to do both is
              whichever one sounds and feels right to you. I’ll help you find it.
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
            <div
              key={door.id}
              style={{ borderRadius: "var(--radius-sketch)" }}
              className={`surface-card relative flex h-full flex-col gap-3 border-[1.5px] border-ink-900/80 p-6 transition-transform duration-300 motion-safe:hover:-translate-y-1 sm:p-8 ${
                door.id === "lessons"
                  ? "shadow-[6px_8px_0_0_var(--color-marigold-400)]"
                  : "shadow-[6px_8px_0_0_var(--color-periwinkle-400)]"
              }`}
            >
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
                {door.title}
              </h2>
              <p className="leading-relaxed text-ink-700">{door.body}</p>
              <div className="mt-auto pt-2">
                {/* The overlay (after:inset-0) makes the whole card the click target. */}
                <DoorLink
                  door={door.id}
                  href={door.href}
                  className="inline-flex items-center gap-2 font-semibold text-marigold-800 underline decoration-marigold-300 decoration-2 underline-offset-4 after:absolute after:inset-0 after:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marigold-600"
                >
                  {door.cta}
                  <span aria-hidden="true">→</span>
                </DoorLink>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section width="narrow">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
          Why I do it this way
        </h2>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-700">
          <p>
            I begged my parents for guitar lessons, and then I walked into them ashamed. I’d forget
            the homework, or start it, struggle and give up, and I knew I was about to get scolded.
            I found out as an adult that I’m autistic and have ADHD. At the time, I just knew that
            other people didn’t seem to have this problem.
          </p>
          <p>
            I’ve had more bad music teachers than good ones. The good ones listened. One told me my
            note-perfect “Little Wing” was correct but didn’t feel like music. A music director told
            me I wasn’t the baritone I’d always said I was, and I ended up the highest tenor in the
            group.
          </p>
          <p>
            So if you show up to a lesson having done nothing, I’ll ask what happened. Maybe you had
            a busy week. Maybe what I gave you was boring, and that’s on me.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/about" variant="secondary">
            More about me
          </Button>
          <Button href="/music" variant="ghost">
            Hear my music
          </Button>
        </div>
      </Section>

      {testimonials.length > 0 && (
        <Section>
          <Testimonials />
        </Section>
      )}
    </>
  );
}
