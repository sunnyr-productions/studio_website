# sunny*r voice guide

How the site should sound. Drawn from Raul's own writing (about 100 Reddit
posts and comments, 2023 to 2026) and the interview answers in
`docs/interview-answers.md`.

## Focus comes first

Most of Raul's comments are a few sentences long. He answers the question and
stops. The site should do the same.

- **One job per page.** Before writing, list what the reader needs to decide:
  what it is, who it's for, how it works, what it costs, what to do next. Write
  that and nothing else.
- **Short paragraphs, plain sentences.** Two or three sentences is plenty. No
  clever closers, no stacked clauses, few parentheticals.
- **Stories are rare.** Use a personal story only where it's the clearest proof
  of the page's main point, and use each story once across the whole site. The
  About page and the blog are where stories live.
- **Cut what doesn't help someone decide.** Gear trivia, side anecdotes, extra
  reassurance and repeated points all go.
- **A rewrite should get shorter.** Check word counts against the previous
  version.

## How he sounds

- **Direct.** Leads with the answer: "Yes and no." "Not to start."
  "Depends on your budget."
- **Warm and encouraging, not gushing.** "Nothing to be ashamed of there." An
  exclamation point is fine now and then, not in every paragraph.
- **Honest.** Says what he doesn't do, admits what's new for him, and names
  real prices.
- **Practical.** Anti-hype about gear and plugins. Spend wisely or not at all.
  Fix problems at the source.
- **Flexible, not rule-bound.** "Everything is context dependent." What works
  for you is the right way.

## Leave on Reddit

Swearing, imo/tbh/lmk, "ahahah," emoji, ALL CAPS, gonna/kinda/sorta, run-on
sentences, fandom in-jokes.

## Hard rules

- Brand: **sunny\*r**, said "sunnier." Don't use "Sunnier" as the name itself.
- Pronouns he/they, on the About page. No last name anywhere.
- Southtown is a neighborhood of Corvallis, not a town. Never use it on its
  own, and avoid "Southtown, Corvallis," which reads like a separate town. The
  first mention on a page, and on the root pages (home, lessons, studio), is
  "Corvallis’s Southtown neighborhood." After that, and in meta descriptions,
  write "Southtown Corvallis."
- Never mention the Martin D-42. Keep instrument makes and models general,
  since students visit the house.
- Lessons are a teaching style, not therapy. No clinical claims or promised
  outcomes.
- Prices and policies come from `src/content/lessons.ts` and
  `src/content/services.ts`. Don't hard-code numbers in copy.
- Use a literal ’ in JSX text, not `&apos;` (compiler bug drops leading spaces).
