import { lessonPricing, trialPhrase } from "@/content/lessons";

/**
 * Copy for each /lessons/[slug] page, keyed by the slug in lessons.ts. See
 * docs/VOICE.md: short, focused, no side stories.
 */
export type LessonPage = {
  /** URL segment, may differ from the lesson slug (voice vs vocal). */
  pageSlug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  paragraphs: string[];
  /** Sits in the closing card with the buttons: what to bring, format, price. */
  closing: string;
};

const { hourlyRate, trial } = lessonPricing;

export const lessonPages: Record<string, LessonPage> = {
  guitar: {
    pageSlug: "guitar",
    h1: "Guitar lessons in Corvallis",
    metaTitle: "Guitar Lessons in Corvallis, OR",
    metaDescription: `Acoustic and electric guitar lessons for any level, built around songs you want to play. In Southtown Corvallis, with a $${trial.price} trial.`,
    intro:
      "Acoustic or electric, for any level. We learn the songs you want to play, at whatever level you’re at, and pick up technique and theory along the way.",
    paragraphs: [
      "There isn’t one correct way to hold a guitar. Everyone’s hands are different, so we’ll find what works for yours: every string ringing, and no cramping by the end of a song.",
      "I like to bring in barre chords early, since they open up the whole neck. I also think every player should be as comfortable fingerpicking as they are with a pick.",
      "Once you have the notes, we work on making them sound like music, not just accurate.",
    ],
    closing: `Bring your guitar or use one of mine. Guitar lessons work best in person. They’re $${hourlyRate} an hour, or start with ${trialPhrase}.`,
  },
  vocal: {
    pageSlug: "voice",
    h1: "Voice and singing lessons in Corvallis",
    metaTitle: "Voice & Singing Lessons in Corvallis, OR",
    metaDescription: `Contemporary and pop singing lessons for every level, including nervous beginners. In Corvallis or online, with a $${trial.price} trial.`,
    intro:
      "Singing lessons in contemporary and pop styles, built on classical fundamentals. Beginners and nervous singers are very welcome.",
    paragraphs: [
      "If you’re nervous, we’ll start with warm-ups that barely feel like singing, like sirens and lip trills, and I’ll do them with you.",
      "We’ll work on using your voice well and finding what feels comfortable for it, instead of forcing it into a label. A lot of people are wrong about their range at first.",
      "If you’re preparing opera or classical repertoire, a classical voice teacher will serve you better.",
    ],
    closing: `Lessons work in person or online, and you don’t need experience or a microphone. They’re $${hourlyRate} an hour, or start with ${trialPhrase}.`,
  },
  production: {
    pageSlug: "production",
    h1: "Music production lessons in Corvallis and online",
    metaTitle: "Music Production Lessons in Corvallis, OR",
    metaDescription: `Learn to make a track from scratch: grooves, sounds, synths and arrangement. In person in Corvallis or online, with a $${trial.price} trial.`,
    intro:
      "Learn to make a track from scratch: grooves, choosing sounds, synths and arrangement. You don’t need a fancy setup.",
    paragraphs: [
      "If you’ve never used recording software, we start with how sound gets into a computer and back out. Everything else makes more sense after that.",
      "I teach in Logic, but the skills carry over to Ableton, Pro Tools, FL Studio and the rest.",
      "You don’t need to buy plugins. The ones that come with your software can do almost anything once you know how to use them.",
    ],
    closing: `If you already play or sing a little, expect to finish a simple song of your own within a couple of months. Lessons are $${hourlyRate} an hour, in person or online, or start with ${trialPhrase}.`,
  },
  "audio-engineering": {
    pageSlug: "audio-engineering",
    h1: "Audio engineering lessons in Corvallis and online",
    metaTitle: "Audio Engineering Lessons in Corvallis, OR",
    metaDescription: `Learn recording and mixing on your own songs. In person in Corvallis or online, with a $${trial.price} trial.`,
    intro:
      "For people who already make music and want it to sound better. Bring a song you’re working on, and we’ll go through it together: what you did, why, and what I’d try.",
    paragraphs: [
      "We usually start with how you’re listening. You don’t need expensive monitors, just speakers or headphones you know well.",
      "From there we cover recording, signal flow, EQ, compression and getting a mix to sound good everywhere. The focus is on getting things right at the source, so you need fewer plugins later.",
    ],
    closing: `Production is about making the track. Engineering is about making it sound right. If I’ve mixed a song for you, we can go through that session in a lesson at a discount. Lessons are $${hourlyRate} an hour, in person or online, or start with ${trialPhrase}.`,
  },
};
