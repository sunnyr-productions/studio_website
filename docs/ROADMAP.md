# sunny*r Studio site: roadmap and implementation plan

_Written 2026-10-15 from the full-site audit. Living document: tick items off as
they land, and update the decisions table when a decision is made._

## Where things stand

The site is built and deployed (Next.js 16, Tailwind v4, Vercel). Design, voice,
and structure have had several passes. What's holding it back is no longer
craft, it's substance and structure:

1. **No proof.** One photo, no audio, no testimonials, no reviews, no social
   links. Every claim on the site is unverifiable to a visitor.
2. **One homepage doing two jobs.** Lessons (local, recurring, often
   parent-driven) and studio work (remote, per-project, artist-driven) share one
   URL. The door choice lives in the visitor's browser, so neither side can be
   linked, shared, advertised, or ranked on its own.
3. **Local search is underused.** No Google Business Profile, page titles
   without "Corvallis", one page for four studio services, thin blog posts.
4. **Conversion paths are longer than they need to be.** Book buttons don't go
   to the calendar, the contact form is one long form for two businesses, and
   leads only exist in an inbox.

The plan below is ordered so that the cheapest, highest-leverage work comes
first, and so that nothing is built on top of a decision that hasn't been made.

### Legend

- **Owner:** `Raul` = content, accounts, or a decision only you can make.
  `Code` = implementation in this repo. `Both` = you supply, code wires it in.
- **Effort:** `S` under 2 hours · `M` half a day to a day · `L` several days.
- **Status:** `[ ]` to do · `[~]` in progress · `[x]` done.

---

## Decisions needed first

These shape everything downstream. Phase 2 can't start until D1 and D2 are
settled; several Phase 0 and 1 items are better with D3 to D5 answered.

| # | Decision | Options | Recommendation | Blocks |
|---|---|---|---|---|
| D1 | Which side should carry the business in a year? | Lessons-first · Studio-first · Equal | **DECIDED 2026-10-19: equal weight in the design; lessons promoted first because it's the easiest to market.** | 2.1, 4.2 |
| D2 | Site structure | Keep the CSS door toggle · Split into real `/lessons` and `/studio` landing pages | **DECIDED 2026-10-19: split.** `/` is a short fork page; `/lessons` and `/studio` are the full home pages; the header toggle switches between those two routes (it navigates, it no longer flips a hidden mode). | All of Phase 2 |
| D3 | Who are lessons for? | Ages (kids? teens? adults only?), Oregon State students as a target? | **DECIDED 2026-10-19:** any age, case by case (younger kids: message first). Oregon State students welcome but not targeted yet; the student-section idea is parked for later (4.5). Studio is in Southtown, Corvallis (exact address shared on booking), free street parking, instruments provided for use in lessons. | 0.8, 2.3, 4.5 |
| D4 | Lesson response promise | Keep 2 business days · 24 hours for lessons | **DECIDED 2026-10-19:** lessons 1 to 2 business days (full-time day job), studio quotes 2 business days. Revisit if you want to promise 24 hours later. | 0.7, 3.5 |
| D5 | Business email and domain | Gmail · address on your own domain | **DECIDED 2026-10-19:** no domain owned yet; register `sunnyrstudio.com` (no registration found 2026-10-19; confirm at the registrar) and use a free forwarding address (e.g. `hello@sunnyrstudio.com` forwarding to Gmail). See the steps under 1.6. | 1.6 |
| D6 | The store | Keep dormant · Remove the code · Move to Gumroad/Lemon Squeezy | **DECIDED 2026-10-19: keep dormant** (hidden from nav and search). Revisit when there are about three products you'd really sell. | 6.5 |
| D7 | Analytics | Vercel Pro (custom events) · Plausible · GA4 | **DECIDED 2026-10-19: nothing for now.** Existing Vercel page-view and speed tracking continue; the custom event calls stay in the code. Revisit (Plausible was the recommendation) once there is traffic worth measuring. | 3.4 |

---

## Phase 0: Quick wins

_Mostly code, about a day in total. Safe to do before any decision except where
noted. Each item is independent; ship them as one or two commits._

- [x] **0.1 Local titles, H1s and descriptions** · `Code` · `S`
  - Every page title and description should say what it is and where. Today
    Lessons is "Lessons | The sunny*r Studio" and the homepage never says
    Corvallis.
  - Files: `src/app/layout.tsx` (default title), `src/app/lessons/page.tsx`,
    `src/app/about/page.tsx`, `src/app/contact/page.tsx`,
    `src/app/blog/page.tsx`. Services already has a good one.
  - Suggested: Home "Music Lessons, Mixing & Mastering in Corvallis, OR";
    Lessons "Guitar, Voice & Production Lessons in Corvallis, OR".
  - Done when: every indexable page's `<title>` and meta description names the
    service and, where local, Corvallis.

- [x] **0.2 Book buttons go straight to the calendar** · `Code` · `S`
  - "Book a lesson" lands at the top of `/lessons`; it should land on the
    booking widget.
  - Change `href: "/lessons"` to `"/lessons#book"` for booking CTAs in
    `src/content/modes.ts` (primaryCta), `src/components/layout/Footer.tsx`,
    `src/app/page.tsx` (CtaPanel), `src/app/about/page.tsx`,
    `src/app/store/page.tsx`, and the "Go straight to scheduling" link in
    `src/app/contact/page.tsx`. The `id="book"` section already exists.
  - Check the section lands with a little breathing room above it (add `scroll-mt-*` if not).
  - Done when: every "Book" button scrolls to the calendar. (Done 2026-10-19.)

- [x] **0.3 Sitemap only lists pages with content** · `Code` · `S`
  - `src/app/sitemap.ts` lists Portfolio and Store while they're empty, and
    stamps every page with today's date.
  - Gate Portfolio on `portfolioTracks.length` and Store on `products.length`
    (same pattern as `siteConfig.nav`). Add `robots: { index: false }` to those
    two pages while empty.
  - Replace `lastModified: now` with real dates (a `contentUpdated` constant
    per page, or omit the field).

- [x] **0.4 Remove placeholder audio** · `Code` · `S`
  - `public/audio/sample-*.wav` (1.6 MB) are placeholders from July, publicly
    reachable at `/audio/...`, and only referenced from the commented-out
    catalogue in `src/lib/products.ts`.
  - Delete the files and the two `previewAudioUrl` lines in the template.

- [x] **0.5 Line endings** · `Code` · `S`
  - Add `.gitattributes` with `* text=auto eol=lf`, then
    `git add --renormalize .` in its own commit. Stops the CRLF warnings on
    every git command.

- [x] **0.6 Skip link** · `Code` · `S`
  - Add a visually-hidden "Skip to content" link as the first focusable element
    in `src/app/layout.tsx`, targeting `<main id="main">`.

- [x] **0.7 Response promise** · `Code` · `S` · _needs D4_
  - `siteConfig.responseTime` is one value. Split into
    `responseTime.lessons` / `responseTime.studio` and use the right one on the
    contact page, form success state, closing panels, and auto-reply
    (`src/lib/email.ts`).

- [x] **0.8 Answer the first questions people have** · `Both` · `S` · _needs D3_
  - Add to the lessons FAQ in `src/content/modes.ts`: what ages you teach;
    roughly where the studio is (neighbourhood, parking); what to bring; whether
    you have instruments to borrow.
  - Raul supplies the answers; code adds them.

---

## Phase 1: Proof and presence

_Raul-led. This is the single biggest lever on the whole site. Code work here is
small and mostly already scaffolded._

- [ ] **1.1 Google Business Profile** · `Raul` (+ `Code` `S`)
  - Create the profile as a service-area business in Corvallis (you don't have
    to show a street address). Categories: Music instructor, Recording studio.
    Add the booking link, prices, and photos.
  - Code: add the profile URL to `siteConfig` and to `sameAs` in
    `src/lib/structured-data.ts`; link it from the footer.

- [ ] **1.2 Testimonials** · `Raul` (+ `Code` `S`)
  - Target 3 to start: 2 lesson students (or parents), 1 studio client. Former
    On the Rocks members you coached count.
  - Ask for 2 to 3 sentences about a specific change, plus permission to use
    first name and last initial. Ask the same people for a Google review once
    1.1 exists.
  - Code: add entries to `src/content/testimonials.ts`; the homepage section
    appears automatically. Consider also showing one testimonial on `/lessons`
    and one on `/services` near the CTA.

- [ ] **1.3 Audio proof** · `Both` · `M` (code)
  - Raul: 2 before/after pairs (rough mix → your mix, or mix → master), 20 to
    30 seconds each, exported as MP3 at matched loudness so the comparison is
    fair. Your own music is fine if client permission isn't available yet.
  - Code: build a `BeforeAfterPlayer` (one waveform, an A/B toggle that swaps
    sources at the same playhead). Base it on
    `src/components/audio/WaveformPlayer.tsx`, and make its waveform colours
    read the theme tokens (they're hard-coded today). Host files in
    `public/audio/` (small MP3s) or Vercel Blob.
  - Place: studio hero (one pair), Services page, Portfolio.
  - Then add real tracks to `src/content/portfolio/tracks.ts`; Portfolio returns
    to the nav automatically.

- [ ] **1.4 Photos** · `Raul` (+ `Code` `S`)
  - Shot list, phone photos in good window light are fine:
    - `hero-lessons`: you mid-lesson or playing, portrait or square.
    - `hero-studio`: you at the desk or monitors, portrait or square.
    - `studio-1..3`: the room, the desk and monitors, the instruments,
      landscape.
  - Drop them in `public/images/` with those names; the slots in
    `src/content/media.ts` pick them up. Update the alt text in that file to
    describe what's actually in each photo.

- [ ] **1.5 Social profiles** · `Both` · `S`
  - Decide which you'll keep active (likely Instagram plus one of YouTube /
    SoundCloud / Spotify). Only list profiles you'll maintain.
  - Code: `siteConfig.social` array, icons in the footer, `sameAs` in the
    LocalBusiness schema.

- [ ] **1.6 Domain and business email** · `Raul` (+ `Code` `S`) · _D5 decided_
  - Steps, in this order (about an hour, plus waiting for DNS):
    1. Register `sunnyrstudio.com` at Cloudflare Registrar (sells at cost; its free Email Routing is what we want). Turn on auto-renew.
    2. In Vercel: Project > Settings > Domains > add `sunnyrstudio.com` and `www.sunnyrstudio.com`; follow the DNS records it shows (Cloudflare: set the records to "DNS only", not proxied). Make one the redirect to the other.
    3. In Vercel env vars, set `NEXT_PUBLIC_SITE_URL=https://sunnyrstudio.com` and redeploy (this fixes canonicals, sitemap, social cards).
    4. Cloudflare > Email Routing: create `hello@sunnyrstudio.com` forwarding to your Gmail.
    5. Resend > Domains: add `sunnyrstudio.com`, paste the DNS records it gives you into Cloudflare, wait until it says Verified.
    6. In Vercel env vars, set `RESEND_FROM_EMAIL=hello@sunnyrstudio.com` and redeploy. The visitor auto-reply switches on automatically.
    7. Gmail > Settings > Accounts > "Send mail as" `hello@sunnyrstudio.com`, so your replies come from the new address. Cloudflare only forwards incoming mail, so Gmail will ask for SMTP details for sending: use Resend's (`smtp.resend.com`, port 465, username `resend`, password a Resend API key).
    8. Search Console: verify the domain and submit `https://sunnyrstudio.com/sitemap.xml`.
  - Code (after step 3): update `siteConfig.email` in `src/lib/site-config.ts` to `hello@sunnyrstudio.com`, and the plain-text brand spelling used in metadata (see 4.3).
  - Until this is done the site is only on its `vercel.app` address, so canonical URLs and the sitemap point at the wrong place.

**Phase 1 is done when:** the site has at least one real photo above the fold,
one audio comparison, three testimonials, a Google profile, and a domain email.

---

## Phase 2: Information architecture, split the doors

_Code, `L` overall. Needs D1 and D2. This replaces the CSS door toggle with real
pages, which also fixes duplicated content, page weight (the homepage ships
both doors, ~166 KB of HTML), and per-side SEO._

### Target structure

```
/                       short fork: who I am, two doors, one proof each
/lessons                full lessons landing page (current lessons page + homepage lessons content)
/lessons/guitar         per-instrument pages (2.3)
/lessons/voice
/lessons/production
/lessons/audio-engineering
/lessons/neurodivergent-learners   (2.4)
/studio                 full studio landing page (replaces /services)
/studio/mixing          per-service pages (2.2)
/studio/mastering
/studio/recording
/studio/consultation
/about  /contact  /blog  /portfolio  /store  /terms  /privacy   unchanged
```

`/services` → 301 to `/studio` (and `/services/*` to `/studio/*`) via
`redirects()` in `next.config.ts`.

- [x] **2.1 Homepage becomes a fork; `/studio` becomes a landing page** · `Code` · `L` · done 2026-10-19
  - Homepage: hero with one clear line about what you do and where, two large
    door cards (each with a photo, one-line pitch, one proof point, CTA), a
    short About strip, one FAQ link, closing panel. Lead with the D1 side.
  - `/lessons`: absorb the homepage's lessons content (why, how it works, FAQ).
  - `/studio`: absorb the homepage's studio content plus the current Services
    page.
  - The "door" becomes the route: derive it from the pathname instead of
    `localStorage`. Keep `data-mode` on `<html>` only if it's still useful for
    theming (accent colour per side); set it from the route on the server so
    there's no flash.
  - Remove: `src/components/layout/HomeSections.tsx`, the `.home-sections`
    order rules and most `[data-mode-only]` usage in `src/app/globals.css`, the
    header `ModeToggle` (replace with plain "Lessons" / "Studio" nav links),
    and the `HeaderModeToggle` / `MobileNav` toggle.
  - Restructure `src/content/modes.ts` into `src/content/lessons-page.ts` and
    `src/content/studio-page.ts` (or keep one file with two exports) now that
    the content no longer needs to be interchangeable.
  - Update `src/app/sitemap.ts`, nav and footer links, and `analytics.ts`
    (drop "Door Chosen", or replace with "Door Clicked" on the homepage cards).
  - Done when: `/`, `/lessons` and `/studio` each have one H1, their own title
    and description, no hidden duplicate content, and work with JS disabled.

- [~] **2.2 Per-service pages** · `Both` · `M` · template built 2026-10-19 from draft copy in `src/content/service-pages.ts`; Raul to review, audio `example` waits on 1.3
  - One page per studio service, generated from `src/content/services.ts`
    (`app/studio/[slug]/page.tsx` with `generateStaticParams`).
  - Extend the `Service` type with: `intro`, `process` (steps), `deliverables`,
    `faqs`, `example` (audio pair id). Raul supplies the extra copy per
    service; code builds the template.
  - Each page: H1 "Mixing in Corvallis, OR (and remote)" pattern, price, what
    you send / what you get, process, example, FAQ, CTA to the short studio form.

- [~] **2.3 Per-lesson pages** · `Both` · `M` · template built 2026-10-19 from draft copy in `src/content/lesson-pages.ts`; Raul to review
  - Same approach from `src/content/lessons.ts`: `app/lessons/[slug]/page.tsx`.
  - Each page targets "<instrument> lessons in Corvallis": who it's for (ages
    from D3), what a first lesson looks like, what to bring, in-person vs
    online, price, booking.

- [~] **2.4 Neurodivergent learners page** · `Both` · `M` · scaffolded 2026-10-19 in `src/content/neurodivergent-page.ts`; published 2026-10-19 with placeholder copy ([REWRITE]/[CONFIRM] markers still in `src/content/neurodivergent-page.ts`; Raul to revise)
  - `/lessons/neurodivergent-learners`. Your strongest differentiator, and a
    real search from parents and adults.
  - Content (Raul's own words matter most here): your own experience, what you
    do differently in a lesson (pacing, structure, breaks, letting interests
    lead), who it's for, what to expect from a trial.
  - Frame it as teaching style, not therapy or treatment; don't make clinical
    claims.
  - Link it from the `/lessons` hero and the "lessons haven't worked for me"
    FAQ.

- [x] **2.5 Structured data per page** · `Code` · `M` · done 2026-10-19
  - `Service` schema on each `/studio/*` page with its price;
    `BreadcrumbList` on nested pages; `FAQPage` only on pages that render the
    FAQ, with only that page's questions. Keep `LocalBusiness` sitewide.
  - Builders in `src/lib/structured-data.ts`.

- [x] **2.6 Per-page social images** · `Code` · `M` · done 2026-10-19 (default sans font; load Fraunces later if you want the brand type)
  - Replace the single `src/app/opengraph-image.png` with generated images:
    `opengraph-image.tsx` (`ImageResponse` from `next/og`) at the root, in
    `/lessons`, `/studio`, and `blog/[slug]` (post title on the brand
    gradient). Check the Next 16 docs in
    `node_modules/next/dist/docs/` for the current file conventions first.

**Phase 2 is done when:** the CSS door system is gone, every service and
instrument has its own URL, and a mixing visitor can land on a mixing page from
search or a link.

---

## Phase 3: Conversion

_Code with Raul input. Can start in parallel with Phase 2 (3.3 and 3.4 have no
dependency on it)._

- [x] **3.1 Lessons: book first, ask second** · `Code` · `M` · done 2026-10-19
  - The primary lessons path is the Cal.com booking, not the form. On
    `/lessons`, put the calendar higher (after the pricing cards) and make
    "Book a trial" the hero CTA.
  - Contact form: when "Lessons" is picked, show a short notice ("Want to just
    book? Here's the calendar") above the optional fields.
  - Load the Cal embed only when its section scrolls into view (it's the
    heaviest script on the page).

- [x] **3.2 Shorter studio form** · `Code` · `M` · done 2026-10-19 (link is required only for mixing and mastering)
  - Required: name, email, a link to the song or project, a message. Everything
    else (song count, deadline, budget, reference, files) goes behind an
    "Add details (optional)" disclosure.
  - Files: `src/components/ContactForm.tsx`, `src/content/inquiry.ts`,
    validation in `src/app/api/contact/route.ts` (schema already treats these as
    optional).

- [~] **3.3 Don't lose leads** · `Code` · `M` · code done 2026-10-19 (Upstash Redis + per-IP rate limit, no-op until `KV_REST_API_URL`/`KV_REST_API_TOKEN` are set); Raul to connect the store in Vercel
  - Today an inquiry only exists as an email. If Resend fails or it lands in
    spam, it's gone.
  - Write every valid submission to a store before sending the notification:
    Vercel Marketplace Postgres (Neon) or Upstash Redis, or a Google Sheet via
    a service account. Notification failure then becomes recoverable.
  - Add a simple protected `/admin/inquiries` page or just use the provider's
    dashboard.
  - Add per-IP rate limiting at the same time (the TODO in
    `src/app/api/contact/route.ts`).

- [ ] **3.4 Analytics that actually report** · `Code` · `S` · _deferred (D7: nothing for now)_
  - Custom events in `src/lib/analytics.ts` only show on Vercel Pro. With
    Plausible: add the script, map `trackEvent` to `plausible()`, set up goals
    for Inquiry Sent, Lesson Booked, Door Clicked, Audio Played.
  - Update `src/app/privacy/page.tsx` to name the tool.

- [x] **3.5 Auto-reply and notification copy** · `Code` · `S` · done 2026-10-19
  - `src/lib/email.ts` still uses older phrasing ("written, itemized quote").
    Rewrite in the site voice and match the response times from 0.7.

- [ ] **3.6 Studio packages** · `Both` · `S`
  - Add EP / album pricing (e.g. 4 to 6 songs mixed and mastered) so bigger
    projects see a number. Raul sets the prices.

---

## Phase 4: Content and copy depth

- [ ] **4.1 Hero clarity** · `Both` · `S`
  - Lead with what, where, and for whom; keep the sunny line as the follow-on.
    Draft: H1 "Guitar, voice and production lessons in Corvallis", subhead
    "Taught patiently, at your pace. Let's make your sound a little sunnier."
    Equivalent for `/studio`. Raul approves final wording.

- [ ] **4.2 Proof-led stat strips** · `Both` · `S`
  - Replace years-of-experience stats with outcomes once you have them:
    students taught, songs mixed, age range taught, years teaching.

- [~] **4.3 Motto and name usage** · `Code` · `S` · motto now appears only in the footer (done 2026-10-19); plain-text spelling still to settle
  - Use "Good things grow on the sunny*r side" once per page at most (footer).
  - Settle the plain-text spelling for handles, domain and search ("sunnyr"?)
    and use it consistently in metadata and schema `alternateName`.

- [ ] **4.4 Blog: fewer, deeper posts** · `Raul` (+ `Code` `S`)
  - Merge "What Mastering Actually Does" into "Mixing vs. Mastering" and 301 the
    old URL.
  - Rewrite or replace the rest with posts only you could write: a real
    before/after walkthrough, how you structure a first lesson, a Corvallis
    gear or venue guide, a neurodivergent-learner story (with permission).
  - Target 800 to 1,500 words, one image or audio example each.
  - If there's no time for this, pause the blog and remove it from the nav
    rather than leaving thin posts.

- [ ] **4.5 OSU students** · `Both` · `S` · _needs D3_
  - If they're a target: a short section on `/lessons` (term-based scheduling,
    walking/biking distance, a student pack price if you want one).

- [x] **4.6 Confirm the flagged copy** · `Raul` · `S` · done 2026-10-19
  - Confirmed true: "I'm in sessions every day"; "I'll send you a few things I've worked on"; "Guitar usually goes better in the room, because I can see your hands"; "I'll write back myself".
  - Removed as not yet true: the "Most requested" badge on Vocal Lessons, and "I teach both ways every week" (plus the "people ask me" line) in the in-person vs online post.
  - Still to confirm: the FAQ line "I teach people who've never held a guitar and people who play out every weekend" implies a current mix of students. Reword if that isn't your situation yet.
  - Rule going forward: no claims of demand, popularity, or student mix until there are real students and reviews to back them.

---

## Phase 5: Design refinement

_After Phase 1 assets exist, so decisions are made with real photos and audio
on the page._

- [x] **5.1 A calmer studio side** · `Code` · `M` · done 2026-10-20 (no scribble, divider, or drifting gradient; single fade-in)
  - On `/studio` pages: drop the scribble circle and growth dividers, use one
    gradient surface per section, fewer animations. Keep the sticker cards and
    palette so it's clearly the same brand. Lessons keeps the playful version.

- [ ] **5.2 Audio in the studio hero** · `Code` · `S` · _needs 1.3_
  - One before/after pair directly under the studio H1.

- [x] **5.3 Ornament budget** · `Code` · `S` · done 2026-10-20 (home and lessons heroes keep the scribble only; studio hero keeps the dots only; dividers only in the lessons-side closing panel)
  - One decorative motif per section (pattern *or* divider *or* scribble).
    Audit each page against that rule.

---

## Phase 6: Quality and operations

- [ ] **6.1 Accessibility pass** · `Code` · `M`
  - Run axe (browser extension or `@axe-core/playwright`) and Lighthouse on
    every page, both themes.
  - Measure text contrast on every gradient surface (estimated so far, never
    measured); fix anything under 4.5:1 for body text.
  - Keyboard walk-through of nav, forms, FAQ, audio player, booking.

- [ ] **6.2 Performance budget** · `Code` · `M`
  - Target Lighthouse mobile ≥ 90 performance on `/`, `/lessons`, `/studio`.
  - Check after Phase 2 (page weight should drop). Lazy-load Cal (3.1) and
    wavesurfer (already lazy).

- [x] **6.3 CI and smoke tests** · `Code` · `M` · GitHub Actions (eslint, build with type-check) and the missing-space/H1 check are in (2026-10-19); Playwright smoke tests (routes, redirect, theme toggle, mocked form) in `tests/` and CI; `npm test` after a build
  - GitHub Actions on push: `tsc --noEmit`, `eslint`, `next build`.
  - Playwright smoke tests: every route returns 200; contact form submits with
    the API mocked; theme toggle works.
  - Regression test for the missing-space bug: build, then fail if any page's
    HTML matches `</(em|strong|a)>[A-Za-z]` (the compiler drops a leading
    space when JSX text contains an HTML entity like `&apos;`; use literal
    `’` in JSX text instead).

- [ ] **6.4 Monitoring** · `Code` · `S`
  - Alert on contact-route and Stripe-webhook errors (Vercel log drains or a
    simple email on caught exceptions).

- [x] **6.5 Store decision** · `Raul` · _D6 decided: keep dormant_
  - Keep dormant, remove the Stripe / Blob / webhook code, or move digital
    products to a hosted platform.

- [ ] **6.6 Production checklist** · `Raul` · `S`
  - Vercel env vars: `NEXT_PUBLIC_SITE_URL` (real domain), `RESEND_FROM_EMAIL`,
    `NEXT_PUBLIC_CAL_LINK`, `CONTACT_FORM_TO_EMAIL`.
  - Vercel Analytics and Speed Insights enabled (or Plausible per D7).
  - Domain connected, `www` redirect set, Search Console verified with the
    sitemap submitted.

---

## Suggested sequence

| Weeks | Raul | Code |
|---|---|---|
| 1 | Decisions D1 to D5; Google profile; ask for testimonials; take photos | Phase 0 |
| 2 | Record audio pairs; social profiles; domain email | 1.3 player, 1.5, 3.3 lead store, 3.4 analytics |
| 3 to 4 | Copy for service and instrument pages; neurodivergent page draft | Phase 2 |
| 5 | Review new pages; approve hero copy | 3.1, 3.2, 3.5, 4.1 to 4.3 |
| 6 | Blog rewrites (or pause) | Phase 5, then 6.1 to 6.3 |

## How to tell it's working

Track monthly once analytics (3.4) is live:

- Inquiries per month, split lessons / studio.
- Trial lessons booked, and trial → ongoing student rate.
- Google Business Profile views and calls/clicks.
- Organic search clicks (Search Console), especially for "Corvallis" queries.
- Contact form start → submit rate.

## Open questions

1. Which side should carry the business in a year? (D1)
2. What ages do you want to teach? (D3)
3. Where do leads come from today?
4. How many lesson hours a week do you have room for?
5. Is the production domain live, and what is it?
