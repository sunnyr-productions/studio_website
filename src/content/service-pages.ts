import { studioPrices, studioTerms } from "@/content/services";

/**
 * Copy for each /studio/[slug] page, keyed by the slug in services.ts (which
 * owns the name and price). See docs/VOICE.md: short, focused, no side stories.
 */
export type ServicePage = {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Lowest price in USD, for structured data. */
  minPrice: number;
  /** Shown after the need/get cards. `link` turns those words of the body into a link. */
  sections: { title: string; body: string; link?: { text: string; href: string } }[];
  needTitle: string;
  need: string[];
  getTitle: string;
  get: string[];
  /** How the job runs, in a sentence or two. */
  howItRuns?: string;
  faqs: { q: string; a: string }[];
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

const { depositPercent, introMix, revisionRounds, firstVersionWeeks } = studioTerms;

const payment = `A ${depositPercent}% deposit holds your spot, and the rest is due before I send the final files.`;

export const servicePages: Record<string, ServicePage> = {
  mixing: {
    h1: "Song mixing in Corvallis and remotely",
    metaTitle: "Song Mixing in Corvallis, OR and Remote",
    metaDescription: `Mixing from $${studioPrices.mixing} a song, with a first version within ${firstVersionWeeks} weeks and ${revisionRounds} rounds of revisions included.`,
    intro: "Send me your tracks and a sense of what you’re going for, and I’ll send back a finished mix.",
    minPrice: studioPrices.mixing,
    sections: [
      {
        title: "How I mix",
        body: "I start by organizing the session and listening, including to any reference tracks you send. I work from the top down, on groups of tracks before individual ones, and check the mix on everything from earbuds to a car stereo before you hear it.",
      },
    ],
    needTitle: "Send me",
    need: [
      "WAV files that all start at the same point",
      "Tracks named for what’s on them",
      "A rough mix and references, if you have them",
      "Notes on what’s working and what isn’t",
    ],
    getTitle: "You’ll get",
    get: ["The finished mix as a WAV and an MP3, or any format you need", `${revisionRounds} rounds of revisions`],
    howItRuns: `You’ll get a quote first. A ${depositPercent}% deposit holds your spot, the first version arrives within ${firstVersionWeeks} weeks, and the rest is due before final files.`,
    faqs: [
      {
        q: "Who have you mixed for?",
        a: `Mostly myself and friends so far, which is why my first five clients pay $${introMix.price} a song in exchange for a testimonial.`,
      },
      { q: "What if I have a lot of tracks?", a: "The price covers up to 48. If you have more, let’s talk first." },
      {
        q: "Can I have the session file?",
        a: "It isn’t included, but stems and multitracks are available as an add-on. We can also go through the session together in a discounted lesson.",
      },
      {
        q: "What counts as new work?",
        a: "Re-recording a part or changing the arrangement isn’t a revision, so I’ll quote it separately.",
      },
    ],
    closingTitle: "Got a song?",
    closingBody: "Send a link and a few words about it. You’ll have a quote within 2 business days.",
    ctaLabel: "Get a mixing quote",
  },
  mastering: {
    h1: "Audio mastering in Corvallis and remotely",
    metaTitle: "Audio Mastering in Corvallis, OR and Remote",
    metaDescription: `Mastering from $${studioPrices.mastering} a track for singles, EPs and albums.`,
    intro:
      "Mastering is the final polish on a finished mix. Done well, it’s subtle. Ideally, it’s done by someone other than your mix engineer.",
    minPrice: studioPrices.mastering,
    sections: [
      {
        title: "Is your mix ready?",
        body: "If you wouldn’t release it as it is, it isn’t ready for mastering yet. Big changes belong in the mix.",
      },
    ],
    needTitle: "Send me",
    need: ["Your finished mix as a WAV, with no clipping", "A reference track, if you have one"],
    getTitle: "You’ll get",
    get: ["The master as a WAV and an MP3, or any format you need"],
    faqs: [
      {
        q: "Can you master a whole EP?",
        a: `Yes. Single tracks start at $${studioPrices.mastering}, and an EP or album gets one quote for the whole project.`,
      },
      { q: "How loud will it be?", a: "Loud enough to sit alongside other releases, without crushing the dynamics." },
      { q: "How do I pay?", a: payment },
    ],
    closingTitle: "Mix finished?",
    closingBody: "Send a link and tell me how many tracks. You’ll have a quote within 2 business days.",
    ctaLabel: "Get a mastering quote",
  },
  recording: {
    h1: "Recording sessions in Corvallis",
    metaTitle: "Recording Sessions in Corvallis, OR",
    metaDescription: `Record vocals or instruments in a home studio from $${studioPrices.recording} an hour, or get coached through your own vocal takes over video.`,
    intro:
      "Recording at my home studio in Corvallis’s Southtown neighborhood: a small, acoustically treated room that works best for vocals and single instruments.",
    minPrice: studioPrices.recording,
    sections: [
      {
        title: "How a session goes",
        body: "Everything’s set up before you arrive. We agree on what we’re recording and what you want in your headphones, put down a rough version of each part, then refine them. The goal is a relaxed session where you sound like yourself.",
      },
      {
        title: "Bands and drums",
        body: "The room is too small for a full band or a drum kit. For those, we can rent a bigger space and I’ll record you there.",
      },
      {
        title: "Recording from home",
        body: "If you’re not local, I can coach you through recording your own vocals over video.",
      },
    ],
    needTitle: "Tell me",
    need: ["What you’re recording and roughly how many parts", "Any demo you have", "When you’d like to come in"],
    getTitle: "You’ll get",
    get: ["The multitracks and a rough mix, the same week"],
    faqs: [
      {
        q: "Where are you?",
        a: "Southtown Corvallis, with free street parking. You’ll get the address when you book.",
      },
      {
        q: "Anything I should know before coming over?",
        a: "Please don’t knock or ring, since that sets off my dog. Come right in. He sheds, so let me know about allergies. The studio is upstairs, and we ask for shoes off.",
      },
      { q: "Can you mix what we record?", a: "Yes. I’ll quote the mix separately." },
    ],
    closingTitle: "Want to book a session?",
    closingBody: "Tell me what you’d like to record and when works for you. We’ll talk it through before anything’s booked.",
    ctaLabel: "Ask about a session",
  },
};
