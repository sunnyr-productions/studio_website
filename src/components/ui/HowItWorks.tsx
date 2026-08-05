import { Reveal } from "@/components/ui/Reveal";
import type { ModeContent } from "@/content/modes";

/**
 * Three plain steps to lower first-contact anxiety — the "how it works" every
 * lessons/service competitor front-loads. Big sticker-circle numerals in the
 * door's accent color. Rendered per door; CSS shows the active one.
 */
export function HowItWorks({ mode }: { mode: ModeContent }) {
  const isLessons = mode.id === "lessons";
  const numBg = isLessons ? "bg-marigold-500" : "bg-periwinkle-500";
  const heading = isLessons ? "Getting started is easy" : "How a project runs";
  const reassurance = isLessons
    ? "The first lesson is a discounted trial — no commitment, no pressure."
    : "Quotes are free and itemized — no obligation, no surprise fees.";

  return (
    <div data-mode-only={mode.id}>
      <Reveal>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
          {heading}
        </h2>
        <p className="mt-2 text-ink-700">{reassurance}</p>
      </Reveal>
      <ol className="mt-8 grid gap-6 sm:grid-cols-3">
        {mode.steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 90}>
            <li className="flex h-full flex-col">
              <span
                aria-hidden="true"
                style={{ borderRadius: "var(--radius-sketch-sm)" }}
                className={`flex h-11 w-11 items-center justify-center border-[1.5px] border-[color:var(--color-ink-fixed)] font-display text-lg font-semibold text-[color:var(--color-ink-fixed)] shadow-[2px_3px_0_0_var(--color-ink-fixed)] ${numBg}`}
              >
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{step.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
