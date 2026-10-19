import { lessonPricing, trialPhrase } from "@/content/lessons";

/**
 * Long-form copy for each /lessons/[slug] page. Keyed by the slug in
 * lessons.ts, which still owns the name, blurb and accent.
 *
 * DRAFT: written from facts already on the site (ages case by case, instruments
 * to borrow, Southtown location, trial and pricing, in-person vs online).
 * Raul to review and put it in his own words.
 */
export type LessonPage = {
  /** URL segment, may differ from the lesson slug (voice vs vocal). */
  pageSlug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  whoFor: string;
  firstLesson: string[];
  bring: string[];
  /** In person vs online, specific to this instrument. */
  format: string;
  /** Contact-form topic value. */
  topic: string;
  faqs: { q: string; a: string }[];
};

const common = {
  ages:
    "Any age. I take younger kids case by case, so message me about your child first and we’ll work out whether a trial lesson makes sense.",
  price: `Lessons are $${lessonPricing.hourlyRate} an hour, and your first can be ${trialPhrase}.`,
};

export const lessonPages: Record<string, LessonPage> = {
  guitar: {
    pageSlug: "guitar",
    h1: "Guitar Lessons in Corvallis, OR",
    metaTitle: "Guitar Lessons in Corvallis, OR",
    metaDescription:
      "One-on-one guitar lessons in Southtown, Corvallis for beginners through gigging players. Any genre, no fixed curriculum. $20 half-hour trial.",
    intro:
      "From your first chords to writing your own songs, at whatever pace keeps it fun. I’ve been playing for 16 years, and we start with the music you actually want to play.",
    whoFor:
      "Complete beginners, people coming back to guitar after a break, and players who gig and are stuck on something specific. Folk, pop, indie, alternative, R&B, funk, and more. " +
      common.ages,
    firstLesson: [
      "We talk about what you want to play and what you’ve tried so far",
      "You play something, even if it’s one chord, so I can see where to start",
      "We pick a first song or exercise and I show you how to practice it",
    ],
    bring: [
      "Nothing, to start: I have guitars you can use during lessons",
      "Your own guitar if you have one",
      "A song or two you’d love to play",
    ],
    format:
      "Guitar usually goes better in the room, because I can see your hands. In-person lessons are at my home studio in Southtown, Corvallis, with free street parking nearby.",
    topic: "guitar",
    faqs: [
      { q: "Do I need my own guitar?", a: "Not to start. If you stick with it you’ll want one to practise on at home, and I’m happy to help you pick one." },
      { q: "Do you teach acoustic or electric?", a: "Either. We start with what you want to play." },
      { q: "What does it cost?", a: common.price },
    ],
  },
  vocal: {
    pageSlug: "voice",
    h1: "Voice Lessons in Corvallis, OR",
    metaTitle: "Voice & Singing Lessons in Corvallis, OR",
    metaDescription:
      "One-on-one voice and singing lessons in Corvallis, Oregon or online. Technique, range, and performing with confidence. $20 half-hour trial.",
    intro:
      "Technique, range, and the nerve to perform. I spent years coaching a cappella singers on both the singing and the stage presence.",
    whoFor:
      "Shy beginners, people who sing in the car and want to get better, and performers working on a specific song or audition. Any style. " +
      common.ages,
    firstLesson: [
      "We talk about what you sing, or want to sing",
      "A gentle warm-up so I can hear your voice and find your comfortable range",
      "We work on a song you like and I show you what to practise",
    ],
    bring: ["A song you’d like to work on", "Water", "Nothing else: no experience needed"],
    format:
      "Voice works well in person or online. In person, we meet at my home studio in Southtown, Corvallis, with free street parking nearby.",
    topic: "vocal",
    faqs: [
      { q: "I’ve never sung in front of anyone. Is that okay?", a: "Completely. We go at your pace and nobody’s judging." },
      { q: "Can we work on a specific song?", a: "Yes, that’s often the best way in." },
      { q: "What does it cost?", a: common.price },
    ],
  },
  production: {
    pageSlug: "production",
    h1: "Music Production Lessons in Corvallis, OR",
    metaTitle: "Music Production Lessons in Corvallis, OR",
    metaDescription:
      "Learn songwriting, beat-making, and arranging in Ableton, Logic, or Pro Tools. In-person in Corvallis or online. $20 half-hour trial.",
    intro:
      "Songwriting, beat-making, and arranging in Ableton, Logic, or Pro Tools. I’ve been writing and producing for ten years, and if another instrument comes up along the way, we’ll pick it up.",
    whoFor:
      "Anyone who wants to turn ideas in their head into finished tracks, from first-timers to people with a folder of half-finished songs. " + common.ages,
    firstLesson: [
      "We talk about the music you want to make",
      "I see how you work now, or set up a simple project if you’re new",
      "We make something small together so you leave with a first result",
    ],
    bring: ["Your laptop and DAW if you have one", "A song or sound you’d like to make something like"],
    format:
      "Production works well in person or online, since we’re both looking at the screen. In person is at my home studio in Southtown, Corvallis.",
    topic: "production",
    faqs: [
      { q: "Which DAW do you teach?", a: "Ableton, Logic, or Pro Tools. If you use something else, ask me." },
      { q: "Do I need any gear?", a: "Not to start. A laptop with your DAW is enough." },
      { q: "What does it cost?", a: common.price },
    ],
  },
  "audio-engineering": {
    pageSlug: "audio-engineering",
    h1: "Audio Engineering Lessons in Corvallis, OR",
    metaTitle: "Audio Engineering & Recording Lessons in Corvallis, OR",
    metaDescription:
      "Learn mixing, mic technique, and how to get a home studio sounding good from a working audio engineer in Corvallis, Oregon or online.",
    intro:
      "Mixing, mic technique, and getting a home studio to sound good. Audio engineering is what I do at work all day, so ask me anything.",
    whoFor:
      "Home recordists, musicians who want to make their own records, and anyone curious how a mix comes together. " + common.ages,
    firstLesson: [
      "We talk about what you’re recording or mixing now",
      "I listen to something of yours, or we look at your setup",
      "We pick one thing to improve first and work on it together",
    ],
    bring: ["A mix or recording you’re working on", "Headphones, and your interface or mic if you have them"],
    format:
      "Audio engineering works well in person or online. In person, you can use the gear in my home studio in Southtown, Corvallis.",
    topic: "audio-engineering",
    faqs: [
      { q: "Do I need a studio at home?", a: "No. We can start with whatever you have." },
      { q: "Can you help me choose gear?", a: "Yes, and I’ll tell you what’s worth your money and what isn’t." },
      { q: "What does it cost?", a: common.price },
    ],
  },
};
