import { Logo } from "./Logo";

type LogoLockupProps = {
  className?: string;
  /** "horizontal" for headers/wide spaces, "stacked" for square/social contexts. */
  variant?: "horizontal" | "stacked";
};

/**
 * Full "the [sunny*r mark] studio" lockup. Each word's column fits the word, so
 * both sit the same distance from the mark rather than the mark being centered.
 * They sit inside a band whose rules run in to meet the mark's own curves.
 * `.logo-lockup` in globals.css owns the sizes and the rules.
 */
export function LogoLockup({ className = "", variant = "horizontal" }: LogoLockupProps) {
  // The negative margin drops the tracking after the last letter, which would
  // otherwise push each word off center.
  const label =
    "font-display font-semibold uppercase tracking-[0.2em] -mr-[0.2em] text-ink-900 sm:tracking-[0.24em] sm:-mr-[0.24em]";

  // Sized with real dimensions per breakpoint, not a transform: a scaled
  // lockup keeps its full-size layout box, which pushed "studio" under the
  // header controls on phones.
  const horizontalLabelSize = "text-[10px] sm:text-[13px] lg:text-[15px]";

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        <span className={`${label} text-base`}>the</span>
        <Logo className="h-32 w-auto" />
        <span className={`${label} text-base`}>studio</span>
      </div>
    );
  }

  return (
    <div className={`logo-lockup ${className}`}>
      <span className="logo-band logo-band-start">
        <span className={`${label} ${horizontalLabelSize}`}>the</span>
      </span>
      <Logo className="h-[var(--logo-height)] w-auto" />
      <span className="logo-band logo-band-end">
        <span className={`${label} ${horizontalLabelSize}`}>studio</span>
      </span>
    </div>
  );
}
