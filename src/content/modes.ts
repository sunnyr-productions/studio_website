/**
 * The studio runs in two modes — two doors into the same practice.
 *
 * "lessons" is the teaching side (warm, marigold-forward); "studio" is the
 * client-work side (periwinkle-forward). The visitor picks a door; the choice
 * persists and reframes the homepage. Both headlines share a deliberate
 * cadence ("Let's make your ___ a little ___er") so the doors read as
 * siblings rather than two unrelated businesses.
 */
import { lessonPricing, trialPhrase } from "@/content/lessons";
import { studioTerms } from "@/content/services";

export type StudioMode = "lessons" | "studio";

export type ModeContent = {
  id: StudioMode;
  /** Label on the segmented control — framed by visitor intent, not jargon. */
  doorLabel: string;
  /** Tight version for the header toggle. */
  shortLabel: string;
  /** How the other door refers to this one in cross-links. */
  crossLinkLabel: string;
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
  faqs: { q: string; a: string }[];
};

export const modes: Record<StudioMode, ModeContent> = {
  lessons: {
    id: "lessons",
    doorLabel: "Learn with me",
    shortLabel: "Learn",
    crossLinkLabel: "lessons",
    eyebrow: "Music Lessons — Corvallis, OR & online",
    headlineLead: "Let's make your sound a little",
    headlineAccent: "sunnier",
    body:
      "Patient, student-led lessons in guitar, voice, production, and audio engineering. No rigid curriculum, no judgment — just music built around what you actually want to make.",
    primaryCta: { label: "Book a lesson", href: "/lessons" },
    secondaryCta: { label: "See lesson types", href: "/lessons" },
    valueProps: [
      {
        title: "Room to grow, at your own pace",
        body: "Neurodivergent-affirming and never rigid — lessons are shaped around what you're interested in, not a fixed curriculum.",
      },
      {
        title: "16 years playing, 7 years engineering",
        body: "Real background behind every lesson — plus day-to-day audio engineering work in podcast production.",
      },
      {
        title: "Any genre, any starting point",
        body: "Folk, pop, indie, alternative, R&B, funk, and more. First-timers and seasoned musicians both welcome — wherever you're planted, there's room to grow.",
      },
    ],
    stats: [
      { value: "16 yrs", label: "playing guitar" },
      { value: "10 yrs", label: "writing & producing" },
      { value: "Music Director", label: "On the Rocks a cappella (UO)" },
      { value: "All levels", label: "total beginners to gigging" },
    ],
    steps: [
      {
        title: "Book a trial",
        body: `Grab ${trialPhrase} — low pressure, no commitment. We just see if it clicks.`,
      },
      {
        title: "Shape the plan",
        body: "We build lessons around what you actually want to play, at a pace that fits your life.",
      },
      {
        title: "Grow at your pace",
        body: "Weekly, biweekly, or whenever — steady reps pointed at the music you care about.",
      },
    ],
    faqs: [
      {
        q: "Do I need any experience?",
        a: "None at all. I teach total beginners through gigging musicians — we start wherever you are and build from there.",
      },
      {
        q: "In person or online?",
        a: "Both. In-person lessons happen at my sound-treated home studio in Corvallis; voice, production, and engineering work great over video too (guitar tends to go best in person).",
      },
      {
        q: "What does it cost?",
        a: `$${lessonPricing.hourlyRate} an hour — one flat rate across every lesson type. A ${lessonPricing.pack.lessons}-lesson pack is $${lessonPricing.pack.price}, and your first lesson can be ${trialPhrase}. Pay in person — ${lessonPricing.paymentMethods}.`,
      },
      {
        q: "What can you teach?",
        a: "Guitar and voice, plus music production / DAW work and audio engineering. Any genre — folk, pop, indie, alternative, R&B, funk, and more.",
      },
      {
        q: "What if lessons haven't worked for me before?",
        a: "That's honestly my specialty. I'm neurodivergent, I teach patiently and without rigid curriculum, and I shape everything around how you actually learn.",
      },
    ],
  },
  studio: {
    id: "studio",
    doorLabel: "Create with me",
    shortLabel: "Create",
    crossLinkLabel: "mixing & mastering",
    eyebrow: "Mixing, Mastering & Recording — Corvallis, OR",
    headlineLead: "Let's make your mix hit a little",
    headlineAccent: "harder",
    body:
      "Mixing, mastering, recording, and production consultation — for artists ready to release something that holds up next to anything else on the playlist.",
    primaryCta: { label: "Get a quote", href: "/contact" },
    secondaryCta: { label: "Hear the work", href: "/portfolio" },
    valueProps: [
      {
        title: "A room that tells the truth",
        body: "A sound-treated studio with monitors and planar headphones, so the calls I make on your track still hold up everywhere else you play it.",
      },
      {
        title: "Engineering is the day job",
        body: "I work full-time as an audio and software engineer in podcast production — mixing isn't a weekend hobby, it's the craft I practice daily.",
      },
      {
        title: "Clear scope, revisions included",
        body: "Two rounds of revisions come standard on a mix, with organized session files and streaming-ready deliverables — no surprise line items.",
      },
    ],
    stats: [
      { value: "7 yrs", label: "recording & mixing" },
      { value: "Full-time", label: "audio & software engineer" },
      { value: "Treated room", label: "monitors + planar headphones" },
      { value: "2 rounds", label: "revisions on every mix" },
    ],
    steps: [
      {
        title: "Send the project",
        body: "Tell me the track count, your timeline, and the sound you're chasing — references welcome.",
      },
      {
        title: "Get a quote",
        body: `A clear, itemized quote shaped around the actual work — no surprise fees. A ${studioTerms.depositPercent}% deposit books your spot.`,
      },
      {
        title: "Mix, revise, release",
        body: "Two revision rounds come standard, delivered streaming-ready and organized for whatever's next.",
      },
    ],
    faqs: [
      {
        q: "What's your turnaround?",
        a: "Most mixes come back in about a week. For larger projects — an EP or album — we'll set a realistic timeline up front.",
      },
      {
        q: "How many revisions do I get?",
        a: "Two rounds are included on every mix, so we can dial it in together without the meter running.",
      },
      {
        q: "Do you work remotely?",
        a: "Yes — send stems from anywhere and I'll handle the rest. Recording sessions are in-person at the Corvallis studio.",
      },
      {
        q: "What will it cost?",
        a: `Mixing from $175/song, mastering from $60/track, recording from $75/hour. Every quote is tailored to your track count, timeline, and goals. Projects start with a ${studioTerms.depositPercent}% deposit, with the balance due before final delivery.`,
      },
      {
        q: "What do you deliver?",
        a: "Streaming-ready WAV + MP3, organized session files, and DDP plus individual files for masters.",
      },
    ],
  },
};
