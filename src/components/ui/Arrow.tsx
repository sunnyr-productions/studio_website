/**
 * A drawn arrow, in place of "→" and "←": a shaft that sags a touch, like a
 * line drawn by hand, and an open head, in round-capped strokes of the
 * text's colour (.arrow in globals.css).
 */
export function Arrow({ direction = "right", className = "" }: { direction?: "right" | "left"; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`arrow ${direction === "left" ? "-scale-x-100" : ""} ${className}`}
    >
      <path d="M2 8.7C6.2 7.7 11 7.8 17 8.1" />
      <path d="M12.4 3.9L17.4 8.1L12.9 12.4" />
    </svg>
  );
}
