"use client";

import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

/**
 * Weather passing between pages: as you go from one page to the next, the
 * whole valley fogs over and clears on the new page (the root's view
 * transition in globals.css). The whole view rather than just the page's
 * content, since content caught on its own loses the fog banks' haze over
 * the forest behind it for the length of the transition.
 *
 * React only starts a view transition when a <ViewTransition> changes, so
 * this is an empty one that's new on every page. It draws nothing itself
 * ("none"); the root's transition is what animates. React would cancel that
 * too, as nothing outside a <ViewTransition> asked for it, unless the <html>
 * element names itself "root" inline, which layout.tsx does.
 */
export function PageWeather() {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="none" exit="none" default="none">
      <span hidden />
    </ViewTransition>
  );
}
