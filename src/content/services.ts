export type Service = {
  slug: string;
  name: string;
  blurb: string;
  startingPrice: string;
  accent: "marigold" | "periwinkle" | "coral";
};

/** Studio list prices, in USD. Change a number here and it updates everywhere. */
export const studioPrices = {
  mixing: 175,
  mastering: 60,
  recording: 75,
  consultation: 60,
  mixAndMaster: 210,
} as const;

/** Terms for studio projects — shown in the FAQ, terms, and auto-reply. */
export const studioTerms = {
  /** Share of the quote paid upfront to book the project. */
  depositPercent: 50,
  /** Included on every mix. */
  revisionRounds: 2,
  /** Price of each round past the included ones. */
  extraRevisionFee: 35,
  /** First version of a mix, in weeks. */
  firstVersionWeeks: 2,
  /** Lower rate for the first few clients, in exchange for a testimonial. Covers mixing only. */
  introMix: { price: 125, clients: 5 },
} as const;

export const services: Service[] = [
  {
    slug: "mixing",
    name: "Mixing",
    blurb: "A finished mix, with a first version within two weeks and two rounds of revisions.",
    startingPrice: `From $${studioPrices.mixing} a song`,
    accent: "marigold",
  },
  {
    slug: "mastering",
    name: "Mastering",
    blurb: "A final polish for a mix you’re already happy with.",
    startingPrice: `From $${studioPrices.mastering} a track`,
    accent: "periwinkle",
  },
  {
    slug: "recording",
    name: "Recording",
    blurb: "Vocals and instruments at my home studio, or remote vocal coaching over video.",
    startingPrice: `From $${studioPrices.recording} an hour`,
    accent: "coral",
  },
  {
    slug: "consultation",
    name: "An hour on your project",
    blurb: "An hour on a video call about your project, plus written notes. Paid up front.",
    startingPrice: `$${studioPrices.consultation}`,
    accent: "marigold",
  },
  {
    slug: "mix-master-bundle",
    name: "Mixing and mastering",
    blurb: "Both for about 10% less. A separate mastering engineer is better if your budget allows.",
    startingPrice: `From $${studioPrices.mixAndMaster} a song`,
    accent: "coral",
  },
];
