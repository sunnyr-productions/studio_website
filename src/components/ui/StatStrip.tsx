import { Reveal } from "@/components/ui/Reveal";
import type { ModeContent } from "@/content/modes";

/**
 * Scannable credibility strip — the front-loaded proof competitors all lead
 * with, in the sticker idiom. One bordered strip, stat cells divided by hand-
 * drawn hairlines. Rendered per door; CSS shows the active one.
 */
export function StatStrip({ mode }: { mode: ModeContent }) {
  const accent = mode.id === "lessons" ? "text-marigold-700" : "text-periwinkle-600";
  return (
    <Reveal data-mode-only={mode.id}>
      <dl
        style={{ borderRadius: "var(--radius-sketch)" }}
        className="grid grid-cols-2 gap-px overflow-hidden border-[1.5px] border-ink-900/20 bg-ink-900/10 shadow-[3px_4px_0_0_var(--sketch-shadow)] sm:grid-cols-4"
      >
        {mode.stats.map((stat) => (
          <div key={stat.label} className="bg-cream-50 px-5 py-6 text-center">
            <dt className={`font-display text-2xl font-semibold leading-tight sm:text-3xl ${accent}`}>
              {stat.value}
            </dt>
            <dd className="mt-1 text-xs leading-snug text-ink-700">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
