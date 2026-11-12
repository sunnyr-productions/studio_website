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

/** The long rays point straight out and to the diagonals; the short ones sit between. */
const LONG_RAYS = [0, 45, 90, 135, 180, 225, 270, 315];
const SHORT_RAYS = LONG_RAYS.map((angle) => angle + 22.5);

/**
 * One set of ticks, each an ink line with the sun's colour drawn down its
 * middle. It breathes on the wrapper rather than the drawing: the browser runs
 * an animation on a plain box off the main thread, but not one on an <svg>.
 */
function RaySet({ angles, reach, className }: { angles: number[]; reach: number; className: string }) {
  return (
    <span className={`frame-ray-set ${className}`}>
      <svg viewBox="-100 -100 200 200">
        {angles.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <line x1="0" y1="-85" x2="0" y2={-reach} className="frame-ray-ink" />
            <line x1="0" y1="-85" x2="0" y2={-reach} className="frame-ray-sun" />
          </g>
        ))}
      </svg>
    </span>
  );
}

/**
 * The medallion's rays, in a box a little bigger than the medallion (see
 * .frame-rays): its ring reaches 78 units out from the middle, and the rays
 * start just past it. The long rays and the short ones each breathe out and
 * back in turn, like a sun twinkling, as the whole fan swings gently. Each set
 * is a picture of its own, moved and faded whole, so the browser's compositor
 * can run it without redrawing anything.
 */
function Rays() {
  return (
    <span aria-hidden="true" className="frame-rays">
      <span className="frame-rays-swing">
        <RaySet angles={LONG_RAYS} reach={96} className="frame-ray-set-long" />
        <RaySet angles={SHORT_RAYS} reach={91} className="frame-ray-set-short" />
      </span>
    </span>
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
