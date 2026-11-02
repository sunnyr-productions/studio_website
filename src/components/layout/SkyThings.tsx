import type { ReactNode } from "react";

/** The little drawings that cross the sky. They all face right; Sky flips them. */
export type SkyThingName =
  | "plane"
  | "paperPlane"
  | "kite"
  | "birds"
  | "bee"
  | "frisbee"
  | "balloon"
  | "hotAirBalloon"
  | "notes";

/** Stroke only, so a shape's own fill shows through. */
const outlined = {
  stroke: "var(--color-ink-700)",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const line = { ...outlined, fill: "none" } as const;

export const skyThings: Record<
  SkyThingName,
  {
    viewBox: string;
    width: number;
    /** How far it swings or bobs as you scroll. */
    wobble: number;
    drawing: ReactNode;
  }
> = {
  plane: {
    viewBox: "0 0 150 44",
    width: 150,
    wobble: 0,
    drawing: (
      <>
        <path d="M2 24h46" {...line} strokeDasharray="1 7" />
        <path d="M56 22h66c12 0 22 4 22 7s-8 5-20 5H72c-8 0-13-4-16-12z" fill="#f6f1e6" {...outlined} />
        <path d="M56 22l-6-14h9l12 14zM92 30l-14 12h10l22-12z" fill="var(--color-periwinkle-400)" {...outlined} />
        <path d="M126 24h8" {...line} />
      </>
    ),
  },
  paperPlane: {
    viewBox: "0 0 90 60",
    width: 76,
    wobble: 9,
    drawing: (
      <>
        <path d="M4 48c8-8 12 4 18-4s-6-8 0-12" {...line} strokeDasharray="2 5" />
        <path d="M28 30L86 6 52 54l-8-16z" fill="#f6f1e6" {...outlined} />
        <path d="M86 6L44 38l-2 16 10-10" fill="#e4ddcd" {...outlined} />
      </>
    ),
  },
  kite: {
    viewBox: "0 0 70 110",
    width: 62,
    wobble: 12,
    drawing: (
      <>
        <path d="M36 4l24 26-24 36-24-36z" fill="var(--color-coral-400)" {...outlined} />
        <path d="M36 4v62M12 30h48" {...line} />
        <path d="M36 66c-8 6 8 10 0 16s8 10 0 16" {...line} />
        <path d="M30 74l6 4 6-5M30 90l6 4 6-5" {...line} />
      </>
    ),
  },
  birds: {
    viewBox: "0 0 90 44",
    width: 84,
    wobble: 0,
    drawing: (
      <>
        <path d="M6 24c6-8 11-8 15 0 4-8 9-8 15 0" {...line} />
        <path d="M40 10c5-6 9-6 12 0 3-6 7-6 12 0" {...line} />
        <path d="M58 34c4-5 7-5 10 0 3-5 6-5 10 0" {...line} />
      </>
    ),
  },
  bee: {
    viewBox: "0 0 90 54",
    width: 66,
    wobble: 16,
    drawing: (
      <>
        <path d="M2 42c8 10 18 8 20-2s-12-10-12 0 16 6 26-4" {...line} strokeDasharray="1 5" />
        <ellipse cx="58" cy="12" rx="8" ry="11" transform="rotate(-24 58 12)" fill="#f6f1e6" {...outlined} />
        <ellipse cx="68" cy="14" rx="7" ry="10" transform="rotate(14 68 14)" fill="#f6f1e6" {...outlined} />
        <ellipse cx="63" cy="32" rx="17" ry="11" fill="var(--color-marigold-400)" {...outlined} />
        <path d="M58 22v20M67 22v20" {...line} strokeWidth={3} />
        <path d="M76 26c4-6 6-7 8-7" {...line} />
      </>
    ),
  },
  frisbee: {
    viewBox: "0 0 90 40",
    width: 72,
    wobble: 0,
    drawing: (
      <>
        <path d="M2 14h14M6 24h10" {...line} />
        <ellipse cx="54" cy="20" rx="32" ry="11" fill="var(--color-marigold-500)" {...outlined} />
        <ellipse cx="54" cy="18" rx="18" ry="5" {...line} />
      </>
    ),
  },
  balloon: {
    viewBox: "0 0 40 90",
    width: 38,
    wobble: 6,
    drawing: (
      <>
        <path d="M20 48c-8 8 7 12 0 20s6 12 0 20" {...line} />
        <path d="M20 2C9 2 3 11 3 22c0 13 11 22 17 26 6-4 17-13 17-26C37 11 31 2 20 2z" fill="var(--color-coral-400)" {...outlined} />
      </>
    ),
  },
  hotAirBalloon: {
    viewBox: "0 0 80 110",
    width: 82,
    wobble: 3,
    drawing: (
      <>
        <path d="M40 2C18 2 4 18 4 38c0 18 18 32 26 42h20c8-10 26-24 26-42C76 18 62 2 40 2z" fill="var(--color-marigold-400)" {...outlined} />
        <path d="M40 2C30 12 26 26 28 44c1 14 3 26 6 36M40 2c10 10 14 24 12 42-1 14-3 26-6 36" fill="var(--color-coral-400)" {...outlined} />
        <path d="M31 80l2 14M49 80l-2 14" {...line} />
        <path d="M31 94h18v12H31z" fill="#c9975b" {...outlined} />
      </>
    ),
  },
  notes: {
    viewBox: "0 0 80 70",
    width: 66,
    wobble: 10,
    drawing: (
      <>
        <path d="M18 54V16l26-7v36" {...line} strokeWidth={2} />
        <path d="M18 16l26-7v7l-26 7z" fill="var(--color-ink-700)" {...outlined} />
        <ellipse cx="11" cy="55" rx="8" ry="6" fill="var(--color-ink-700)" {...outlined} />
        <ellipse cx="37" cy="46" rx="8" ry="6" fill="var(--color-ink-700)" {...outlined} />
        <path d="M66 42V20c2 5 8 6 9 12" {...line} strokeWidth={2} />
        <ellipse cx="60" cy="43" rx="7" ry="5" fill="var(--color-ink-700)" {...outlined} />
      </>
    ),
  },
};
