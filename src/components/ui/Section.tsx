import type { ReactNode } from "react";

type Pattern = "waveform" | "dots" | "none";

function DotsPattern() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.06]"
      aria-hidden="true"
    >
      <defs>
        <pattern id="soundboard-dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="3" className="fill-periwinkle-700" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#soundboard-dots)" />
    </svg>
  );
}

function WaveformPattern() {
  const bars = Array.from({ length: 60 }, (_, i) => 8 + ((i * 37) % 40));
  return (
    <svg
      viewBox="0 0 720 60"
      preserveAspectRatio="none"
      className="absolute inset-x-0 bottom-0 h-16 w-full opacity-[0.08]"
      aria-hidden="true"
    >
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 12}
          y={60 - h}
          width={6}
          height={h}
          className="fill-marigold-600"
        />
      ))}
    </svg>
  );
}

/**
 * What the band is painted with. Each has a job, so a page reads as a
 * sequence of distinct rooms rather than one long sheet:
 * - paper: the default page surface.
 * - tint:  a quiet warm step down, for supporting content (FAQ, pricing notes).
 * - sun:   gold-horizon wash, for the teaching side and anything about price.
 * - dusk:  blush wash (plum at night), for the studio side.
 * - ink:   the one inverted band per page, for the "how it works" moment.
 * - sky:   the sunrise/sunset gradient, for the top of a main page.
 * See the `.surface-*` rules in globals.css.
 */
type Surface = "paper" | "tint" | "sun" | "dusk" | "ink" | "sky";

const surfaceClasses: Record<Surface, string> = {
  paper: "",
  tint: "surface-tint",
  sun: "surface-sun",
  dusk: "surface-dusk",
  ink: "surface-ink",
  sky: "surface-sky",
};

/** Content column. Bands are always full-bleed; only the content is capped. */
type Width = "content" | "narrow";

const widthClasses: Record<Width, string> = {
  content: "max-w-6xl",
  narrow: "max-w-3xl",
};

/**
 * Vertical rhythm, the only place section padding is set:
 * - page:    first section of an interior page (sits under the header).
 * - hero:    the homepage opener.
 * - default: every other band.
 * - tight:   a band that only holds one compact thing (a panel, a strip).
 */
type Space = "page" | "hero" | "default" | "tight";

const spaceClasses: Record<Space, string> = {
  page: "pt-14 pb-16 sm:pt-20 sm:pb-24",
  hero: "pt-16 pb-16 sm:pt-24 sm:pb-20",
  default: "py-16 sm:py-24",
  tight: "py-12 sm:py-16",
};

export function Section({
  children,
  pattern = "none",
  surface = "paper",
  width = "content",
  space = "default",
  className = "",
  id,
}: {
  children: ReactNode;
  pattern?: Pattern;
  surface?: Surface;
  width?: Width;
  space?: Space;
  /** Extras only (alignment etc.) — padding and background belong to the props above. */
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden ${surfaceClasses[surface]} ${className}`}
    >
      {pattern === "dots" && <DotsPattern />}
      {pattern === "waveform" && <WaveformPattern />}
      <div className={`relative mx-auto px-6 ${widthClasses[width]} ${spaceClasses[space]}`}>
        {children}
      </div>
    </section>
  );
}
