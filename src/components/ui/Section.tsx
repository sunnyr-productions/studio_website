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
  width = "content",
  space = "default",
  className = "",
  id,
}: {
  children: ReactNode;
  pattern?: Pattern;
  width?: Width;
  space?: Space;
  /** Extras only (alignment etc.) — padding belongs to the props above. */
  className?: string;
  id?: string;
}) {
  // The content sits on a frosted panel, inset like the header so their edges
  // and the copy's left edge line up. A narrow column gets a narrower panel.
  // `.depth` puts its photos and copy on their own layers (see globals.css).
  return (
    <section
      id={id}
      className={`relative overflow-hidden px-2 sm:px-3 ${className}`}
    >
      <div
        aria-hidden="true"
        className={`section-panel column-inset ${width === "narrow" ? "[--column:51rem]" : ""}`}
      >
        {pattern === "dots" && <DotsPattern />}
        {pattern === "waveform" && <WaveformPattern />}
      </div>
      <div className={`depth relative mx-auto px-4 sm:px-6 ${widthClasses[width]} ${spaceClasses[space]}`}>
        {children}
      </div>
    </section>
  );
}
