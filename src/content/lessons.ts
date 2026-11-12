export type LessonType = {
  slug: string;
  name: string;
  blurb: string;
  accent: "marigold" | "periwinkle" | "coral";
};

export const lessonTypes: LessonType[] = [
  {
    slug: "guitar",
    name: "Guitar",
    blurb: "Acoustic or electric, any level, using songs you want to play.",
    accent: "periwinkle",
  },
  {
    slug: "vocal",
    name: "Voice",
    blurb: "Contemporary and pop singing, nervous beginners included.",
    accent: "marigold",
  },
  {
    slug: "production",
    name: "Music production",
    blurb: "Making tracks from scratch: grooves, sounds, synths and arrangement.",
    accent: "coral",
  },
  {
    slug: "audio-engineering",
    name: "Audio engineering",
    blurb: "Recording and mixing your own songs so they sound the way you hear them.",
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
    name: "Trial",
    price: `$${trial.price} for ${trial.minutes} minutes`,
    forWho: "A half hour to see if we’re a good fit.",
    accent: "marigold",
  },
  {
    name: "Single lesson",
    price: `$${hourlyRate} an hour`,
    forWho: "Pay as you go.",
    accent: "periwinkle",
  },
  {
    name: "Four lessons",
    price: `$${pack.price}`,
    forWho: `$${packPerLesson} a lesson, which saves you $${packSavings}.`,
    accent: "coral",
  },
];
