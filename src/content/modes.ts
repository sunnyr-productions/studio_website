/**
 * Copy for the two doors into the same practice, each with its own page.
 *
 * "lessons" is the teaching side (warm, marigold-forward) at /lessons; "studio"
 * is the client-work side (periwinkle-forward) at /studio. Both headlines share a deliberate
 * cadence ("Let's make your ___ a little ___er") so the doors read as
 * siblings rather than two unrelated businesses.
 */
import { lessonPricing, trialPhrase } from "@/content/lessons";
import { neurodivergentPage } from "@/content/neurodivergent-page";
import { studioTerms } from "@/content/services";

export type StudioMode = "lessons" | "studio";

export type ModeContent = {
  id: StudioMode;
  /** Label on this door's card on the homepage. */
  doorLabel: string;
  eyebrow: string;
  /** Headline is split so the final word can carry the hand-drawn Scribble. */
  headlineLead: string;
  headlineAccent: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  valueProps: { title: string; body: string }[];
  /** Scannable credibility strip shown near the top — real proof points. */
  stats: { value: string; label: string }[];
  /** "How it works" — three plain steps to lower first-contact friction. */
  steps: { title: string; body: string }[];
  faqs: { q: string; a: string; link?: { label: string; href: string } }[];
};

export const modes: Record<StudioMode, ModeContent> = {
  lessons: {
    id: "lessons",
    doorLabel: "Learn with me",
    eyebrow: "Music Lessons · Corvallis, OR & online",
    headlineLead: "Let's make your sound a little",
    headlineAccent: "sunnier",
    body:
      "I teach guitar, voice, production, and audio engineering, and I teach them patiently. There's no set curriculum and nobody's judging. We start with the music you want to make and go from there.",
    primaryCta: { label: "Book a trial", href: "/lessons#book" },
    secondaryCta: { label: "Ask a question", href: "/contact?service=lessons" },
    valueProps: [
      {
        title: "You set the pace",
        body: "I'm neurodivergent myself, so I know a fixed lesson plan doesn't work for everybody. If something isn't clicking, we try it another way. If you'd rather chase a different song this week, we do that.",
      },
      {
        title: "I've been at this a while",
        body: "Sixteen years on guitar, ten writing and producing, seven recording and engineering. Audio is also my day job, so the studio side of music can come into lessons whenever you want it to.",
      },
      {
        title: "Bring whatever you're into",
        body: "Never touched an instrument? Great. Already gigging and stuck on something? Also great. Any style is fair game. Wherever you're planted, there's room to grow.",
      },
    ],
    stats: [
      { value: "16 yrs", label: "playing guitar" },
      { value: "10 yrs", label: "writing & producing" },
      { value: "Music Director", label: "On the Rocks a cappella (UO)" },
      { value: `$${lessonPricing.trial.price}`, label: "half-hour trial lesson" },
    ],
    steps: [
      {
        title: "Book a trial",
        body: `Grab ${trialPhrase} and we'll see if it clicks. Got questions first? Message me. That part's free.`,
      },
      {
        title: "Make a plan",
        body: "You tell me what you want to play, and we work out what to practice and how often. It should fit into your life, not take it over.",
      },
      {
        title: "Keep showing up",
        body: "Weekly, every other week, whenever works. A little steady practice on music you care about goes a long way.",
      },
    ],
    faqs: [
      {
        q: "Do I need any experience?",
        a: "Nope. I teach people who've never held a guitar and people who play out every weekend. We start wherever you are.",
      },
      {
        q: "Do you teach kids?",
        a: "Yes, any age. I take younger kids case by case, so message me about your child first and we'll work out whether a trial lesson makes sense.",
      },
      {
        q: "Do I need my own instrument?",
        a: "Not to start. I have instruments you can use during lessons. If you stick with it you'll want your own to practise on at home, and I'm happy to help you pick one.",
      },
      {
        q: "In person or online?",
        a: "Either. In person, we meet at my home studio in Corvallis. Voice, production, and engineering lessons work really well over video too. Guitar usually goes better in the room, because I can see your hands.",
      },
      {
        q: "Where are you, and where do I park?",
        a: "My studio is in Southtown, Corvallis, and there's free street parking nearby. I'll send the exact address when you book.",
      },
      {
        q: "What does it cost?",
        a: `$${lessonPricing.hourlyRate} an hour, whatever we're working on. ${lessonPricing.pack.lessons} lessons booked together are $${lessonPricing.pack.price}, and your first one can be ${trialPhrase}. You pay at the lesson, by ${lessonPricing.paymentMethods}. The trial fee is only there to hold the time and keep no-shows away. If you just have questions, send them through the contact form and I'll answer what I can for free.`,
      },
      {
        q: "What can you teach?",
        a: "Guitar, voice, music production in a DAW, and audio engineering. Genre-wise I'm happy anywhere: folk, pop, indie, alternative, R&B, funk, you name it.",
      },
      {
        q: "What if lessons haven't worked for me before?",
        a: "Then we should talk. I'm neurodivergent myself, I go slowly, there's no fixed curriculum, and I'll keep changing the approach until it fits how you learn.",
        link: neurodivergentPage.published
          ? { label: "How I teach neurodivergent learners", href: "/lessons/neurodivergent-learners" }
          : undefined,
      },
    ],
  },
  studio: {
    id: "studio",
    doorLabel: "Create with me",
    eyebrow: "Mixing, Mastering & Recording · Corvallis, OR",
    headlineLead: "Let's make your mix hit a little",
    headlineAccent: "harder",
    body:
      "I mix, master, and record, and I'm happy to just talk a project through with you too. The goal is a release you're proud to put next to anything else on the playlist.",
    primaryCta: { label: "Get a quote", href: "/contact" },
    secondaryCta: { label: "Hear the work", href: "/portfolio" },
    valueProps: [
      {
        title: "It'll sound right everywhere",
        body: "I check every mix on studio monitors, good headphones, and the kind of everyday speakers people really listen on. If it only sounds good in my room, it isn't done.",
      },
      {
        title: "This is my day job too",
        body: "I work full-time as an audio and software engineer in podcast production, so I'm in sessions every day. Your mix gets the same ears.",
      },
      {
        title: "You'll know what you're getting",
        body: "You get a quote before I start, two rounds of revisions on every mix, and tidy session files at the end. No surprise charges.",
      },
    ],
    stats: [
      { value: "7 yrs", label: "recording & mixing" },
      { value: "10 yrs", label: "writing & producing" },
      { value: "~1 week", label: "typical mix turnaround" },
      { value: "2 rounds", label: "revisions on every mix" },
    ],
    steps: [
      {
        title: "Tell me about it",
        body: "How many tracks, when you need it, and what you want it to sound like. Send a reference song or two if you have them.",
      },
      {
        title: "Get a quote",
        body: `I'll send back a price and a timeline for exactly what you described. If it looks good, a ${studioTerms.depositPercent}% deposit holds your spot.`,
      },
      {
        title: "Mix, tweak, release",
        body: "I send a mix, you send notes, and we go two rounds like that. Then you get final files, ready to upload.",
      },
    ],
    faqs: [
      {
        q: "What's your turnaround?",
        a: "A single mix usually takes me about a week. For an EP or an album, we'll agree on a timeline before I start.",
      },
      {
        q: "How many revisions do I get?",
        a: "Two rounds on every mix, included in the price. That's usually plenty to get it where you want it.",
      },
      {
        q: "Do you work remotely?",
        a: "Yes. Send me your tracks from anywhere and I'll take it from there. For recording, you can come to the studio in Corvallis, or record at home while I direct and engineer the take over video.",
      },
      {
        q: "What will it cost?",
        a: `Mixing starts at $175 a song, mastering at $60 a track, and recording at $75 an hour. The real number depends on how many tracks there are and how soon you need it, so I'll quote it first. It's ${studioTerms.depositPercent}% up front and the rest before I send final files.`,
      },
      {
        q: "What do you deliver?",
        a: "WAV and MP3 files of every mix and master, ready for streaming, plus the session files in case you want them later.",
      },
    ],
  },
};
