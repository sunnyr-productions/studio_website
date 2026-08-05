type ScribbleProps = {
  children: React.ReactNode;
  color?: string;
  className?: string;
};

/**
 * Wraps a word/phrase in a hand-drawn circle, like it's been marked up with
 * a pen. Used sparingly (1-2 places per page, never as a generic pattern) so
 * it reads as a deliberate accent, not decoration-by-default.
 */
export function Scribble({ children, color = "var(--color-marigold-500)", className = "" }: ScribbleProps) {
  return (
    <span className={`relative inline-block whitespace-nowrap ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 220 90"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[10%] -inset-y-[22%] z-0"
      >
        <path
          d="M 22,48 C 14,20 44,6 90,5 C 150,3 208,14 213,42 C 217,65 178,84 108,85 C 48,86 10,72 16,50"
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
