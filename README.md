# The sunny\*r Studio

Website for The sunny\*r Studio — music lessons (guitar, voice, production, audio engineering) plus mixing, mastering, and recording in Corvallis, OR and online.

Built with Next.js (App Router), Tailwind CSS v4, MDX blog posts, Cal.com booking, Resend email, Stripe checkout, and Vercel Blob for digital downloads.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you need; everything is optional for dev
npm run dev                  # http://localhost:3000
```

Before pushing: `npm run lint && npm run build`.

## Environment variables

See [`.env.example`](.env.example) for the full list and what each one does. Without them the site still runs — the booking embed falls back to a contact CTA, and the contact form / store return a friendly error instead of sending.

## Where content lives

| What | File |
| --- | --- |
| Site name, email, nav, location | `src/lib/site-config.ts` |
| Two-door homepage copy (lessons / studio), stats, FAQs | `src/content/modes.ts` |
| Lesson types | `src/content/lessons.ts` |
| Studio services + starting prices | `src/content/services.ts` |
| Portfolio tracks | `src/content/portfolio/tracks.ts` |
| Testimonials | `src/content/testimonials.ts` |
| Store products | `src/lib/products.ts` |
| Blog posts | `src/content/blog/*.mdx` |

Portfolio, testimonials, and store are empty on purpose: each section stays hidden (or shows an honest "coming soon" state) until real entries are added, so no placeholder content ships.

## Store fulfillment flow

1. `/api/checkout` creates a Stripe Checkout session for a product.
2. Stripe calls `/api/webhooks/stripe` on `checkout.session.completed`.
3. The webhook signs a 48-hour private Vercel Blob URL and emails it via Resend. If that fails it returns 500, so Stripe retries.

## Design sync

`.design-sync/` holds wrappers and notes for syncing components to claude.ai/design — see `.design-sync/NOTES.md`.
