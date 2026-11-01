import { homeVisitNote, studioTerms } from "@/content/services";

/**
 * Copy for each /studio/[slug] page, keyed by the slug in services.ts (which
 * owns the name, details and price). Written from Raul's interview answers
 * (docs/interview-answers.md, gitignored).
 */
export type ServicePage = {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Lowest price in USD, for structured data. */
  minPrice: number;
  /** Longer sections on how Raul works, shown after the need/get cards. */
  sections: { title: string; body: string }[];
  needTitle: string;
  need: string[];
  getTitle: string;
  get: string[];
  /** How the job runs, in a sentence or two. */
  howItRuns: string;
  faqs: { q: string; a: string }[];
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
};

const { depositPercent, extraRevisionFee, firstVersionWeeks, introMix, revisionRounds } = studioTerms;

const deposit = `A ${depositPercent}% deposit holds your spot, and the rest is due before I send final files.`;

const revisionsFaq = {
  q: "How do revisions work?",
  a: `${revisionRounds} rounds are included. A round is one list of notes sent together, so it helps to listen a few times and collect your thoughts first. Extra rounds are $${extraRevisionFee} each. A re-recorded vocal or a changed arrangement is new work, and I'll quote it before I start.`,
};

const sessionFilesFaq = {
  q: "Do I get the session?",
  a: "You get the finished files. Stems or multitracks can be added on. If you want to see how I built the mix, we can go through the session in a mixing lesson, and I can discount that if I mixed your song.",
};

export const servicePages: Record<string, ServicePage> = {
  mixing: {
    h1: "Mixing",
    metaTitle: "Song Mixing in Corvallis, OR (and Remote)",
    metaDescription:
      "Mixing from $175/song in Corvallis, Oregon or remotely. First version within 2 weeks, with two revision rounds included.",
    intro:
      "Before I change anything, I listen to your whole song as you sent it. If you send a reference, I'll want to know what you like about it: the tone, the balance, how one instrument sounds. My first job is figuring out what you want the song to do.",
    minPrice: 175,
    sections: [
      {
        title: "How I work",
        body: "I start with the tedious part, which is organizing and grouping all the tracks, because it makes everything easier later. Then I mix from the top down, in small, broad strokes instead of dramatic changes. The emotion you intended is already in there, and I'm trying to bring it out.",
      },
      {
        title: "If we disagree",
        body: "Everything's worth a try. If you send a note I don't agree with, I'll still give you your version, and I'll give you mine too. Then you can listen and decide.",
      },
      {
        title: "The right mix isn't always the correct one",
        body: "On one daydreamy song, I pushed the saturation until the mix was bursting at the seams. It wasn't what a textbook would tell you to do, but it suited the song. I've made the opposite mistake too: on my first release, I processed every track until each one sounded great, and ended up with a muddy mix where you couldn't tell what I was singing.",
      },
      {
        title: "Where I check it",
        body: "Studio monitors and my own headphones first, then the car, a phone, a laptop, a TV soundbar, a little Bluetooth pill speaker, and earbuds.",
      },
    ],
    needTitle: "What I need from you",
    need: [
      "Your tracks as WAV files, all starting at the same point so they line up",
      "Clear names on every track. \"Drum overhead left\" saves me a lot of guessing",
      "A rough mix or a reference song, if you have one",
      "What you like about it so far, and what bugs you",
    ],
    getTitle: "What you get back",
    get: [
      "The mix as a WAV and a streaming-ready MP3",
      `${revisionRounds} rounds of revisions`,
    ],
    howItRuns: `I'll quote it before I start. ${deposit} You'll have a first version within ${firstVersionWeeks} weeks, and I can often go quicker if you need it.`,
    faqs: [
      { q: "Who have you mixed for?", a: `Mixing for clients is a new business for me. So far I've mixed my own releases and projects with friends, and I do audio for a living in podcast production. My first ${introMix.clients} mixing clients pay $${introMix.price} a song instead of $175, in exchange for a testimonial and permission to show the work.` },
      { q: "How many tracks can a session have?", a: "Up to 48. If your song is bigger than that, tell me and we can talk about it." },
      revisionsFaq,
      sessionFilesFaq,
      { q: "Should I get it mastered too?", a: "Usually, if you're releasing it. Ideally that's someone other than your mix engineer, but I can do both if budget or simplicity matters more." },
    ],
    closingTitle: "Got a song ready to mix?",
    closingBody: "Send me a link and tell me what you're going for. I'll get back to you with a quote within 2 business days.",
    ctaLabel: "Get a mixing quote",
  },
  mastering: {
    h1: "Mastering",
    metaTitle: "Audio Mastering in Corvallis, OR (and Remote)",
    metaDescription:
      "Mastering from $60/track in Corvallis, Oregon or remotely. The final polish on a finished mix, for a single or a whole EP or album.",
    intro:
      "When mastering is done well, it's subtle. It's the final polish, ideally by someone who didn't work on the mix, meant to catch any loose ends.",
    minPrice: 60,
    sections: [
      {
        title: "Is your mix ready?",
        body: "Here's the test: if you wouldn't be okay releasing the mix as it is, without mastering, it probably isn't ready. If you're hoping for something drastic, that usually needs to happen in the arrangement, production or mix. I'll tell you if I think that's the case.",
      },
    ],
    needTitle: "What I need from you",
    need: [
      "Your finished mix as a WAV, not clipping",
      "A reference track, if there's a sound you're going for",
    ],
    getTitle: "What you get back",
    get: ["The master as a WAV and a streaming-ready MP3"],
    howItRuns: `I work from a finished mix. If yours isn't there yet, start with mixing. ${deposit}`,
    faqs: [
      { q: "One song or a whole EP?", a: "Either. Single tracks start at $60, and I'll quote an EP or album as a set." },
      { q: "How loud will it be?", a: "Loud enough to hold up next to other releases, without squashing it. I wrote more about that in my post on LUFS." },
    ],
    closingTitle: "Is your mix finished?",
    closingBody: "Send me a link and tell me how many tracks there are. I'll get back to you with a quote within 2 business days.",
    ctaLabel: "Get a mastering quote",
  },
  recording: {
    h1: "Recording sessions",
    metaTitle: "Recording Studio Sessions in Corvallis, OR",
    metaDescription:
      "Record vocals or instruments at a treated home studio in Corvallis, Oregon from $75/hour, or get coached through recording vocals at home over video.",
    intro:
      "The studio is a converted bedroom in my house in Corvallis, with acoustic panels, a futon and LED lights you can set however you like. It's not a grand space, but it works well for vocals and individual instruments.",
    minPrice: 75,
    sections: [
      {
        title: "How a session goes",
        body: "I set up and organize the session before you get here. When you arrive, we go through what we're recording and how, what you want in your headphones, and whether you want a click. Then we take each part one by one. I like putting down a scratch version of every part first, so we have the structure of the song before we try to refine anything.",
      },
      {
        title: "Forgetting you're recording",
        body: "People get in their own heads when they're recording and can hear themselves back. When I helped produce vocals for my a cappella group, a lot of the job was helping everyone feel like they were back in the garage where we rehearsed. At my day job, I want people to forget the microphones are there and feel like they're talking in a living room. It's the same idea here.",
      },
      {
        title: "What doesn't fit",
        body: "I can't really record a full band here, and a full drum kit probably wouldn't work either. For anything bigger, we can rent a studio and I can record or produce you there.",
      },
      {
        title: "Recording from home",
        body: "If you're not nearby, I can coach you through recording vocals at home over video. I'll help you set your levels and coach you through the takes the same way I would in person.",
      },
    ],
    needTitle: "Tell me",
    need: [
      "What you want to record, and roughly how many parts",
      "Any demo that shows where the song is going",
      "When you'd like to come in",
    ],
    getTitle: "What you get back",
    get: ["Your multitracks and a rough bounce, the same week"],
    howItRuns: `Sessions are quoted up front. ${deposit}`,
    faqs: [
      { q: "Where is the studio?", a: "Southtown, Corvallis, with free street parking nearby. I send the exact address when you book." },
      { q: "What should I know before I come over?", a: homeVisitNote },
      { q: "Can you mix it afterward?", a: "Yes. Mixing and mastering are quoted separately." },
    ],
    closingTitle: "Want to book some time?",
    closingBody: "Tell me what you're recording and when you're free. We'll talk before you book, and if I don't think I can help, I'll say so.",
    ctaLabel: "Ask about a session",
  },
  consultation: {
    h1: "An hour on your project",
    metaTitle: "Music Production Consultation",
    metaDescription:
      "A 60-minute video call going through your project: a stuck mix, an arrangement that isn't working, or a second opinion. $60 per session.",
    intro:
      "We get on a video call for an hour and go through your project together. It's good for a stuck mix, an arrangement that isn't working, or a second opinion before you pay for a full mix.",
    minPrice: 60,
    sections: [],
    needTitle: "Send me",
    need: ["A link to the song or session", "A few lines on what's bothering you"],
    getTitle: "What you get",
    get: ["The 60-minute call", "Written notes afterward, including notes on your session"],
    howItRuns: "It's $60. Message me and we'll find a time.",
    faqs: [
      { q: "Is it just for mixing?", a: "No. Arrangement and sound choices are fair game, and so is asking whether a song is ready." },
    ],
    closingTitle: "Stuck on something?",
    closingBody: "Tell me what it is and we'll find an hour.",
    ctaLabel: "Book a consultation",
  },
  "mix-master-bundle": {
    h1: "Mixing and mastering together",
    metaTitle: "Mixing + Mastering Bundle in Corvallis, OR",
    metaDescription:
      "Mixing and mastering together from $210/song in Corvallis, Oregon or remotely. A simpler, cheaper option when hiring two people doesn't fit.",
    intro:
      "If you need both, you can book them together. It starts at $210 a song instead of $235. Ideally, mastering is done by someone who didn't work on the mix, and if your budget allows for that, I'd encourage it. If budget or simplicity matters more, I'll do both.",
    minPrice: 210,
    sections: [],
    needTitle: "What I need from you",
    need: ["Your raw tracks as WAV files, clearly named", "A reference song or two", "Your release date, if you have one"],
    getTitle: "What you get back",
    get: ["The final master as a WAV and a streaming-ready MP3", `${revisionRounds} rounds of revisions on the mix`],
    howItRuns: `I mix first, we go through your notes, then I master it. ${deposit}`,
    faqs: [revisionsFaq, sessionFilesFaq],
    closingTitle: "Got a release coming up?",
    closingBody: "Send me a link and your date. I'll get back to you with a quote within 2 business days.",
    ctaLabel: "Get a quote",
  },
};
