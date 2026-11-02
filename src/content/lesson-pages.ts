/**
 * Copy for each /lessons/[slug] page, keyed by the slug in lessons.ts. Written
 * from Raul's interview answers (docs/interview-answers.md, gitignored). The
 * first lesson, pricing and house notes live once on /lessons.
 */
export type LessonPage = {
  /** URL segment, may differ from the lesson slug (voice vs vocal). */
  pageSlug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: { title: string; body: string }[];
  /** In person or online, what to bring, anything practical. */
  practical: string;
};

export const lessonPages: Record<string, LessonPage> = {
  guitar: {
    pageSlug: "guitar",
    h1: "Guitar lessons in Corvallis",
    metaTitle: "Guitar Lessons in Corvallis, OR",
    metaDescription:
      "One-on-one guitar lessons in Southtown, Corvallis, built around the songs you want to play. Beginners through experienced players. $20 half-hour trial.",
    intro:
      "I started lessons at 10 wanting to play Green Day, and my teacher wanted to teach classical. So I’ll ask what you listen to, and we’ll start there. We may not play it note for note. We’ll play it at your level.",
    sections: [
      {
        title: "Your hands aren’t my hands",
        body: "Lots of people struggle with barre chords, partly because everyone’s hands are different, and the way I play one might not work for you. Some things are always true: you want all the strings to ring out, and you shouldn’t get a hand cramp three minutes into a song. Past that, we’ll find what works for your hands, even if it doesn’t look like what I do.",
      },
      {
        title: "Where I’ll push you",
        body: "Open chords are great, but I teach barre chords earlier than most, because they open up the rest of the neck and make theory easier to understand. I also think everyone should know some fingerstyle, whatever you play.",
      },
      {
        title: "Getting past the right notes",
        body: "A teacher once listened to me play “Little Wing” and told me, “That’s correct, but it doesn’t feel like music.” Nobody had asked me about feeling before. If you’re at the stage where you can play it but it sounds like nothing, that’s worth a lesson too.",
      },
    ],
    practical:
      "Guitar goes better in person, because I need to see your hands. You can use one of my acoustics or electrics, so you don’t need to own a guitar to start. If yours has a problem, bring it along. I learned repair on my own Strat.",
  },
  vocal: {
    pageSlug: "voice",
    h1: "Voice lessons in Corvallis",
    metaTitle: "Voice & Singing Lessons in Corvallis, OR",
    metaDescription:
      "One-on-one voice and singing lessons in Corvallis, Oregon or online, including for people who are embarrassed to sing. $20 half-hour trial.",
    intro:
      "A lot of people tell me they’re embarrassed to sing around me, and it makes me sad every time. Your voice doesn’t have to be good enough for anything. You never have to set foot on a stage. And if your friends clown on you for singing in the car, that’s a friend problem.",
    sections: [
      {
        title: "If you’re too nervous to sing",
        body: "Then we won’t start there. We can do sirens, trills and diction exercises, which feel less like singing and still work your voice, and I’ll do them with you, so we’re both being silly. You didn’t come here to be perfect. You came here to learn.",
      },
      {
        title: "I was wrong about my own voice",
        body: "I told everyone I was a baritone, because I was uncomfortable up high and afraid of my voice cracking. Then I auditioned for On the Rocks, and the music director said, “Nope, you’re definitely not a baritone.” I ended up the highest tenor in the group for years. I didn’t get there by learning the technically right way. I got there by finding what felt comfortable for my voice.",
      },
      {
        title: "Who you’re comparing yourself to",
        body: "Lady Gaga does this all day, with the best coaches in the world and healthcare the rest of us don’t have. She’s a strange thing to measure yourself against when you just want to sing along with the radio.",
      },
    ],
    practical:
      "Voice works well in person or online. You don’t need to read music or own a microphone. If you have a song you’d like to work on, bring it.",
  },
  production: {
    pageSlug: "production",
    h1: "Music production lessons",
    metaTitle: "Music Production Lessons in Corvallis, OR",
    metaDescription:
      "Learn to build a track from scratch: grooves, sounds, synths and arrangement. Taught in Logic, in person in Corvallis or online. $20 half-hour trial.",
    intro:
      "How to actually build a track: making a groove, choosing sounds that work together, designing a synth, and knowing what each instrument usually does in a song. I got started at 17 with a birthday-present audio interface and Reaper, because Reaper was free.",
    sections: [
      {
        title: "Where we’d start",
        body: "If you’ve never opened a DAW, I’ll start with how sound gets into a computer and back out. A wave hits a microphone, becomes an electrical signal, becomes data, and eventually moves your speakers to make a wave again. Not many people stop to think about that, and it’s kind of magic.",
      },
      {
        title: "Where you could be in a few months",
        body: "If you already know a little music, you should be able to record your own beats and loops and put together a little song. It won’t be a top 40 hit. It’ll be something you can play for your friends.",
      },
      {
        title: "What not to buy",
        body: "Your DAW’s built-in plugins are more than enough, as long as you learn to use them. If a new plugin gets you excited to open your session and you can afford it, great. It should never be a choice between that and your utility bill.",
      },
      {
        title: "A word about YouTube",
        body: "I watch tutorials all the time, but when I was starting out I hopped between everyone’s method, because everyone says theirs is the right one. Part of what we’ll do is figure out your own workflow.",
      },
    ],
    practical:
      "I use Logic every day, so that’s what I teach in. The ideas carry over to Ableton, Pro Tools or anything else, and only the key commands and interface are specific to Logic. Lessons work well online, since we’re both looking at a screen anyway.",
  },
  "audio-engineering": {
    pageSlug: "audio-engineering",
    h1: "Audio engineering lessons",
    metaTitle: "Audio Engineering & Mixing Lessons in Corvallis, OR",
    metaDescription:
      "Mixing and recording lessons for people already making music, working on your own songs, from a working audio engineer in Corvallis, Oregon or online.",
    intro:
      "These are for people already making music. We open a song you’re working on and go through it together: what I’d do and why, what you were going for, and whether there’s a way to get there with fewer plugins on the chain.",
    sections: [
      {
        title: "The first thing I’d fix",
        body: "Usually how you’re listening. Your monitors or headphones don’t have to be top of the line. You just have to know them, by listening to a lot of music you love on them, so you’re not bouncing your mix and running to five different places to hear what’s wrong.",
      },
      {
        title: "What my day job taught me",
        body: "I work in live podcast production, where things go wrong constantly and the show’s still running. Learn your signal chain, so you know every place a problem could be, and check them one by one. Problems are almost always fixable.",
      },
      {
        title: "Before you buy anything",
        body: "The gear people waste money on is the gear they don’t use. Have a purpose before you buy something. If you don’t, it had better be a really good deal.",
      },
    ],
    practical:
      "Bring a recording or mix you’re working on, and headphones you know well. This works in person or online. If you want to learn to build tracks from scratch, you’re looking for production lessons instead.",
  },
};
