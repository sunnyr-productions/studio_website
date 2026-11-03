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
    blurb: "Your tracks go in and a finished mix comes out, with a first version inside two weeks and two rounds of notes included.",
    startingPrice: `From $${studioPrices.mixing} a song`,
    accent: "marigold",
  },
  {
    slug: "mastering",
    name: "Mastering",
    blurb: "One last careful pass on a mix you’re already happy with.",
    startingPrice: `From $${studioPrices.mastering} a track`,
    accent: "periwinkle",
  },
  {
    slug: "recording",
    name: "Recording",
    blurb: "Vocals and instruments at my place, or a rented room if you’re bringing a band. I can also coach your vocal takes over video.",
    startingPrice: `From $${studioPrices.recording} an hour`,
    accent: "coral",
  },
  {
    slug: "consultation",
    name: "An hour on your project",
    blurb: "Sixty minutes on a video call about whatever’s stuck, followed by written notes, paid up front.",
    startingPrice: `$${studioPrices.consultation}`,
    accent: "marigold",
  },
  {
    slug: "mix-master-bundle",
    name: "Mixing and mastering",
    blurb: "Both from one person, for about 10% below the separate prices. A second set of ears on the master is better if you can swing it.",
    startingPrice: `From $${studioPrices.mixAndMaster} a song`,
    accent: "coral",
  },
];
