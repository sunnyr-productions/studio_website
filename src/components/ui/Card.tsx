import type { ReactNode } from "react";

type Accent = "marigold" | "periwinkle" | "none";

// Flat, un-blurred offset shadows instead of soft blur — the "sticker on
// paper" look, not the generic soft-shadow SaaS card. Color signals accent;
// hover pushes the offset further, like the card is lifting off the page.
const accentClasses: Record<Accent, string> = {
  marigold:
    "border-ink-900/80 shadow-[3px_4px_0_0_var(--color-marigold-400)] motion-safe:hover:shadow-[5px_6px_0_0_var(--color-marigold-400)]",
  periwinkle:
    "border-ink-900/80 shadow-[3px_4px_0_0_var(--color-periwinkle-400)] motion-safe:hover:shadow-[5px_6px_0_0_var(--color-periwinkle-400)]",
  none: "border-ink-900/25 shadow-[3px_4px_0_0_var(--sketch-shadow)] motion-safe:hover:shadow-[5px_6px_0_0_var(--sketch-shadow)]",
};

export function Card({
  children,
  accent = "none",
  className = "",
}: {
  children: ReactNode;
  accent?: Accent;
  className?: string;
}) {
  return (
    <div
      style={{ borderRadius: "var(--radius-sketch)" }}
      className={`border-[1.5px] bg-cream-50 p-6 transition-all duration-300 ease-out motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5 ${accentClasses[accent]} ${className}`}
    >
      {children}
    </div>
  );
}
