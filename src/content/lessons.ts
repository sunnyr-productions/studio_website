export type LessonType = {
  slug: string;
  name: string;
  blurb: string;
  format: string;
  accent: "marigold" | "periwinkle";
  featured?: boolean;
};

export const lessonTypes: LessonType[] = [
  {
    slug: "vocal",
    name: "Vocal Lessons",
    blurb:
      "Technique, range, and performance confidence — drawing on years coaching a cappella singers through both the vocal and stage-presence side of things.",
    format: "In-person or online",
    accent: "marigold",
    featured: true,
  },
  {
    slug: "guitar",
    name: "Guitar Lessons",
    blurb:
      "From your first chords to writing your own songs, taught at whatever pace keeps it fun. 16 years of playing behind every lesson.",
    format: "Best in-person (hands-on technique is tough fully remote)",
    accent: "periwinkle",
  },
  {
    slug: "production",
    name: "Music Production / DAW Lessons",
    blurb:
      "Songwriting, beat-making, and arranging inside Ableton, Logic, or Pro Tools — plus whatever other instruments come up along the way.",
    format: "In-person or online",
    accent: "marigold",
  },
  {
    slug: "audio-engineering",
    name: "Audio Engineering / Recording Lessons",
    blurb:
      "Mixing, mic technique, and setting up a home studio that actually sounds good — backed by day-to-day engineering work in podcast production.",
    format: "In-person or online",
    accent: "periwinkle",
  },
];

/**
 * Lesson pricing — the single source for every price shown on the site
 * (lessons page, FAQ, how-it-works, contact copy, policies). Change a number
 * here and it updates everywhere.
 */
export const lessonPricing = {
  hourlyRate: 45,
  trial: { price: 20, minutes: 30 },
  pack: { lessons: 4, price: 160 },
  /** Free cancellation/reschedule window, in hours before the lesson. */
  cancellationNoticeHours: 24,
  /** How lessons are paid — in person, at the lesson. */
  paymentMethods: "cash or Venmo",
} as const;

const { hourlyRate, trial, pack } = lessonPricing;
const packPerLesson = pack.price / pack.lessons;
const packSavings = hourlyRate * pack.lessons - pack.price;

/** Short phrase for running copy, e.g. "a $25 half-hour trial". */
export const trialPhrase = `a $${trial.price} ${trial.minutes === 30 ? "half-hour" : `${trial.minutes}-minute`} trial`;

export type PricingTier = {
  name: string;
  price: string;
  forWho: string;
  accent: "marigold" | "periwinkle";
};

export const pricingTiers: PricingTier[] = [
  {
    name: "Trial Lesson",
    price: `$${trial.price} / ${trial.minutes} min`,
    forWho: "A first meeting, face to face, to see if it's a good fit. The fee just holds the time — questions by message are always free.",
    accent: "marigold",
  },
  {
    name: "Single Lesson",
    price: `$${hourlyRate} / hour`,
    forWho: "Same flat rate across guitar, vocal, production, and audio engineering lessons.",
    accent: "periwinkle",
  },
  {
    name: `${pack.lessons}-Lesson Pack`,
    price: `$${pack.price} ($${packPerLesson} / lesson)`,
    forWho: `Save $${packSavings} vs. ${pack.lessons} singles — for students ready to commit to steady, regular progress.`,
    accent: "marigold",
  },
];
