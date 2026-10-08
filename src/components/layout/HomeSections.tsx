"use client";

import { Children, Fragment, type ReactNode } from "react";
import { useStudioMode } from "@/lib/use-studio-mode";

/** Studio door leads with client work; ids not listed keep their place at the end. */
const STUDIO_ORDER = [
  "services",
  "portfolio",
  "why",
  "how",
  "lessons",
  "testimonials",
  "faq",
  "cta",
];

type HomeSectionsProps = {
  /** One id per rendered child, in the same (lessons-door) order. */
  ids: string[];
  children: ReactNode;
};

/**
 * Homepage sections in the running order of the current door. The server
 * renders lessons order; the `order` rules in globals.css re-sequence it
 * visually for the studio door before hydration, and this then moves the DOM
 * nodes to match, so keyboard and screen-reader order follow what's on screen.
 */
export function HomeSections({ ids, children }: HomeSectionsProps) {
  const mode = useStudioMode();
  const sections = Children.toArray(children).map((node, i) => ({ id: ids[i], node }));

  if (mode === "studio") {
    const rank = (id: string) => {
      const i = STUDIO_ORDER.indexOf(id);
      return i === -1 ? STUDIO_ORDER.length : i;
    };
    sections.sort((a, b) => rank(a.id) - rank(b.id));
  }

  return (
    <div className="home-sections">
      {sections.map(({ id, node }) => (
        <Fragment key={id}>{node}</Fragment>
      ))}
    </div>
  );
}
