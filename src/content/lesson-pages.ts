import { lessonPricing, trialPhrase } from "@/content/lessons";

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
    metaDescription: `Learn acoustic or electric guitar using songs you love, at any level. In-person lessons in Southtown, with a $${trial.price} trial.`,
    intro:
      "My first guitar teacher wanted a classical student. I was ten and wanted Green Day, so you can guess how that went. I’ve since come around on classical and I’m learning it now, but I haven’t forgotten what it’s like to sit through lessons on music you don’t care about. We’ll use the songs you play in the car, simplified as much as you need.",
    paragraphs: [
      "Everybody’s hands are different, which is why the internet’s confident advice about holding a guitar only gets you so far. Barre chords are the classic example. There’s no single shape that works for every hand, but there are things to check: does every string ring, and can you get through a whole song without your hand seizing up? We’ll keep adjusting until the answer to both is yes.",
      "I do have a couple of firm opinions. Barre chords should come early, since they unlock the whole neck and make theory click. And anyone who plays with a pick should also learn to play with their fingers, whatever the genre.",
      "At some point you may find you can play a song accurately and it still sounds flat. I got stuck there too, until a teacher told me as much about my “Little Wing.” Learning to put yourself into a phrase takes longer than learning the notes, and I think it matters more.",
    ],
    closing: `Bring your guitar if you have one, or use one of mine. Lessons go best in person, where I can see your hands. They’re $${hourlyRate} an hour, and you can start with ${trialPhrase}.`,
  },
  vocal: {
    pageSlug: "voice",
    h1: "Voice and singing lessons in Corvallis",
    metaTitle: "Voice & Singing Lessons in Corvallis, OR",
    metaDescription: `Singing lessons for anyone, including people too nervous to sing in front of someone. In Corvallis or online, with a $${trial.price} trial.`,
    intro:
      "When I tell people I sing, a surprising number of them apologize for their own voices, and it bums me out. Singing along in the car isn’t an audition. The stars you’re comparing yourself to have world-class coaches, medical care most people can’t get, and all day to work at it.",
    paragraphs: [
      "We can ease in if you’re nervous. The first ten minutes might be nothing but sirens, lip trills and tongue twisters, with me doing them right alongside you and sounding just as ridiculous. Your voice warms up and the pressure drops before anybody has sung a real note.",
      "You may also have your voice wrong. I spent years telling people I was a baritone, because high notes scared me and I didn’t trust my voice not to crack. When I auditioned for On the Rocks, the music director disagreed on the spot, and with his help I became the highest tenor in the group. What changed was that I stopped singing what I thought I was supposed to sing and went looking for what felt easy.",
      "People also undersell plain repetition. I learned a lot in choir, musical theater and lessons, but I learned at least as much by singing constantly, usually without noticing. If you’ve been shushing yourself for years, just getting more reps in will change things.",
    ],
    closing: `Lessons work in person or online, and you don’t need experience or a microphone. Bring a song you like. It’s $${hourlyRate} an hour, and you can start with ${trialPhrase}.`,
  },
  production: {
    pageSlug: "production",
    h1: "Music production lessons in Corvallis and online",
    metaTitle: "Music Production Lessons in Corvallis, OR",
    metaDescription: `Learn to make a track from nothing in Logic, in person in Corvallis or online, with a $${trial.price} trial.`,
    intro:
      "When I was 17, a friend got a little audio interface, and we recorded one of my songs in his bedroom with a drum loop and the sound of waves behind it. It wasn’t good. I was thrilled anyway, because I’d assumed recording meant paying for a real studio. I asked for my own interface for my next birthday and got to work in Reaper, which was free.",
    paragraphs: [
      "These lessons take you from an idea to a finished little track. We cover how to build a groove, how to pick sounds that get along, how to make a synth do what you want, and what each instrument usually does in a band.",
      "If you’ve never opened recording software, our first conversation is about physics. Your voice moves air, a microphone turns that into electricity, a converter turns that into numbers, and eventually your speakers move air again. Everything in the software makes more sense once you have that picture, and it still amazes me a little.",
      "I teach in Logic because I use it every day. Apart from key commands and menus, what you learn applies in Ableton, Pro Tools or whatever you end up using. You also don’t need to buy plugins. What came with your software can do nearly anything once you learn it, and a new one is only worth it if it gets you excited to open a session and doesn’t compete with your bills.",
      "I’d like to save you some of the time I lost on YouTube, too. Everybody there has the one true workflow, and I tried most of them. You’ll find your own faster with someone to ask.",
    ],
    closing: `If you already play or sing a little, give it a few months and you should have a song you can show your friends. It won’t chart, but you’ll have made it from scratch. Lessons are $${hourlyRate} an hour, in person or online, and you can start with ${trialPhrase}.`,
  },
  "audio-engineering": {
    pageSlug: "audio-engineering",
    h1: "Audio engineering lessons in Corvallis and online",
    metaTitle: "Audio Engineering Lessons in Corvallis, OR",
    metaDescription: "Learn mixing and recording on your own songs, in person in Corvallis or online.",
    intro:
      "These are for people who are already making music and getting stuck on how it sounds. You bring a song in progress, we open it up together, and I ask why you made the choices you made. Then I show you what I’d try and why, often with fewer plugins.",
    paragraphs: [
      "Almost always, the first thing we look at is your listening setup, since you can’t fix what you can’t hear. That doesn’t take expensive speakers or headphones. It takes a pair you’ve heard hundreds of songs on, so you know what good sounds like through them and don’t have to run out to the car to check every bounce.",
      "My day job adds a different kind of education. We run live podcast sessions with multiple cameras and a long signal path between microphones, mixers, recording software and video software, and something always crackles at the worst moment. You learn to keep a map of that chain in your head and walk it one connection at a time. Nearly every problem turns out to be fixable, and I’d like you to have that confidence at home.",
      "As for gear, if you can’t name what you’d use it for, it’s probably a waste, unless it’s a steal.",
    ],
    closing: `Not sure if this or production is the right fit? Production is how to make the track, and engineering is how to make it sound the way you hear it. If I mixed your song, we can also go through that session together at a discount. Lessons are $${hourlyRate} an hour, in person or online, and you can start with ${trialPhrase}.`,
  },
};
