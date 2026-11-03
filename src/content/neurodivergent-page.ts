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
    "Music lessons from an autistic, ADHD teacher, with no shame about missed practice. In Corvallis or online.",
  h1: "Music lessons for autistic, ADHD and other neurodivergent learners",
  paragraphs: [
    "I was diagnosed as an adult, after a childhood of wondering why things that seemed easy for other people weren’t easy for me. I loved music, I’d fought to get those lessons, and I still couldn’t make myself do the work between them, so I walked in ashamed every time. The classrooms that measured kids against each other were worse. Those teachers had one way of teaching, and if it didn’t work for you, that was your problem.",
    "Saying I’m patient wouldn’t tell you much, so here’s what I actually do.",
    "Missed practice tells me something. If nothing got done, we look at why, and often the answer is that I picked the wrong material or gave you too much, so we change it. Practice can be anything that gets you involved in the music, like learning a song you love or rebuilding one in your software.",
    "I watch for overload early. Body language never came naturally to me, so I learned to read it deliberately, the way you’d learn a second language, and now it’s one of the first things I notice in a room. When input starts piling up, I slow down and cut the lesson to one manageable piece. An overfull washing machine doesn’t need a lecture. It needs a smaller load, with the rest of the laundry coming later.",
    "My plans stay loose. I write an outline and check in with you as we go. Sometimes that means an honest talk about the difference between what you want to work on and what might help most, and we’ll sort that out together.",
    "I also won’t assume the standard way is your way. I’ve spent my life getting to the right place by routes that didn’t match the instructions, and I think that’s the most useful thing I bring to this.",
  ],
  story: {
    title: "One student, over a long time",
    paragraphs: [
      "My one-on-one experience so far comes from tutoring, so this story comes from there. I once had a student who was bright, in over their head and completely checked out. Everything I suggested got a polite “yeah, that sounds fine,” and whatever we covered one week was gone by the next.",
      "It took me a while to find the way in. We switched to a setup where we could both work at the same time, and I handed over the controls. I stepped in on mistakes that would only have been discouraging and let the harmless ones happen, because watching your own attempt fail teaches you more than my warning does. Bit by bit, they started telling me when they were confused, and for someone that shy, it was a big deal.",
    ],
  },
  whoFor:
    "Anyone, at any age, who has bounced off music lessons before. No diagnosis required, and you don’t owe me your medical history. If there’s an accommodation that would help, tell me before we start so I have time to set it up. Parents are welcome in the room and free to skip it.",
  trial: `It costs $${lessonPricing.trial.price}, and we mostly talk about what you want to play and what’s gone wrong before. If it doesn’t feel like a fit, either of us can say so.`,
  disclaimer: "None of this is therapy. I’m a music teacher with some lived experience, and I can’t treat anything.",
} as const;
