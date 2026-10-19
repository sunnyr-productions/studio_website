/**
 * Copy for /lessons/neurodivergent-learners.
 *
 * DRAFT for Raul to rewrite in his own words; this page matters most when it
 * sounds like him. Only the first-person facts already on the site are stated
 * as fact (he's neurodivergent, no fixed curriculum, goes slowly, changes the
 * approach until it fits). Everything marked CONFIRM is a plausible
 * description of his teaching that he should check, change, or delete.
 *
 * Framing rule: this is a teaching style, not therapy or treatment. No
 * clinical claims, no promises about outcomes, no diagnostic language beyond
 * how people describe themselves.
 */
export const neurodivergentPage = {
  /**
   * Flip to true once every [REWRITE] and [CONFIRM] is resolved. While false
   * the page is noindexed, left out of the sitemap, and not linked from
   * /lessons, so placeholder text never reaches visitors or search.
   */
  published: true,
  metaTitle: "Music Lessons for Neurodivergent Learners in Corvallis, OR",
  metaDescription:
    "Patient, flexible guitar, voice, and production lessons from a neurodivergent teacher in Corvallis, Oregon and online. No fixed curriculum, and you set the pace.",
  h1: "Music lessons for neurodivergent learners",
  intro:
    "I’m neurodivergent myself, and a lot of lessons I had growing up didn’t work for the way my brain works. So I teach differently: slowly, flexibly, and around what you’re into.",

  /** Raul's own story. CONFIRM / REWRITE: he should write this section. */
  story: {
    title: "Why I teach this way",
    paragraphs: [
      "[REWRITE: your own experience. What was hard about learning music in a traditional setting? Who taught you well, and what did they do? Keep it short and true.]",
      "My own music teachers were always my most impactful ones growing up, and I try to pay that forward. I’m not a strict or rigid teacher.",
    ],
  },

  /** CONFIRM each: does this describe what you actually do? */
  differences: [
    {
      title: "You set the pace",
      body: "There’s no fixed curriculum and no schedule of what you ‘should’ know by when. If something isn’t clicking, we try it another way, and as many times as it takes.",
    },
    {
      title: "Your interests lead",
      body: "If you’d rather chase a different song this week, we do that. The music you care about is the best reason to practise, so we start there.",
    },
    {
      title: "Clear, predictable structure",
      body: "[CONFIRM: e.g. each lesson opens the same way, and I tell you what we’ll do before we do it. Change this to what you really do.]",
    },
    {
      title: "Breaks are fine",
      body: "[CONFIRM: e.g. need to stop, move around, or just listen for a minute? That’s part of the lesson.]",
    },
  ],

  whoFor: {
    title: "Who this is for",
    body: "Kids, teens, and adults who’ve found traditional lessons a poor fit, for any reason, and anyone who learns differently. You don’t need a diagnosis or to tell me anything you don’t want to. I take younger kids case by case, so message me about your child first.",
  },

  trial: {
    title: "What to expect from a trial",
    steps: [
      "We talk about what you want to play and what hasn’t worked before. You can tell me as much or as little as you like.",
      "We try something short and see how it feels, with no pressure to get it right.",
      "At the end you decide whether it’s a fit. The trial is a $20 half-hour, and you can stop there.",
    ],
  },

  disclaimer:
    "These are music lessons, taught in a way that’s flexible and patient. They aren’t therapy or treatment, and I don’t make medical or clinical claims.",

  faqs: [
    {
      q: "Do I need a diagnosis?",
      a: "No. You don’t have to share anything about yourself that you don’t want to. If something helps me teach you better, you’re welcome to tell me, and that’s up to you.",
    },
    {
      q: "Are these lessons therapy?",
      a: "No. They’re music lessons taught in a patient, flexible way. I’m a teacher, not a clinician.",
    },
    {
      q: "What if I need to change things partway through?",
      a: "That’s normal. If the pace, the song, or the way I’m explaining something isn’t working, tell me and we’ll change it.",
    },
    {
      q: "Can a parent sit in?",
      a: "[CONFIRM your preference.] For younger kids, message me first and we’ll work out what makes the trial comfortable.",
    },
  ],
} as const;
