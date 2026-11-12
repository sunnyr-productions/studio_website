import type { ReactNode } from "react";

type Accent = "marigold" | "periwinkle" | "coral" | "none";

// A drawn card; the accent tints its lit and shaded faces (.card in globals.css).
const accentClasses: Record<Accent, string> = {
  marigold: "card-marigold",
  periwinkle: "card-periwinkle",
  coral: "card-coral",
  none: "",
};

export function Card({
  children,
  accent = "none",
  interactive = false,
  className = "",
}: {
  children: ReactNode;
  accent?: Accent;
  /** The card is a link: it lifts and sways on hover. Plain cards stay still. */
  interactive?: boolean;
  className?: string;
}) {
  return (
    <div
      style={{ borderRadius: "var(--radius-sketch)" }}
      className={`surface-card card p-6 ${interactive ? "card-lift" : ""} ${accentClasses[accent]} ${className}`}
    >
      {children}
    </div>
  );
}
