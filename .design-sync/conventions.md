## The sunny*r Studio — building with this design system

**No wrapper/provider needed.** Components render styled as soon as
`styles.css` is loaded — there's no root `ThemeProvider` or context to wrap
your app in.

**Styling idiom: Tailwind utility classes, brand color scale + neutrals.**
Style new layout/glue markup with this system's own palette rather than
inventing new colors:

| Family | Classes | Use |
|---|---|---|
| Marigold (primary accent) | `bg-marigold-400/500/600`, `text-marigold-600/700/800`, `border-marigold-500` | buttons, CTAs, large text, icons, accent borders |
| Periwinkle (secondary accent) | `bg-periwinkle-50`, `text-periwinkle-600/700`, `border-periwinkle-400` | links, secondary buttons, decorative strokes |
| Ink (body text) | `text-ink-500/700/900` | never pure black — `ink-900` is the darkest, `ink-500` for muted/secondary text |
| Cream (backgrounds) | `bg-cream-50/100/200` | warm off-white backgrounds; `cream-50` lightest |

Full token scale (all 50–900 steps) lives in `styles.css`'s `@theme` block —
read it before inventing a shade that isn't there.

**Typography.** Two font families, both wired via CSS custom properties:
- `font-display` (Fraunces — a warm serif) for headings/display text
- `font-sans` (Inter) for body copy — this is also the default body font

Base body text should stay ≥16px with line-height ≥1.5 (an explicit
accessibility requirement for this brand — it serves a wide age range of
music students).

**Card/Section composition pattern.** `Section` takes an optional `pattern`
prop (`"dots" | "waveform" | "none"`) that renders a decorative background
motif — reach for this instead of adding a custom background pattern.
`Card` takes an optional `accent` prop (`"marigold" | "periwinkle" | "none"`)
that adds a colored top border — use it to color-code card categories rather
than changing the card's fill color.

**Where the truth lives.** `styles.css` (root) is the real stylesheet
closure — read it for the exact token values. Each component's
`<Name>.prompt.md` documents its own props.

**Known gap:** `Header`, `Footer`, and page navigation are NOT in this
design system yet (excluded during sync — see `.design-sync/NOTES.md`). When
building full-page layouts, compose your own header/nav using the `Button`
and brand tokens above rather than assuming a `Header` component exists.

**Example — a booking CTA in this system's idiom:**
```jsx
<Section pattern="waveform" className="bg-cream-100">
  <h2 className="font-display text-3xl font-semibold text-ink-900">
    Ready to get started?
  </h2>
  <p className="mt-3 max-w-xl text-ink-700">
    Book a first lesson, or tell me about a project you need mixed or mastered.
  </p>
  <div className="mt-8 flex gap-4">
    <Button variant="primary">Book a lesson</Button>
    <Button variant="secondary">Start a project</Button>
  </div>
</Section>
```
