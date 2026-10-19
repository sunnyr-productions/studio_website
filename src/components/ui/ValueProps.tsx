import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ModeContent } from "@/content/modes";

const headings: Record<ModeContent["id"], { eyebrow: string; title: string }> = {
  lessons: {
    eyebrow: "Why learn here",
    title: "I teach the way I wish I’d been taught",
  },
  studio: {
    eyebrow: "Why work with me",
    title: "What you can expect from me",
  },
};

/** Heading on the left, the three reasons stacked on the right with hairlines. */
export function ValueProps({ mode }: { mode: ModeContent }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
      <Reveal>
        <SectionHeading {...headings[mode.id]} />
      </Reveal>
      <ul className="border-t border-ink-900/15">
        {mode.valueProps.map((item, i) => (
          <li key={item.title} className="border-b border-ink-900/15 py-6">
            <Reveal delay={i * 100}>
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900">
                {item.title}
              </h3>
              <p className="mt-2 leading-relaxed text-ink-700">{item.body}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
