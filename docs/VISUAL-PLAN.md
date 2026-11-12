# Visual plan: media, motion and UI

_Written 2026-11-11. Brings the photos, the motion and the interface into the
same visual language as the scenery. Living document: tick items off as they land._

## The language we're matching

- **Drawn, not rendered.** Everything in the scene has an ink outline (about
  1.6px, round caps) and flat two-tone cartoon shading: a lit face curving over
  a shaded one, like the river stones. The buttons already follow this.
- **One day, top to bottom.** Sunrise at the top of the page, sunset at the
  footer, night below. Colour comes from that sky: marigold, coral, periwinkle.
- **Weather, not boxes.** Content sits in fog banks and clouds with billowing,
  feathered edges. Hard rectangles are the exception.
- **Motion from nature.** Clouds drift, trees sway, swimmers bob, water flows,
  and things cross the whole screen rather than stopping midway.

Anything new should be drawable in that style. The test: would it look at home
standing in the river valley?

## Done in this pass

- [x] **The sun's glow sits behind the page.** Its wide corona was drawn inside
  the sticky header, so it shone over the copy as you scrolled. Now only a close
  glow stays in the header's cloud, and the wide glow is in the sky behind the
  page (`SunGlow` in `Sun.tsx`).
- [x] **The movers differ every visit.** A fresh seed per page visit
  (`visit.ts`) deals the sky's things (one to three, varying with page length
  plus or minus one). It also picks the river's cast: usually one or two of the
  ducks, the beaver and the salmon, sometimes none, never all three. Each
  swimmer gets its own start point, bank and pace.

## Media

### Treatments

| Treatment | Looks like | Used for |
|---|---|---|
| **Drawn print** | Ink outline, a cream mat with a lit top-left and a shaded lower-right band, a soft ground shadow like the buttons, river-stone corners | Default for inline photos |
| **Vista** | Top and bottom edges dissolve into fog billows (the section fog's mask), so it reads as a view through a break in the clouds | Full-width banners |
| **Sun medallion** | Circle crop, ink outline, marigold ring, short ray ticks around it that breathe like the sun's rays | Portraits of Raul |
| **Taped print** | Print with an ink outline and a drawn washi-tape strip (marigold or periwinkle), slightly tilted | Scrapbook and candid photos |
| **Field-guide card** | Drawn print with a small hand-lettered label tab, like a specimen in a nature guide | Instruments and gear |
| **Framed embed** | The drawn print frame around a Spotify or YouTube player | Music page embeds |
| **Stage band** | Today's orange stage section, plus the ink outline | On the Rocks group photo |

All of these come from one `Frame` component with a `variant`, replacing the
separate styles in `Photo.tsx` and `Scrapbook.tsx`.

### Photo by photo

Judged on each photo's own merits, not on the slots that exist today.

| Photo | Strengths | Where | Treatment |
|---|---|---|---|
| `overlook` | Real firs and a real valley: the closest match to the drawn scene | Lessons banner | Vista |
| `hero-lessons` | Warm, smiling, firs behind | Home, "Start learning" card | Drawn print |
| `raul-headshot` | Clean, friendly | Home hero | Sun medallion |
| `raul-portrait` | Marigold sweater ties to the palette; the grey studio backdrop is cool | About | Sun medallion (the circle crop hides most of the grey) |
| `voice-mic` | Purple light reads as dusk | Voice lesson page | Drawn print, periwinkle mat |
| `stage-group` | Orange backdrop matches the sunset | Studio, a cappella | Stage band |
| `stage-soloists` | Energy, orange | Music banner | Vista |
| `polaroid-otr` | A real Polaroid, at dusk, on rocks | About scrapbook | Taped print |
| `band` | Fun; the white backdrop needs a mat to separate it | About scrapbook | Taped print |
| `arena` | Night scene | About scrapbook | Taped night print |
| `strat-case` | Warm reds and wood | Guitar page | Field-guide card |
| `taylor` | Marigold strap, warm wood | Guitar page or About gear | Field-guide card |
| `strat-bridge` | Black and white and cool: the weakest fit | About gear | Warm duotone, or retire it |

### Photos worth taking

- The studio room, wide (fills the empty `studio-1` to `studio-3` slots)
- Raul at the desk mixing (fills the empty `hero-studio` slot on the Studio page)
- A lesson in progress, such as hands on a fretboard
- An outdoor shot at golden hour, which would suit the sunset end of the page

## Motion

One vocabulary, taken from the scene. Everything respects reduced motion by
showing the final state.

| Moment | Motion | Feel |
|---|---|---|
| Content entering | Rises out of the fog: fades in, sharpens from a slight blur, settles up about 12px. Siblings stagger. Once per element. | Fog clearing |
| Photos entering | Same, a little slower, with the colour warming up as it sharpens | A print developing |
| Changing pages | The whole valley fogs over and clears on the new page: the old view pales and softens away as the new one sharpens out of the same fog (React's view transitions with Next's experimental `viewTransition` flag; `PageWeather.tsx`) | Weather passing |
| Hovering drawn objects | Lift a few pixels with a slight sway, the ground shadow spreading (as the buttons do now) | Picked up in a breeze |
| Hovering links | The drawn underline flows like the river's ripples | Water |
| Pressing | Settles down, with a small ripple ring from the press | A stone dropped in water |
| Opening the menu | The cloud puffs in, then links rise in sequence | Cloud forming |
| Opening a FAQ | The answer unfolds, and the plus turns into a minus | |

Blur is expensive and the fog already uses a lot of it, so entrance blur stays
small (a few px), runs once, and the scroll-driven parts use only opacity and
transforms.

## Interface

| Part | Change |
|---|---|
| Header nav | Mark the current page with a small drawn asterisk from the logo and a resting underline (plus `aria-current`). On hover, an ink squiggle draws in from the left. |
| Mobile menu | The dropdown becomes a cloud, using the header's glass and billow mask, with links in the display face |
| Text links | Hand-drawn marigold squiggle underline that flows on hover, replacing the flat underline |
| Buttons | Already drawn. Add the press ripple and a drawn arrow for "→". |
| Cards (home doors, prices, FAQ, testimonials) | Ink outline and the stones' lit/shaded faces, to match the buttons. Linked cards lift and sway. |
| Closing panel (`CtaPanel`) | Same drawn treatment, with a marigold-lit face |
| Form fields | Ink outline, stone corners, cream fill, a drawn select caret |
| Focus rings | Drawn in ink, a little way out from the thing, everywhere (moonlight in the night footer). Ink rather than marigold, since marigold fails contrast on the golden middle of the sky. |
| Back links and bullets | A drawn arrow, and small marigold asterisks for list bullets |
| Footer | Same components; the night colours already flip through tokens |

## Phases

1. [x] **Foundations** (2026-11-11): tokens for the ink line, glint, ground
   shadow, focus ring, link ripple and motion timings in `globals.css`; the
   `.drawn` and `.stone` styles, with the buttons moved onto them; the fog-rise
   entrance (`Rise.tsx`, with `FogBanks` drawing each cloud where its block
   will settle); `.link-drawn` links everywhere; one focus ring sitewide. Form
   fields keep their own focus style until phase 4.
2. [x] **Media** (2026-11-12): `Frame.tsx` with print, medallion, taped, guide
   and embed variants, replacing the old white mount and the scrapbook's card;
   vistas share the section fog's billowed mask (`.frame-vista`); the stage
   band is outlined in ink. Applied per the table above: the headshot and the
   About portrait are medallions, the guitars are field-guide prints tagged
   "My Strat", "My acoustic" and "My electric", the voice photo has a
   periwinkle mat, the players on the Music page are framed, and `strat-bridge`
   is toned dusk (`tone` in `media.ts`). Every frame develops into view. Also
   fixed a phase 1 bug: a block you jumped past without seeing (an anchor
   link, a fling, the End key) stayed hidden when you scrolled back up.
3. [x] **Navigation** (2026-11-12): the page you're on (or a page inside it,
   like a lesson or a post) gets `aria-current`, the logo's asterisk over it
   (it turns in as you arrive, then slowly on) and a resting marigold ripple;
   pointing at a link draws an ink ripple in from the left (`NavLinks.tsx`).
   On smaller screens the menu is a cloud of the header's glass with its edge
   drawn to its size, puffing out from under the button, its links rising in
   one after another in the display face; the button's lines fold into a
   cross. It closes on a link, Escape (focus goes back to the button) or a
   tap outside, and fades out rather than vanishing (`MobileNav.tsx`). The
   footer's links draw a marigold ripple. The cloud-drawing helpers moved to
   `cloud.ts`, shared by the fog, the header and the menu.
4. [x] **Components** (2026-11-12): cards are drawn at the lighter line with
   the stones' lit and shaded faces, tinted by their accent, and linked ones
   lift and sway; the closing panel's face is lit marigold (`.card-sunlit`).
   Questions unfold (where the browser can animate `<details>`) and a little
   marigold stone's plus folds into a minus (`PlusMinus.tsx`). Form fields
   are outlined in ink with a cream fill, a drawn caret on selects, the
   sitewide focus ring, and coral once you've left one wrong. Back links and
   "→" use a drawn arrow (`Arrow.tsx`, `BackLink.tsx`); list bullets are the
   logo's asterisk (`.list-asterisk`, and every list in blog posts). Letting
   go of a button sends a ripple ringing out from it. The audio player's
   play button is a drawn marigold stone.
5. [x] **Transitions and QA** (2026-11-12):
   - **Page transitions.** `experimental.viewTransition` is on. The whole view
     fogs over and clears, rather than the page content sinking and rising on
     its own: content caught on its own loses its fog bank's haze over the
     forest for the length of the transition, then pops back. React cancels a
     whole-view transition unless `<html>` names itself `root` inline, which
     `layout.tsx` does; an empty, per-page `<ViewTransition>`
     (`PageWeather.tsx`) is what starts one.
   - **Reduced motion.** Every animation in the stylesheet is behind the
     no-preference query (checked rule by rule in the browser); Rise, the
     scenery, the sun and the sky check it in script; page transitions turn
     off.
   - **Scroll performance.** The sky measured the page on every scroll frame
     to keep clouds out of the footer, which forced a fresh layout whenever
     content had just risen in. It now measures only when the layout changes.
     Measured in the dev build, so the numbers were relative.
   - **Phones.** All 15 pages at 375px wide: nothing runs off the side.
   - **Night footer contrast.** Every line of text is at least 7.4:1 against
     the sky behind it.
   - Not checked: Safari, and a production build.

## Decisions needed

1. **Card outlines.** Built with the recommended lighter line
   (`--ink-line-light`, 1.1px). For the full weight like the buttons, change
   the border in `.card` to `--ink-line`.
2. **Page transitions.** Decided: yes, with the experimental flag (phase 5).
3. **`strat-bridge`.** Toned dusk (plum shadows, gold light) for now. Keep it,
   or drop it from the About strip?
