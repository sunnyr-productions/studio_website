export type Service = {
  slug: string;
  name: string;
  blurb: string;
  details: string[];
  startingPrice: string;
  accent: "marigold" | "periwinkle";
};

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
    blurb: "The final polish — competitive loudness, tonal balance, and consistency across your whole release.",
    details: [
      "Single track or full EP/album",
      "Reference-track matching on request",
      "DDP + individual file delivery",
    ],
    startingPrice: "Starting at $60/track",
    accent: "periwinkle",
  },
  {
    slug: "recording",
    name: "Recording Sessions",
    blurb: "Studio time for vocals, instruments, or full-band tracking, engineered start to finish.",
    details: [
      "Hourly or day-rate blocks",
      "Session files organized and delivered same week",
      "Remote or in-person options",
    ],
    startingPrice: "Starting at $75/hour",
    accent: "periwinkle",
  },
  {
    slug: "consultation",
    name: "Production Consultation",
    blurb: "A focused session going through your project together — arrangement, tone, or a stuck mix.",
    details: [
      "60-minute video call",
      "Written notes + marked-up session follow-up",
      "Great before you book a full mix",
    ],
    startingPrice: "Starting at $60/session",
    accent: "marigold",
  },
  {
    slug: "mix-master-bundle",
    name: "Mixing + Mastering Bundle",
    blurb: "Book both together for a discount — one engineer, one vision, from raw tracks to final master.",
    details: [
      "Same deliverables as mixing + mastering separately",
      "~10% savings vs. booking à la carte",
      "Great default for a single/EP release",
    ],
    startingPrice: "Starting at $210/song (vs. $235 à la carte)",
    accent: "marigold",
  },
];
