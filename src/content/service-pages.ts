import { studioPrices, studioTerms } from "@/content/services";

/**
 * Copy for each /studio/[slug] page, keyed by the slug in services.ts (which
 * owns the name and price). Written from Raul's interview answers
 * (docs/interview-answers.md, gitignored).
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

const { depositPercent, introMix } = studioTerms;

const payment = `A ${depositPercent}% deposit holds your spot, and you pay the rest before I send final files.`;

export const servicePages: Record<string, ServicePage> = {
  mixing: {
    h1: "Song mixing in Corvallis and remotely",
    metaTitle: "Song Mixing in Corvallis, OR and Remote",
    metaDescription: `Mixing from $${studioPrices.mixing} a song, with a first version within two weeks and two rounds of revisions.`,
    intro:
      "You send me the tracks and tell me what you’re going for, and I turn them into a finished mix. I want to bring out whatever you were feeling when you wrote the song, which means I need to hear from you before I hear from my plugins.",
    minPrice: studioPrices.mixing,
    sections: [
      {
        title: "What happens to your song",
        body: "I set the tempo, key and sample rate, then group everything by role: drums, bass, guitars, keys, pads, texture. It’s tedious, and it pays off for the rest of the mix. Nearly every song gets parallel saturation on the drums and parallel compression on everything else. Beyond that, it depends entirely on the song.",
      },
      {
        title: "When I break the rules",
        body: "On one dreamy song, I kept pushing the saturation until the whole mix was straining at the seams. A textbook would object, and it sounded like a daydream. I’ve also gotten this wrong in the other direction, as you can hear in the song I released twice.",
        link: { text: "the song I released twice", href: "/blog/the-song-i-mixed-twice" },
      },
      {
        title: "How I check it",
        body: "Last, I take it out into the world: my car, my phone, a laptop, the TV soundbar, a Bluetooth pill speaker, earbuds and headphones.",
      },
    ],
    needTitle: "Send me",
    need: [
      "WAV files that all start from the same point",
      "Track names that say what’s on them (please, I’m begging you)",
      "A rough mix and references, if you have them",
      "Notes on what’s working and what isn’t",
    ],
    getTitle: "You’ll get",
    get: ["The finished mix as a WAV and an MP3, or any other format you need", "Two rounds of revisions"],
    howItRuns: `You’ll get a quote first, and a ${depositPercent}% deposit holds your spot. The first version arrives within two weeks, and you pay the rest before I send final files.`,
    faqs: [
      {
        q: "Who have you mixed for?",
        a: `Mostly myself and friends, so far. That’s why my first five clients pay $${introMix.price} a song, and why I ask them for a testimonial and the OK to share the result. Mastering, if you want it, stays at the regular price.`,
      },
      { q: "What if I have a lot of tracks?", a: "The price covers up to 48, and I’m flexible if we talk about it first." },
      {
        q: "Can I have the session file?",
        a: "It isn’t included, though stems and multitracks are available as an add-on. If you’re curious what I did, we can open it up in a lesson at a discount.",
      },
      {
        q: "What counts as new work?",
        a: "Re-recording a vocal or changing the arrangement falls outside your revisions, so I’ll quote it first.",
      },
    ],
    closingTitle: "Ready when you are.",
    closingBody: "Send a link and a few words about the song, and you’ll have a quote within 2 business days.",
    ctaLabel: "Get a mixing quote",
  },
  mastering: {
    h1: "Audio mastering in Corvallis and remotely",
    metaTitle: "Audio Mastering in Corvallis, OR and Remote",
    metaDescription: `Mastering from $${studioPrices.mastering} a track for singles, EPs and albums.`,
    intro:
      "Mastering should be hard to notice. It’s one last look from someone who wasn’t in the room for the mix, catching whatever slipped through before a song goes out. Ideally that’s a different person from your mix engineer.",
    minPrice: studioPrices.mastering,
    sections: [
      {
        title: "Is your mix ready?",
        body: "Ask yourself whether you’d release it as it stands. If not, it needs more work before it gets to me, because big changes belong in the arrangement, the production or the mix. I’ll tell you if I think that’s where you are.",
      },
    ],
    needTitle: "Send me",
    need: ["Your finished mix as a WAV, with no clipping", "A reference track, if you have a sound in mind"],
    getTitle: "You’ll get",
    get: ["The master as a WAV and an MP3, or any other format you need"],
    faqs: [
      {
        q: "Can you do a whole EP?",
        a: `Yes. A single track starts at $${studioPrices.mastering}, and a full EP or album gets one quote for the whole project.`,
      },
      { q: "How loud will it be?", a: "Competitive with other releases, without flattening it to get there." },
      { q: "How do I pay?", a: payment },
    ],
    closingTitle: "Finished mixing?",
    closingBody: "Send a link and tell me how many tracks you have, and you’ll have a quote within 2 business days.",
    ctaLabel: "Get a mastering quote",
  },
  recording: {
    h1: "Recording sessions in Corvallis",
    metaTitle: "Recording Sessions in Corvallis, OR",
    metaDescription: `Record vocals or instruments in a home studio from $${studioPrices.recording} an hour, or get vocal coaching over video.`,
    intro:
      "Recording here means a converted bedroom upstairs in my house, with acoustic panels on the walls, a futon to sit on and LED lights in whatever color helps. It’s small, so it suits singers and individual instruments. There’s a garage below it and nobody above, so you can actually let go, which I couldn’t do when I recorded my first single in a college apartment.",
    minPrice: studioPrices.recording,
    sections: [
      {
        title: "How a session goes",
        body: "The session will be set up before you arrive. We start by going over what we’re tracking, what you’d like to hear in your headphones, and click or no click. I like getting a rough version of every part down first, so the whole song is there to react to, and then we go back through and improve them one at a time.",
      },
      {
        title: "Red light syndrome",
        body: "Most people sing differently the moment they know it counts. I saw it producing vocals with my a cappella group, and I deal with it at work, where my job is partly making guests forget about the microphones. So we’ll take our time, and I’ll keep it relaxed until you’re sounding like yourself again.",
      },
      {
        title: "What won’t fit",
        body: "A full band won’t fit, and a drum kit probably wouldn’t sound great. We can rent a bigger room for those, and I’ll record or produce you there.",
      },
      {
        title: "Recording from home",
        body: "If you’re not local, I can coach you through your own vocal takes over video, from setting levels to working through the song.",
      },
    ],
    needTitle: "Tell me",
    need: ["What you’re recording and roughly how many parts", "Any demo you have", "When you’d like to come in"],
    getTitle: "You’ll get",
    get: ["The multitracks and a rough bounce, that same week"],
    faqs: [
      {
        q: "Where are you?",
        a: "Southtown, with free parking on the street. You’ll get the address when you book.",
      },
      {
        q: "Anything I should know before coming over?",
        a: "Walk in rather than knocking or ringing, because of my dog, who also sheds a lot. The studio is upstairs and we ask for shoes off up there unless that’s a problem.",
      },
      { q: "Can you mix what we record?", a: "Yes, and I’ll quote that separately." },
    ],
    closingTitle: "Want to book some time?",
    closingBody:
      "Let me know what you’d like to track and what times suit you. We’ll talk before anything’s booked, and you’ll hear it from me if I’m not the right person for it.",
    ctaLabel: "Ask about a session",
  },
};
