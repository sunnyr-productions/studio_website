import type { ReactNode } from "react";

type Accent = "marigold" | "periwinkle" | "coral" | "none";

// Flat, un-blurred offset shadows. Color signals accent.
const accentClasses: Record<Accent, string> = {
  marigold:
    "border-ink-900/80 shadow-[3px_4px_0_0_var(--color-marigold-400)]",
  periwinkle:
    "border-ink-900/80 shadow-[3px_4px_0_0_var(--color-periwinkle-400)]",
  coral:
    "border-ink-900/80 shadow-[3px_4px_0_0_var(--color-coral-400)]",
  none: "border-ink-900/25 shadow-[3px_4px_0_0_var(--sketch-shadow)]",
};

export function Card({
  children,
  accent = "none",
  interactive = false,
  className = "",
}: {
  children: ReactNode;
  accent?: Accent;
  /** The card is a link: it lifts on hover. Plain cards stay still. */
  interactive?: boolean;
  className?: string;
}) {
  return (
    <div
      style={{ borderRadius: "var(--radius-sketch)" }}
      className={`surface-card border-[1.5px] p-6 ${interactive ? "transition-transform duration-300 ease-out motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5" : ""} ${accentClasses[accent]} ${className}`}
    >
      {children}
    </div>
  );
}
