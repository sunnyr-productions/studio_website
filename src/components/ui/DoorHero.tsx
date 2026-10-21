import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Scribble } from "@/components/ui/Scribble";
import type { Photo as PhotoData } from "@/content/media";
import type { ModeContent } from "@/content/modes";

/**
 * The opening of a door's landing page (/lessons or /studio): eyebrow, the one
 * H1, body, two CTAs, and the hero photo when one exists. `children`
 * sits under the buttons for page-specific extras.
 */
export function DoorHero({
  mode,
  secondaryCta,
  photo,
  calm = false,
  children,
}: {
  mode: ModeContent;
  secondaryCta: { label: string; href: string };
  photo?: PhotoData | null;
  /** The studio side: the accent word is coloured, not circled, and the entrance is a single fade. */
  calm?: boolean;
  children?: ReactNode;
}) {
  const isLessons = mode.id === "lessons";
  const accentText = isLessons ? "text-marigold-800" : "text-periwinkle-700";
  const scribbleColor = isLessons ? "var(--color-marigold-500)" : "var(--color-periwinkle-500)";

  return (
    <div className={photo ? "grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]" : ""}>
      <div className="max-w-2xl">
        <p className={`animate-fade-up font-semibold tracking-[0.08em] ${accentText}`}>
          {mode.eyebrow}
        </p>
        <h1
          style={{ animationDelay: calm ? undefined : "80ms" }}
          className="animate-fade-up mt-3 text-[clamp(2.75rem,3vw+2rem,4.5rem)] font-display font-semibold leading-[1.05] tracking-tight text-ink-900"
        >
          {mode.headlineLead}{" "}
          {calm ? (
            <span className={accentText}>{mode.headlineAccent}</span>
          ) : (
            <Scribble color={scribbleColor}>{mode.headlineAccent}</Scribble>
          )}
          .
        </h1>
        <p
          style={{ animationDelay: calm ? undefined : "160ms" }}
          className="animate-fade-up mt-5 text-lg leading-relaxed text-ink-700"
        >
          {mode.body}
        </p>
        <div
          style={{ animationDelay: calm ? undefined : "280ms" }}
          className="animate-fade-up mt-8 flex flex-wrap gap-4"
        >
          <Button href={mode.primaryCta.href}>{mode.primaryCta.label}</Button>
          <Button href={secondaryCta.href} variant="secondary">
            {secondaryCta.label}
          </Button>
        </div>
        {children}
      </div>
      {photo && (
        <div style={{ animationDelay: "200ms" }} className="animate-fade-up">
          <Photo
            photo={photo}
            accent={isLessons ? "marigold" : "periwinkle"}
            aspect="aspect-[4/5]"
            sizes="(min-width: 1024px) 40vw, 100vw"
            priority
            className="mx-auto max-w-md lg:max-w-none"
          />
        </div>
      )}
    </div>
  );
}
