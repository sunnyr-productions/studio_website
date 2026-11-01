/**
 * Copy for each /lessons/[slug] page, keyed by the slug in lessons.ts. Written
 * from Raul's interview answers (docs/interview-answers.md, gitignored).
 */
export type LessonPage = {
  /** URL segment, may differ from the lesson slug (voice vs vocal). */
  pageSlug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Longer sections on how Raul teaches this, shown before the practical parts. */
  sections: { title: string; body: string }[];
  whoFor: string;
  firstLesson: string;
  bring: string;
  format: string;
  faqs: { q: string; a: string }[];
  closingTitle: string;
};

const firstLesson =
  "The first lesson is mostly a chance to get to know each other. I'll ask why you're interested in lessons and what music you like, and if you already play or sing, I'd love to hear something you enjoy. That tells me where you are and where to take it next. If I don't think I'm the right teacher for you, I'll tell you. I'm not here to just take your money.";

export const lessonPages: Record<string, LessonPage> = {
  guitar: {
    pageSlug: "guitar",
    h1: "Guitar lessons in Corvallis",
    metaTitle: "Guitar Lessons in Corvallis, OR",
    metaDescription:
      "One-on-one guitar lessons in Southtown, Corvallis, built around the songs you want to play. Beginners through experienced players. $20 half-hour trial.",
    intro:
      "I've played guitar for 16 years, and I teach the songs you actually listen to. We may not play them note for note. We'll play them at your level and figure it out from there.",
    sections: [
      {
        title: "There's more than one right way",
        body: "Take barre chords. So many people have trouble with them, partly because everyone's hands are different, and the way I play one might not work for you. Some things are always true: you want all the strings to ring out, and you shouldn't get hand cramps three minutes into a song. Beyond that, I'll help you find the way that works for your hands, even if it doesn't look like mine.",
      },
      {
        title: "What I teach sooner than most",
        body: "Open chords are great, but I think barre chords should come early, because they open up the whole neck and make the theory easier to understand. I also think everyone should learn some fingerstyle, whatever kind of music they play.",
      },
      {
        title: "The point of all this",
        body: "A teacher once listened to me play \"Little Wing\" and told me, \"That's correct, but it doesn't feel like music.\" I want you to get comfortable enough that the guitar sounds like you, and that matters more to me than getting every note right.",
      },
    ],
    whoFor:
      "Beginners, people picking it back up after years away, and players who can hit all the right notes and want it to feel more like music.",
    firstLesson,
    bring: "Your guitar if you have one. If you don't, you can play one of mine.",
    format:
      "Guitar really is better in person, because I need to see your hands. Lessons are at my home studio in Southtown, with free street parking nearby.",
    faqs: [
      { q: "Do I need my own guitar?", a: "Not to start. If you stick with it you'll want one at home to practice on, and I can help you pick one." },
      { q: "Acoustic or electric?", a: "Either. I've got both here." },
      { q: "Can you look at my guitar if something's wrong with it?", a: "Yes. I learned repair on my own Strat, which I've rewired, shielded and fitted with new tuners, so I can usually tell you what's going on." },
    ],
    closingTitle: "Want to try a guitar lesson?",
  },
  vocal: {
    pageSlug: "voice",
    h1: "Voice lessons in Corvallis",
    metaTitle: "Voice & Singing Lessons in Corvallis, OR",
    metaDescription:
      "One-on-one voice and singing lessons in Corvallis, Oregon or online, including for people who are embarrassed to sing. $20 half-hour trial.",
    intro:
      "A lot of people tell me they're embarrassed to sing around me, and it genuinely makes me sad. You don't need to sound like Lady Gaga for singing to be worth doing, and you never have to sing on a stage. I think you should sing for yourself.",
    sections: [
      {
        title: "If you're nervous",
        body: "We don't have to start with singing. We can start with sirens, trills and diction exercises, which feel less like singing but still work your voice, and I'll do them with you so we can be silly together. You didn't come here to be perfect. You came here to learn.",
      },
      {
        title: "I was wrong about my own voice",
        body: "I used to tell people I was a baritone, because I was uncomfortable in my high range and afraid of vocal cracks. Then I auditioned for On the Rocks at the University of Oregon, and the music director said, \"Nope, you're definitely not a baritone.\" He worked with me, and I ended up as the highest tenor in the group for years. What changed was finding what felt comfortable for my voice.",
      },
      {
        title: "Who you're comparing yourself to",
        body: "The singers you hear on the radio do this every day, with the best vocal coaches and the kind of healthcare most of us don't have access to. They're a strange thing to measure yourself against when you just want to sing along in the car.",
      },
    ],
    whoFor:
      "Nervous beginners, people who sing in the car and want to get better, and performers working on a particular song. You don't need to read music. I can teach you parts by ear.",
    firstLesson,
    bring: "A song you'd like to work on, if you have one in mind.",
    format:
      "Voice works well in person or online. In person, we meet at my home studio in Southtown, with free street parking nearby.",
    faqs: [
      { q: "I've never sung in front of anyone. Is that okay?", a: "Yes. We'll start with the silly warm-ups and go at your pace." },
      { q: "Do I need a microphone?", a: "No. I have microphones if you want to learn how to use one, but you don't need one for lessons." },
    ],
    closingTitle: "Want to try a voice lesson?",
  },
  production: {
    pageSlug: "production",
    h1: "Music production lessons",
    metaTitle: "Music Production Lessons in Corvallis, OR",
    metaDescription:
      "Learn to build a track from scratch: grooves, sounds, synths and arrangement. Taught in Logic, in person in Corvallis or online. $20 half-hour trial.",
    intro:
      "How to actually build a track: making a groove, choosing sounds that work together, designing synths, and knowing what each instrument usually does in a song. I've been producing since I was 17, and I still make my own music as sunny*r.",
    sections: [
      {
        title: "Where we'd start",
        body: "If you've never opened a DAW, I'd start with how sound gets into a computer and back out again. A physical wave hits a microphone, turns into an electrical signal, then into digital data, and eventually moves your speakers to make a wave again. I don't think many people stop to think about that, and it's kind of magic.",
      },
      {
        title: "What you can expect",
        body: "If you already know a little music, like singing or some instrument, then within a few months you should be able to record your own beats and loops and put together a little song. It won't be a top 40 hit, but it'll be something you can show your friends.",
      },
      {
        title: "You don't need much to start",
        body: "I started with Reaper, because it was free, a basic audio interface I got for my birthday, and an Akai MPK Mini from my brother, which is still on my desk. Most DAWs come with plugins that are more than enough, as long as you learn to use them. If a new plugin gets you excited to open your session, and you can afford it, great. It should never come before paying your utilities on time.",
      },
    ],
    whoFor:
      "First-timers who know a little music, and people with a folder full of half-finished songs.",
    firstLesson,
    bring: "Your laptop and DAW if you have them, and a song you'd like to make something like.",
    format:
      "This works well online, since we're both looking at a screen anyway. In person is at my home studio in Southtown, Corvallis, where I have guitars, a bass and a keyboard you can use.",
    faqs: [
      { q: "Which software do you teach?", a: "I use Logic every day, so that's what I teach in. What you'll learn carries over to Ableton, Pro Tools or anything else. Only the key commands and the interface are specific to Logic." },
      { q: "Do I need any gear?", a: "Not to start. A laptop with a DAW is enough." },
    ],
    closingTitle: "Have a song you can't finish?",
  },
  "audio-engineering": {
    pageSlug: "audio-engineering",
    h1: "Audio engineering lessons",
    metaTitle: "Audio Engineering & Mixing Lessons in Corvallis, OR",
    metaDescription:
      "Mixing and recording lessons for people already making music, working on your own songs, from a working audio engineer in Corvallis, Oregon or online.",
    intro:
      "These lessons are for people who are already making music. We take a song you're working on and go through it together: what I'd do and why, what sound you were going for, and whether there's a simpler way to get there with fewer plugins.",
    sections: [
      {
        title: "The first thing I'd fix",
        body: "It depends on what you're setting up for, but usually it's how you're listening. Your monitors or headphones don't have to be top of the line. You just have to know them, by listening to a lot of music you love on them, so you're not bouncing your mix and running to five different places to hear what's wrong.",
      },
      {
        title: "What my day job taught me",
        body: "I work in live podcast production, where issues come up all the time. Learn your signal chain, so you know every place something could go wrong, and check each one until you find it. Problems are almost always fixable.",
      },
      {
        title: "Before you buy anything",
        body: "The gear people waste money on is the gear they don't use. Have a purpose before you buy something. If you don't, it had better be a really good deal.",
      },
    ],
    whoFor: "Home recordists and musicians who already make music and want it to sound better.",
    firstLesson,
    bring: "A recording or mix you're working on, and headphones you know well.",
    format:
      "This works in person or online. In person, you can use the gear in my home studio in Southtown, Corvallis.",
    faqs: [
      { q: "Do I need a studio at home?", a: "No. We can start with whatever you have." },
      { q: "How is this different from production lessons?", a: "Production is about creating the track. Engineering is about how to record and mix what you've made." },
    ],
    closingTitle: "Want your recordings to sound better?",
  },
};
