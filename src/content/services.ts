export type Service = {
  slug: string;
  name: string;
  blurb: string;
  details: string[];
  startingPrice: string;
  accent: "marigold" | "periwinkle" | "coral";
};

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
  /** Lower rate for the first few clients, in exchange for a testimonial. */
  introMix: { price: 125, clients: 5 },
} as const;

/** What anyone coming to the house should know. */
export const homeVisitNote =
  "The studio is upstairs and carpeted, so we prefer no shoes up there, though we can make exceptions. I have a friendly dog who sheds a fair amount, so tell me if you have allergies. Please don't knock or ring the bell, because that's the one thing that sets him off. The door will be unlocked, and I'll probably be waiting outside the first time you come.";

export const services: Service[] = [
  {
    slug: "mixing",
    name: "Mixing",
    blurb: "You send me your tracks. I find out what you want the song to do, then shape the mix to get it there.",
    details: [
      "Up to 48 tracks, and we can talk if you have more",
      `${studioTerms.revisionRounds} rounds of revisions`,
      `First version within ${studioTerms.firstVersionWeeks} weeks`,
    ],
    startingPrice: "Starting at $175/song",
    accent: "marigold",
  },
  {
    slug: "mastering",
    name: "Mastering",
    blurb: "The final polish before release, meant to catch any loose ends. Done well, it's subtle.",
    details: [
      "Single track or full EP/album",
      "I can work from a reference track if you want",
      "WAV and streaming-ready MP3",
    ],
    startingPrice: "Starting at $60/track",
    accent: "periwinkle",
  },
  {
    slug: "recording",
    name: "Recording Sessions",
    blurb: "Record vocals or instruments in my home studio. We put down a scratch version of each part first, then refine from there.",
    details: [
      "Multitracks and a rough bounce the same week",
      "Solo artists and small groups here, full bands at a rented studio",
      "Vocal coaching over video if you're recording at home",
    ],
    startingPrice: "Starting at $75/hour",
    accent: "coral",
  },
  {
    slug: "consultation",
    name: "Production Consultation",
    blurb: "An hour on a call, going through your project together. Good for a stuck mix, an arrangement that isn't working, or a second opinion.",
    details: [
      "60-minute video call",
      "Written notes afterward",
      "Worth doing before you pay for a full mix",
    ],
    startingPrice: "$60/session",
    accent: "marigold",
  },
  {
    slug: "mix-master-bundle",
    name: "Mixing + Mastering Bundle",
    blurb: "Book both together and it costs a little less. It's simpler and cheaper than hiring two people.",
    details: [
      "About 10% less than booking them separately",
      "One person to deal with from start to finish",
      "A separate mastering engineer is still the ideal, if your budget allows",
    ],
    startingPrice: "Starting at $210/song",
    accent: "coral",
  },
];
