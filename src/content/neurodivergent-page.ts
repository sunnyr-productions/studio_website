import { lessonPricing } from "@/content/lessons";

/**
 * Copy for /lessons/neurodivergent-learners, from Raul's own story. He's fine
 * with being specific about his diagnosis.
 *
 * Framing rule: this is a teaching style, not therapy or treatment. No clinical
 * claims and no promises about outcomes.
 */
export const neurodivergentPage = {
  published: true,
  metaTitle: "Music Lessons for Neurodivergent Learners in Corvallis, OR",
  metaDescription:
    "Music lessons from an autistic, ADHD teacher, with flexible plans and no shame about missed practice. In Corvallis or online.",
  h1: "Music lessons for autistic, ADHD and other neurodivergent learners",
  paragraphs: [
    "I’m autistic and ADHD, and I wasn’t diagnosed until adulthood. As a kid I loved music but struggled to practice between lessons, and I usually showed up embarrassed. Lessons that compared students, or only taught one way, made it worse.",
  ],
  approach: {
    title: "What I do differently",
    items: [
      "Missed practice is information, not failure. If it isn’t happening, we figure out why and change the plan.",
      "I watch for overload. When there’s too much at once, we slow down and take one piece at a time.",
      "Plans are flexible. I check in during the lesson and adjust to where you are that day.",
      "There’s no single right way. We find the approach that works for you.",
    ],
  },
  whoFor:
    "Anyone who has struggled with lessons before. You don’t need a diagnosis. If an accommodation would help, tell me ahead of time so I can prepare. Parents are welcome to sit in.",
  trial: `It’s $${lessonPricing.trial.price} and mostly a conversation about what you want to learn and what hasn’t worked before.`,
  disclaimer: "This is a teaching approach, not therapy. I can’t diagnose or treat anything.",
} as const;
