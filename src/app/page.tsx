import type { Metadata } from "next";
import Image from "next/image";
import { DoorLink } from "@/components/home/DoorLink";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Scribble } from "@/components/ui/Scribble";
import { Section } from "@/components/ui/Section";
import { Testimonials } from "@/components/ui/Testimonials";
import { lessonPricing } from "@/content/lessons";
import { getHeroPhotos } from "@/content/media";
import { studioPrices, studioTerms } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import raulHeadshot from "../../public/images/raul-headshot.jpg";

export const metadata: Metadata = {
  description: "One-on-one music lessons and song mixing from Raul, in Corvallis, Oregon and online.",
  alternates: { canonical: "/" },
};

const doors = [
  {
    id: "lessons",
    title: "Learn something",
    body: `Guitar, singing, music production or audio engineering, one-on-one, at my place or over video. You’d start with a $${lessonPricing.trial.price} half hour where I ask what you’ve been listening to and you decide whether you can put up with me.`,
    cta: "Lessons",
    href: "/lessons",
  },
  {
    id: "studio",
    title: "Finish a song",
    body: `Mixing, mastering and recording for independent musicians, here or remotely. Working for clients is new for me, so the first five people who hire me for a mix pay $${studioTerms.introMix.price} a song rather than the usual $${studioPrices.mixing}.`,
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
              Music lessons and mixing in Corvallis, starting with me{" "}
              <Scribble color="var(--color-marigold-500)">listening</Scribble> to you
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-700">
              I’m Raul. I’ve been singing for as long as anyone can remember and playing guitar since I
              was ten, and these days I split my time between a day job at a podcast studio and a
              converted bedroom full of instruments. That bedroom is the sunny*r studio, where I teach
              and mix other people’s songs.
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
          {doors.map((door) => {
            const photo = heroPhotos[door.id];
            return (
              <div
                key={door.id}
                style={{ borderRadius: "var(--radius-sketch)" }}
                className={`surface-card relative flex h-full flex-col gap-5 border-[1.5px] border-ink-900/80 p-6 transition-transform duration-300 motion-safe:hover:-translate-y-1 sm:flex-row sm:gap-6 sm:p-8 ${
                  door.id === "lessons"
                    ? "shadow-[6px_8px_0_0_var(--color-marigold-400)]"
                    : "shadow-[6px_8px_0_0_var(--color-periwinkle-400)]"
                }`}
              >
                {photo && (
                  <Photo
                    photo={photo}
                    accent="none"
                    aspect="aspect-[4/3] sm:aspect-[4/5]"
                    sizes="(min-width: 1024px) 200px, (min-width: 640px) 260px, 100vw"
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
                      className="inline-flex items-center gap-2 font-semibold text-marigold-800 underline decoration-marigold-300 decoration-2 underline-offset-4 after:absolute after:inset-0 after:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marigold-600"
                    >
                      {door.cta}
                      <span aria-hidden="true">→</span>
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
          How I ended up working this way
        </h2>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-700">
          <p>
            I was the kid who begged for music lessons and then dreaded them. Practice assignments
            would slip my mind, or I’d get stuck halfway through and quit, and I went in each week
            knowing I’d let someone down before I played a note. Nobody knew I was autistic and ADHD,
            including me. That came much later.
          </p>
          <p>
            Plenty of my teachers were no help with any of this, but a few paid attention to what was
            actually happening in front of them, and those are the ones I still think about. One
            heard me play “Little Wing” perfectly and pointed out that it didn’t sound like music yet.
            Nobody had ever said anything like that to me, and it changed what I thought I was
            practicing for.
          </p>
          <p>
            I try to be that kind of teacher, and it turns out to be most of how I mix as well.
            Whether it’s your fingers on a guitar neck or your voice in a chorus, I’d rather respond
            to what I’m hearing than to a rulebook.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/about" variant="secondary">
            The whole story
          </Button>
          <Button href="/music" variant="ghost">
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
