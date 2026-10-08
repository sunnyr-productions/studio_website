import type { ReactNode } from "react";

/**
 * The one heading block for a section: optional eyebrow, title, optional lede,
 * and an optional action that sits opposite the title on wide screens. Keeps
 * heading size and the title-to-lede gap identical on every page; content
 * that follows should start at `mt-10`.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  action,
  as: Tag = "h2",
  className = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  action?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  const titleSize = Tag === "h1" ? "text-4xl sm:text-5xl" : "text-3xl";
  return (
    <div className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-4 ${className}`}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-3 text-sm font-semibold tracking-[0.08em] text-periwinkle-700">
            {eyebrow}
          </p>
        )}
        <Tag className={`font-display font-semibold tracking-tight text-ink-900 ${titleSize}`}>
          {title}
        </Tag>
        {lede && <div className="mt-3 text-lg leading-relaxed text-ink-700">{lede}</div>}
      </div>
      {action}
    </div>
  );
}
