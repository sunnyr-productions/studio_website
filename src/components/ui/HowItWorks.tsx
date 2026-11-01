import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ModeContent } from "@/content/modes";

/**
 * Three plain steps to lower first-contact anxiety — the "how it works" every
 * lessons/service competitor front-loads. Big sticker-circle numerals in the
 * door's accent color.
 */
export function HowItWorks({ mode }: { mode: ModeContent }) {
  const isLessons = mode.id === "lessons";
  const numBg = isLessons ? "bg-marigold-500" : "bg-periwinkle-500";
  const heading = isLessons ? "How it starts" : "How a project runs";
  const reassurance = isLessons
    ? `You can stop after the trial if it's not for you.`
    : "Quotes are free, and asking for one doesn't commit you to anything.";

  return (
    <div>
      <SectionHeading title={heading} lede={reassurance} />
      <ol className="mt-10 grid gap-8 sm:grid-cols-3">
        {mode.steps.map((step, i) => (
          <li key={step.title} className="flex h-full flex-col">
              <span
                aria-hidden="true"
                style={{ borderRadius: "var(--radius-sketch-sm)" }}
                className={`flex h-11 w-11 items-center justify-center border-[1.5px] border-[color:var(--color-ink-fixed)] font-display text-lg font-semibold text-[color:var(--color-ink-fixed)] shadow-[2px_3px_0_0_var(--color-ink-fixed)] ${numBg}`}
              >
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-700">{step.body}</p>
            </li>
        ))}
      </ol>
    </div>
  );
}
