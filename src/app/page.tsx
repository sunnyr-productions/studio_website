import type { Metadata } from "next";
import { DoorLink } from "@/components/home/DoorLink";
import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Scribble } from "@/components/ui/Scribble";
import { Section } from "@/components/ui/Section";
import { Testimonials } from "@/components/ui/Testimonials";
import { lessonPricing } from "@/content/lessons";
import { getHeroPhotos, media } from "@/content/media";
import { studioPrices, studioTerms } from "@/content/services";
import { testimonials } from "@/content/testimonials";

export const metadata: Metadata = {
  description:
    "One-on-one guitar, voice and music production lessons, plus song mixing, from Raul in Corvallis, Oregon and online.",
  alternates: { canonical: "/" },
};

const doors = [
  {
    id: "lessons",
    title: "Start learning",
    body: `Guitar, voice, music production and audio engineering, one-on-one at my place or over video. Start with a $${lessonPricing.trial.price} half-hour trial.`,
    cta: "Lessons",
    href: "/lessons",
  },
  {
    id: "studio",
    title: "Finish your song",
    body: `Mixing, mastering and recording for independent musicians, in person or remote. My first five mixing clients pay $${studioTerms.introMix.price} a song instead of $${studioPrices.mixing}.`,
    cta: "The studio",
    href: "/studio",
  },
] as const;

export default function Home() {
  const heroPhotos = getHeroPhotos();

  return (
    <>
      <Section space="hero">
        <div className="grid items-center gap-8 sm:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <p className="font-semibold tracking-[0.04em] text-marigold-800">
              Corvallis, Oregon, and online
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,3vw+1.75rem,4.25rem)] font-semibold leading-[1.08] tracking-tight text-ink-900">
              Music lessons and mixing in Corvallis, where the right way is{" "}
              <Scribble color="var(--color-marigold-500)">your</Scribble> way
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-700">
              I’m Raul. I teach music lessons and mix songs from my home studio in Corvallis’s
              Southtown neighborhood and online. I’ve sung all my life, played guitar for more than fifteen years, and work as an
              audio engineer at a podcast studio.
            </p>
          </div>
          <Photo
            photo={media.headshot}
            frame="medallion"
            sizes="(min-width: 640px) 14rem, 8rem"
            preload
            // The margins leave room for the rays, which reach past the photo.
            className="row-start-1 ml-[1.15rem] w-32 sm:col-start-2 sm:mx-8 sm:w-56"
          />
        </div>

        <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-2">
          {doors.map((door) => {
            const photo = heroPhotos[door.id];
            return (
              <div
                key={door.id}
                style={{ borderRadius: "var(--radius-sketch)" }}
                className={`surface-card card card-lift group relative flex h-full flex-col gap-5 p-6 sm:flex-row sm:gap-6 sm:p-8 ${
                  door.id === "lessons" ? "card-marigold" : "card-periwinkle"
                }`}
              >
                {photo && (
                  <Photo
                    photo={photo}
                    aspect="aspect-[4/3] sm:aspect-[4/5]"
                    // On a phone it fills the card, inside the page's and the card's padding.
                    sizes="(min-width: 1024px) 200px, (min-width: 640px) 260px, calc(100vw - 5rem)"
                    className="shrink-0 sm:w-2/5 sm:self-start"
                  />
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
                    {door.title}
                  </h2>
                  <p className="leading-relaxed text-ink-700">{door.body}</p>
                  <div className="mt-auto pt-2">
                    {/* The overlay (after:inset-0) makes the whole card the click target. */}
                    <DoorLink
                      door={door.id}
                      href={door.href}
                      className="link-drawn inline-flex items-center gap-2 after:absolute after:inset-0 after:content-['']"
                    >
                      {door.cta}
                      <Arrow className="transition-transform duration-[var(--dur-lift)] ease-[var(--ease-settle)] motion-safe:group-hover:translate-x-1" />
                    </DoorLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section width="narrow">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
          How I work
        </h2>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-700">
          <p>
            I’m autistic and ADHD. As a kid I loved music but dreaded lessons, because I could never
            keep up with practice and always felt behind. So my lessons are flexible, built around
            music you like, and never run on guilt.
          </p>
          <p>
            I mix the same way: by listening to what’s in front of me rather than following a
            formula.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/about">More about me</Button>
          <Button href="/music" variant="secondary">
            Hear some music
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
