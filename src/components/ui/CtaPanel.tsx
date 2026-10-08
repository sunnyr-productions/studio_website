import type { ReactNode } from "react";
import { GrowthDivider } from "@/components/ui/GrowthDivider";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The closing call to action: one accented panel sitting on the page, not a
 * full-width band, so it reads as the thing to do next. One per page, last.
 */
export function CtaPanel({
  title,
  body,
  children,
}: {
  title: ReactNode;
  body: ReactNode;
  /** The buttons. */
  children: ReactNode;
}) {
  return (
    <Reveal>
      <div
        style={{ borderRadius: "var(--radius-sketch)" }}
        className="animate-drift-bg border-[1.5px] border-ink-900/80 bg-gradient-to-br from-periwinkle-100 via-coral-100 to-marigold-100 px-6 py-12 text-center shadow-[6px_8px_0_0_var(--color-marigold-400)] sm:px-12 sm:py-16"
      >
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-lg leading-relaxed text-ink-700">{body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">{children}</div>
        <GrowthDivider className="mx-auto mt-10 max-w-xs" />
      </div>
    </Reveal>
  );
}
