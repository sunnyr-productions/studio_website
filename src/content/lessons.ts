export type LessonType = {
  slug: string;
  name: string;
  blurb: string;
  format: string;
  accent: "marigold" | "periwinkle" | "coral";
  featured?: boolean;
};

export const lessonTypes: LessonType[] = [
  {
    slug: "guitar",
    name: "Guitar",
    blurb: "The songs you actually listen to, at your level, in a way that works for your hands.",
    format: "Best in person, since I need to see your hands",
    accent: "periwinkle",
  },
  {
    slug: "vocal",
    name: "Voice",
    blurb: "For anyone who wants to sing, especially if you’re embarrassed to.",
    format: "In-person or online",
    accent: "marigold",
  },
  {
    slug: "production",
    name: "Music production",
    blurb: "How to build a track in Logic, from your first groove to something you can play for your friends.",
    format: "In-person or online",
    accent: "coral",
  },
  {
    slug: "audio-engineering",
    name: "Audio engineering",
    blurb: "For people already making music. We open your song and talk through the decisions.",
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
  hourlyRate: 50,
  trial: { price: 20, minutes: 30 },
  pack: { lessons: 4, price: 180 },
  /** Free cancellation/reschedule window, in hours before the lesson. */
  cancellationNoticeHours: 24,
  /** Share of the lesson charged when cancelling inside that window. No-shows pay in full. */
  lateCancelPercent: 50,
  /** How lessons are paid — in person, at the lesson. */
  paymentMethods: "cash, Venmo or Zelle",
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
  accent: "marigold" | "periwinkle" | "coral";
};

export const pricingTiers: PricingTier[] = [
  {
    name: "Trial Lesson",
    price: `$${trial.price} / ${trial.minutes} min`,
    forWho: "Half an hour to see if we get along. The fee just holds the time.",
    accent: "marigold",
  },
  {
    name: "Single Lesson",
    price: `$${hourlyRate} / hour`,
    forWho: "Same price whatever we're working on: guitar, voice, production, or engineering.",
    accent: "periwinkle",
  },
  {
    name: `${pack.lessons}-Lesson Pack`,
    price: `$${pack.price} ($${packPerLesson} / lesson)`,
    forWho: `Saves you $${packSavings} over booking ${pack.lessons} one at a time. Good once you know you're sticking with it.`,
    accent: "coral",
  },
];
