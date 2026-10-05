# design-sync notes — raulpersonalsite-next

## Repo shape
This is a Next.js app (not a standalone component-library package), so there's
no `dist/` build and no Storybook. The converter synthesizes its bundle entry
from `.design-sync/wrappers/` (see below), never from `src/` directly.

## Why `.design-sync/wrappers/` exists
Several components (`Button`, `Header`, `Footer`, `MobileNav`, `ProductCard`)
import `next/link`. `next/link`'s internals reference Node-only `process.env.*`
globals that don't exist in a browser, and since design-sync bundles every
synced component into one shared IIFE, a crash in any one of them takes down
`window.SunnyrStudio` for *all* components.

Resolution (user-approved, see chat log):
- **`Header`, `Footer`, `MobileNav` are excluded from this sync entirely** —
  page-chrome/nav, least relevant to logo/branding work. Not in
  `componentSrcMap`, not present under `wrappers/`.
- **`Button` and `ProductCard` get sync-only wrapper variants** in
  `.design-sync/wrappers/` that swap `next/link`'s `<Link>` for a plain `<a>`.
  Visually identical to production; production source is untouched.
- **`ContactForm` and `CheckoutButton`** also get wrapper copies, solely
  because they import the real (broken) `Button` internally — their wrappers
  are byte-identical to production except the `Button` import points at the
  local wrapper instead of `@/components/ui/Button`.
- **`Card`, `Section`, `WaveformDivider`, `WaveformPlayer`,
  `PortfolioTrackList`, `CalEmbed`** have no next/link dependency — their
  wrappers are one-line `export * from "../../src/components/.../X"`
  passthroughs to the real files. Nothing about these is reimplemented.

`cfg.srcDir` is set to `.design-sync/wrappers` (not `src` or
`src/components`) specifically so the entry-synthesis walk never touches the
real `Header.tsx`/`Footer.tsx`/`MobileNav.tsx`/`Button.tsx`/`ProductCard.tsx`
— the walk sweeps every `.tsx`/`.jsx` file under `srcDir` unconditionally,
regardless of `componentSrcMap`, so this was the only way to keep the poison
files out of the bundle.

## Re-sync risk
If production `Button.tsx` or `ProductCard.tsx` change their visual API
(new props, new variants), the matching wrapper file must be updated by hand
to stay in sync — there's no automated check that they match. Diff
`.design-sync/wrappers/Button.tsx` against `src/components/ui/Button.tsx`
(and same for ProductCard) on every re-sync.

## CSS / fonts
Tailwind v4's `@import "tailwindcss"` in `globals.css` only compiles to real
utility classes at Next.js build time — the raw source file has no usable
CSS. `cfg.cssEntry` points at `.design-sync/compiled/tailwind-compiled.css`,
a **manually copied snapshot** of `next build`'s output
(`.next/static/chunks/<hash>.css`). Font files were separately copied from
`.next/static/media/*.woff2` into `.design-sync/media/` to match the relative
`url()` paths the compiled CSS expects.

**Re-sync risk**: this snapshot goes stale whenever `globals.css` changes
(new tokens, new utility classes used in components). Re-sync procedure:
1. `npm run build`
2. Find the new hashed file under `.next/static/chunks/*.css`
3. `cp` it over `.design-sync/compiled/tailwind-compiled.css`
4. `cp .next/static/media/*.woff2 .design-sync/media/`
5. Re-run the converter.

## Package/node_modules resolution (self-referential app repo)
This repo IS the package being synced (not a library dependency), so
`node_modules/raulpersonalsite-next` doesn't exist naturally. A junction
placed *inside the real repo's own `node_modules`* pointing back to the repo
root was tried and **caused a build hang** (suspected infinite directory
recursion via the self-referential junction) — do not do this.

Working approach: an external scratch `node_modules` directory (must be
literally named `node_modules` — esbuild's bare-specifier resolution walks
up looking for a directory of that exact name) outside the repo, containing
junctions for `raulpersonalsite-next` (→ repo root), `react`, and
`react-dom`. Build command:
```
node .ds-sync/package-build.mjs --config .design-sync/config.json \
  --node-modules <scratch>/node_modules --out ./ds-bundle
```
Do NOT pass `--entry` — it forces esbuild to bundle that exact file as the
literal entry point (bypassing synth-entry mode), which is how an earlier
attempt at `--entry ./package.json` ended up bundling `package.json`'s own
fields instead of the components.

Known cosmetic side effect: `cfg.tsconfig` and `cfg.extraFonts` are bounded
to a git-workspace-root computed from `dirname(--node-modules)`, which (with
the external scratch dir) doesn't encompass the real repo, so both get
skipped with a `resolves outside the workspace root` warning. In practice
`@/*` path aliases still resolve fine because esbuild's own default
tsconfig auto-discovery (independent of our config) finds the real
`tsconfig.json` through the junction. No functional impact observed.

## CalEmbed
Renders its own real "Cal Link seems to be wrong" error state — there's no
live Cal.com account/event wired up yet (see business plan: Cal.com account
setup is a user-side prerequisite, not yet done). Graded `needs-work`.
Revisit once a real `calLink` exists.

## Components excluded from this sync
`Header`, `Footer`, `MobileNav` — see wrappers section above.
