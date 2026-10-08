export type Service = {
  slug: string;
  name: string;
  blurb: string;
  details: string[];
  startingPrice: string;
  accent: "marigold" | "periwinkle" | "coral";
};

/** Payment terms for studio projects — shown in the FAQ, terms, and auto-reply. */
export const studioTerms = {
  /** Share of the quote paid upfront to book the project. */
  depositPercent: 50,
} as const;

export const services: Service[] = [
  {
    slug: "mixing",
    name: "Mixing",
    blurb: "Turning your raw tracks into a balanced, punchy final mix that translates on any speaker.",
    details: [
      "Up to 48 tracks per session",
      "2 rounds of revisions included",
      "Delivered in WAV + streaming-ready MP3",
    ],
    startingPrice: "Starting at $175/song",
    accent: "marigold",
  },
  {
    slug: "mastering",
    name: "Mastering",
    blurb: "The final polish: competitive loudness, tonal balance, and consistency across your whole release.",
    details: [
      "Single track or full EP/album",
      "Reference-track matching on request",
      "Delivered in WAV + streaming-ready MP3",
    ],
    startingPrice: "Starting at $60/track",
    accent: "periwinkle",
  },
  {
    slug: "recording",
    name: "Recording Sessions",
    blurb: "Studio time for vocals and instruments, tracked one or two parts at a time and built up in layers, engineered start to finish.",
    details: [
      "Hourly or day-rate blocks",
      "Session files organized and delivered same week",
      "In person in Corvallis, or remote (you record, I direct over video)",
    ],
    startingPrice: "Starting at $75/hour",
    accent: "coral",
  },
  {
    slug: "consultation",
    name: "Production Consultation",
    blurb: "A focused session going through your project together: arrangement, tone, or a stuck mix.",
    details: [
      "60-minute video call",
      "Written notes + marked-up session follow-up",
      "Great before you book a full mix",
    ],
    startingPrice: "$60/session",
    accent: "marigold",
  },
  {
    slug: "mix-master-bundle",
    name: "Mixing + Mastering Bundle",
    blurb: "Book both together for a discount: one engineer, one vision, from raw tracks to final master.",
    details: [
      "Same deliverables as mixing + mastering separately",
      "~10% savings vs. booking à la carte",
      "Great default for a single/EP release",
    ],
    startingPrice: "Starting at $210/song (vs. $235 à la carte)",
    accent: "coral",
  },
];
