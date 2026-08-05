import { Logo } from "./Logo";

type LogoLockupProps = {
  className?: string;
  /** "horizontal" for headers/wide spaces, "stacked" for square/social contexts. */
  variant?: "horizontal" | "stacked";
};

/**
 * Full "the [sunny*r mark] studio" lockup — Fraunces letter-spaced caps
 * bracketing the ambigram mark, matching the brand sheet's primary lockups.
 */
export function LogoLockup({ className = "", variant = "horizontal" }: LogoLockupProps) {
  const label =
    "font-display font-semibold uppercase tracking-[0.35em] text-ink-900";

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        <span className={`${label} text-base -mr-[0.35em]`}>the</span>
        <Logo className="h-32 w-auto transition-transform duration-500 ease-out motion-safe:group-hover:rotate-[10deg]" />
        <span className={`${label} text-base -mr-[0.35em]`}>studio</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className={`${label} text-base`}>the</span>
      <Logo className="h-20 w-auto transition-transform duration-500 ease-out motion-safe:group-hover:rotate-[10deg]" />
      <span className={`${label} text-base -mr-[0.35em]`}>studio</span>
    </div>
  );
}
