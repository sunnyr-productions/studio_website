import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ModeContent } from "@/content/modes";

const headings: Record<ModeContent["id"], { title: string }> = {
  lessons: {
    title: "Why learn with me",
  },
  studio: {
    title: "Why work with me",
  },
};

/** Heading on the left, the three reasons stacked on the right with hairlines. */
export function ValueProps({ mode }: { mode: ModeContent }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
      <SectionHeading {...headings[mode.id]} />
      <ul className="border-t border-ink-900/15">
        {mode.valueProps.map((item) => (
          <li key={item.title} className="border-b border-ink-900/15 py-6">
            <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900">
              {item.title}
            </h3>
            <p className="mt-2 leading-relaxed text-ink-700">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
