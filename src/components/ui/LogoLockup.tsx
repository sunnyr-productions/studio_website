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

  // Sized with real dimensions per breakpoint, not a transform: a scaled
  // lockup keeps its full-size layout box, which pushed "studio" under the
  // header controls on phones.
  const horizontalLabelSize = "text-[0.6875rem] sm:text-sm lg:text-base";

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        <span className={`${label} text-base -mr-[0.35em]`}>the</span>
        <Logo className="h-32 w-auto" />
        <span className={`${label} text-base -mr-[0.35em]`}>studio</span>
      </div>
    );
  }

  return (
    <div className={`flex shrink-0 items-center gap-2 sm:gap-3.5 lg:gap-4 ${className}`}>
      <span className={`${label} ${horizontalLabelSize}`}>the</span>
      <Logo className="h-12 w-auto max-[359px]:h-10 sm:h-[4.5rem] lg:h-20" />
      <span className={`${label} ${horizontalLabelSize} -mr-[0.35em]`}>studio</span>
    </div>
  );
}
