import type { ReactNode } from "react";

/**
 * Long-form text styling (blog posts, terms, privacy) — headings, paragraphs,
 * lists, and links styled from the parent so MDX output and hand-written JSX
 * look identical. Links get the drawn ripple underline (.prose-drawn).
 */
export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`prose-drawn leading-relaxed text-ink-700 [&_h2]:mt-8 [&_h2]:scroll-mt-24 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink-900 [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-ink-900 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:space-y-1[&_strong]:font-semibold [&_strong]:text-ink-900 ${className}`}
    >
      {children}
    </div>
  );
}
