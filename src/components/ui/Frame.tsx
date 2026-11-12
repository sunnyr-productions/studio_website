import type { CSSProperties, ReactNode } from "react";

/**
 * Every photo and player sits in a drawn frame, so it belongs to the same world
 * as the scenery (docs/VISUAL-PLAN.md, "Media"). The frame is a mat outlined in
 * ink and shaded like a river stone, standing on a soft shadow, with a fine ink
 * line round the picture itself.
 *
 * - print: the plain mat. The default.
 * - medallion: a circle in a marigold ring, with short rays round it that
 *   breathe like the sun's. For photos of Raul.
 * - taped: a print taped to the page at a tilt, with a caption under it. It
 *   straightens and lifts when you hover, like a print picked up.
 * - guide: a print with a hand-lettered tag, like a specimen in a field guide.
 *   For instruments.
 * - embed: the mat round a Spotify or YouTube player.
 *
 * The full-width vista and the stage band are PhotoBanner and StageSection in
 * Photo.tsx. Every frame develops into view like a print as you come to it
 * (Rise.tsx).
 */
export type FrameVariant = "print" | "medallion" | "taped" | "guide" | "embed";

/** The mat's colour. Night is for dark photos, which glare on a light mat. */
export type Mat = "cream" | "periwinkle" | "night";

/** Tones a photo to the palette. Dusk turns black and white into plum and gold. */
export type Tone = "dusk";

export function Frame({
  variant = "print",
  mat = "cream",
  label,
  tilt = 0,
  tape = "marigold",
  tone,
  shape = "",
  className = "",
  children,
}: {
  variant?: FrameVariant;
  mat?: Mat;
  /** The tag on a guide print, or the caption under a taped one. */
  label?: string;
  /** A taped print's tilt, in degrees. */
  tilt?: number;
  tape?: "marigold" | "periwinkle";
  tone?: Tone;
  /** Classes for the picture's window, such as its aspect ratio. */
  shape?: string;
  className?: string;
  children: ReactNode;
}) {
  const Root = label ? "figure" : "div";
  return (
    <Root
      data-rise="media"
      style={tilt ? ({ "--tilt": `${tilt}deg` } as CSSProperties) : undefined}
      className={`frame frame-${variant} frame-mat-${mat} drawn stone depth-media ${className}`}
    >
      {variant === "medallion" && <Rays />}
      {variant === "taped" && <Tape colour={tape} />}
      <div data-tone={tone} className={`frame-photo ${shape}`}>
        {children}
      </div>
      {label && <figcaption className={variant === "guide" ? "frame-tag" : "frame-caption"}>{label}</figcaption>}
    </Root>
  );
}

/** Long and short in turn, like the points of a drawn sun. */
const TICKS = Array.from({ length: 16 }, (_, i) => ({ angle: i * 22.5, long: i % 2 === 0 }));

/**
 * The medallion's rays, in a box a little bigger than the medallion (see
 * .frame-rays): its ring reaches 78 units out from the middle, and the rays
 * start just past it. Each breathes in and out a beat after the one before, so
 * a slow wave runs round the sun.
 */
function Rays() {
  return (
    <svg aria-hidden="true" viewBox="-100 -100 200 200" className="frame-rays">
      {TICKS.map(({ angle, long }, i) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <g className="frame-ray" style={{ "--ray-delay": `${(-i * 0.45).toFixed(2)}s` } as CSSProperties}>
            <line x1="0" y1="-85" x2="0" y2={long ? -96 : -91} className="frame-ray-ink" />
            <line x1="0" y1="-85" x2="0" y2={long ? -96 : -91} className="frame-ray-sun" />
          </g>
        </g>
      ))}
    </svg>
  );
}

/** A strip of washi tape, torn at both ends, outlined in ink. */
function Tape({ colour }: { colour: "marigold" | "periwinkle" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 110 32" preserveAspectRatio="none" className="frame-tape">
      <path
        d="M5 3H105L101 8.5L106 14L101 19.5L106 25L102 29H5L9 24L4 18.5L9 13L4 7.5Z"
        className={`frame-tape-strip ${colour === "marigold" ? "fill-marigold-300" : "fill-periwinkle-300"}`}
      />
      <path d="M12 9H98" className="frame-tape-sheen" />
    </svg>
  );
}
