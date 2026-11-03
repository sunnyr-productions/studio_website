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
    blurb: "Acoustic or electric, using songs you already love, simplified as far as your hands need.",
    accent: "periwinkle",
  },
  {
    slug: "vocal",
    name: "Voice",
    blurb: "Whether you want to sing on a stage or just stop mouthing the words in the car.",
    accent: "marigold",
  },
  {
    slug: "production",
    name: "Music production",
    blurb: "Making tracks from nothing in Logic: grooves, sounds, synths and how a song gets put together.",
    accent: "coral",
  },
  {
    slug: "audio-engineering",
    name: "Audio engineering",
    blurb: "For people who already make music and want it to sound more like what they hear in their heads.",
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
    forWho: "A low-stakes way to find out if we click.",
    accent: "marigold",
  },
  {
    name: "Single lesson",
    price: `$${hourlyRate} an hour`,
    forWho: "Book them one at a time for as long as you like.",
    accent: "periwinkle",
  },
  {
    name: "Four lessons",
    price: `$${pack.price}`,
    forWho: `That’s $${packPerLesson} each, or $${packSavings} less than paying one at a time, and it makes sense once you’re sure.`,
    accent: "coral",
  },
];
