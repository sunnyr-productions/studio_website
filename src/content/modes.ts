/**
 * Copy for the two sides of the practice, each with its own page: "lessons"
 * (warm, marigold-forward) at /lessons and "studio" (periwinkle-forward) at
 * /studio. Both headlines share a cadence ("Let's make your ___ a little ___er")
 * so the two read as siblings.
 */
import { lessonPricing, trialPhrase } from "@/content/lessons";
import { neurodivergentPage } from "@/content/neurodivergent-page";
import { homeVisitNote, studioTerms } from "@/content/services";

export type StudioMode = "lessons" | "studio";

export type ModeContent = {
  id: StudioMode;
  eyebrow: string;
  /** Headline is split so the final word can carry the hand-drawn Scribble. */
  headlineLead: string;
  headlineAccent: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  valueProps: { title: string; body: string }[];
  /** "How it works": three plain steps. */
  steps: { title: string; body: string }[];
  faqs: { q: string; a: string; link?: { label: string; href: string } }[];
};

export const modes: Record<StudioMode, ModeContent> = {
  lessons: {
    id: "lessons",
    eyebrow: "Guitar, voice and production lessons in Corvallis, OR, and online",
    headlineLead: "Let's make your sound a little",
    headlineAccent: "sunnier",
    body:
      "I teach guitar, voice, music production and audio engineering, one-on-one. We start with why you're here and what you like to listen to, and I'll adjust as we go.",
    primaryCta: { label: "Book a trial", href: "/lessons#book" },
    secondaryCta: { label: "Ask a question", href: "/contact?service=lessons" },
    valueProps: [
      {
        title: "Your music, your way",
        body: "I'm not going to force music on you. We'll work on songs you want to play, and if something feels wrong for your hands or your voice, we'll find what works for you, even if it doesn't look like what I do.",
      },
      {
        title: "Where I learned to teach",
        body: "As music director of On the Rocks, an a cappella group at the University of Oregon, I taught every part to 12 to 16 singers with different backgrounds, and not all of them read music well. You'd be among my first private music students, but working out what each person needs isn't new to me.",
      },
      {
        title: "If you don't know something",
        body: "Tell me. If you already knew everything, you wouldn't be seeing me. I won't pretend to know everything either. Experience just means I can find the answers a little quicker, and we'll find them together.",
      },
    ],
    steps: [
      {
        title: "Book a trial",
        body: `Start with ${trialPhrase}. It's mostly a conversation, so we can get to know each other and see if it's a good fit.`,
      },
      {
        title: "Find a direction",
        body: "I'll get a sense of where you are and what you're interested in, and I'll have an idea of where to start.",
      },
      {
        title: "Keep coming",
        body: "Weekly, every other week, whatever you can keep up. I'm generally open on weekday evenings and weekends.",
      },
    ],
    faqs: [
      {
        q: "Do I need any experience?",
        a: "Nope. We start wherever you are.",
      },
      {
        q: "Do you teach kids?",
        a: "Yes. I'd prefer potty-trained and up, and we can discuss younger kids with a parent there. Parents know their kids best, and they're always welcome to sit in, but they don't have to. If your child needs accommodations, tell me ahead of time so I can prepare.",
      },
      {
        q: "Can you make my kid love it?",
        a: "No, that's not within my power. What I can do is make lessons as enjoyable as I can and tailor them to what your kid likes. If what you want and what your kid wants don't match, I'll try to find a compromise.",
      },
      {
        q: "What if I don't practice?",
        a: "I won't be upset, and there's no minimum. If you didn't practice, then either something more important was going on, or I didn't give you something you wanted to work on. We'll figure out what you'd be more willing to practice. My own practice isn't very structured either. Sometimes I run scales, and sometimes I put music on shuffle and try to work out the chords by ear before the song ends.",
      },
      {
        q: "Do I need my own instrument?",
        a: "Not to start. I have guitars, a bass and a keyboard you can use during lessons. If you stick with it you'll want your own to practice on at home, and I'm happy to help you pick one.",
      },
      {
        q: "In person or online?",
        a: "Either. In person, we meet at my home studio in Corvallis. Voice, production and engineering work well over video. Guitar usually goes better in the room, because I can see your hands. Online lessons are on Microsoft Teams, and I can record them if you ask.",
      },
      {
        q: "Where are you, and where do I park?",
        a: "Southtown, Corvallis, in a residential neighborhood away from campus. There's free street parking nearby, and I'll send the exact address when you book. OSU students are welcome, and online lessons are an option if getting here is hard.",
      },
      {
        q: "What should I know before I come over?",
        a: homeVisitNote,
      },
      {
        q: "What does it cost?",
        a: `$${lessonPricing.hourlyRate} an hour, whatever we're working on. ${lessonPricing.pack.lessons} lessons booked together are $${lessonPricing.pack.price}, and your first can be ${trialPhrase}. You pay at the lesson, by ${lessonPricing.paymentMethods}, and we can discuss other ways to pay.`,
      },
      {
        q: "What if I need to cancel?",
        a: `Rescheduling is free with at least ${lessonPricing.cancellationNoticeHours} hours' notice. With less notice, there's a ${lessonPricing.lateCancelPercent}% fee. If you don't show up, it's the full lesson.`,
      },
      {
        q: "What can you teach?",
        a: "Guitar, voice, music production in Logic, and audio engineering. The concepts are the same in any genre, so bring whatever you like. I play bass too, and I know enough piano and theory to show you things, but I don't teach piano.",
      },
      {
        q: "Have you taught before?",
        a: "Private music lessons are new for me. I taught and coached a cappella singers for years as a music director, and I tutor computer science now.",
      },
      {
        q: "What if lessons haven't worked for me before?",
        a: "Then I'd especially like to talk to you. They often didn't work for me either, and I've had more bad music teachers than good ones.",
        link: neurodivergentPage.published
          ? { label: "How I teach neurodivergent learners", href: "/lessons/neurodivergent-learners" }
          : undefined,
      },
    ],
  },
  studio: {
    id: "studio",
    eyebrow: "Mixing, mastering and recording in Corvallis, OR, and remotely",
    headlineLead: "Let's make your mix hit a little",
    headlineAccent: "harder",
    body:
      "I mix, master and record music, and I'm happy to just talk a project through. Music is an act of service to me, so the first thing I'll ask is what you want your song to do.",
    primaryCta: { label: "Get a quote", href: "/contact" },
    secondaryCta: { label: "Hear the work", href: "/portfolio" },
    valueProps: [
      {
        title: "You'll hear your version",
        body: "Everything's worth a try. If you send a note I disagree with, I'll give you your version and mine, and you can decide.",
      },
      {
        title: "Audio is my day job",
        body: "I work in live podcast production for local small businesses, so I spend my days balancing voices and tracking down problems while the show is running.",
      },
      {
        title: "You get a price first",
        body: `You get a quote before I start, and ${studioTerms.revisionRounds} rounds of revisions are included on every mix. I also check every mix on the car, phone, laptop, TV soundbar and a little Bluetooth speaker.`,
      },
    ],
    steps: [
      {
        title: "Tell me about it",
        body: "How many tracks, when you need it, and what you want it to sound like. Send a reference song or two if you have them, and I'll ask what you like about them.",
      },
      {
        title: "Get a quote",
        body: `I'll send a price and a timeline. If it looks good, a ${studioTerms.depositPercent}% deposit holds your spot.`,
      },
      {
        title: "Mix and revise",
        body: `You'll get a first version within ${studioTerms.firstVersionWeeks} weeks. You send notes, and we go ${studioTerms.revisionRounds} rounds like that. Then you get final files, ready to upload.`,
      },
    ],
    faqs: [
      {
        q: "Who have you worked with?",
        a: `This is a new business for me, so I don't have a list of clients yet. I've mixed my own releases and projects with friends, and I do audio for a living in podcast production. My first ${studioTerms.introMix.clients} mixing clients pay $${studioTerms.introMix.price} a song instead of $175, in exchange for a testimonial and permission to show the work.`,
      },
      {
        q: "What's your turnaround?",
        a: `You'll have a first version of a mix within ${studioTerms.firstVersionWeeks} weeks, and I can often go quicker if you need it. For an EP or album, we'll agree on a timeline before I start.`,
      },
      {
        q: "How many revisions do I get?",
        a: `${studioTerms.revisionRounds} rounds on every mix, included in the price. A round is one list of notes sent together. Extra rounds are $${studioTerms.extraRevisionFee} each. A re-recorded part or a changed arrangement is new work, and I'll quote it first.`,
      },
      {
        q: "Do you work remotely?",
        a: "Yes. You can send me your tracks from anywhere. For recording, you can come to the studio in Corvallis, or I can coach you through recording vocals at home over video.",
      },
      {
        q: "What will it cost?",
        a: `Mixing starts at $175 a song, mastering at $60 a track, and recording at $75 an hour. The real number depends on how many tracks there are and how soon you need it, so I'll quote it first. It's ${studioTerms.depositPercent}% up front and the rest before I send final files.`,
      },
      {
        q: "Do you work with a cappella groups?",
        a: "Yes, and that includes OSU groups. I directed On the Rocks at the University of Oregon, arranged for the group, and helped produce the vocals on our album In the Groove. I can help with arrangements, teaching parts and producing vocals. Tell me what your group is working on.",
      },
      {
        q: "What do you deliver?",
        a: "WAV and MP3 files of every mix and master. Stems or multitracks can be added on. After a recording session, you get your multitracks and a rough bounce the same week.",
      },
    ],
  },
};
