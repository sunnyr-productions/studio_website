"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Content rises out of the fog as you scroll to it: each block in a section
 * (and anything marked `data-rise`, like the full-width photos) waits, faint
 * and a little low, until it comes up the screen, then settles into place
 * (globals.css has the look). Blocks that come into view together rise one
 * after another. Each rises once per visit.
 *
 * Whatever is already on screen, or above it, when the page arrives is left
 * alone, so nothing at the top of a page is hidden for a moment, and with
 * reduced motion nothing waits at all.
 */
const TARGETS = "main .depth > *, main [data-rise]";

/** How many in a row get a later start; the rest go with the last. */
const MOST_STAGGERED = 4;

/** Allowed for a rise to finish, past its own stagger, before it's tidied up regardless. */
const GRACE = 1600;

export function Rise() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stagger = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--rise-stagger")) || 70;
    const timers: number[] = [];
    const watched = new Set<HTMLElement>();

    // Done: back to its place among the page's layers (.depth in globals.css).
    const settle = (element: HTMLElement) => {
      element.removeAttribute("data-rise-state");
      element.style.removeProperty("--rise-delay");
      watched.delete(element);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const arrived = entries.filter((entry) => entry.isIntersecting);
        // Jumped past without ever being on screen (a link to further down, a
        // fling, the End key): just shown, so it's there when you scroll back.
        arrived
          .filter((entry) => entry.boundingClientRect.bottom <= 0)
          .forEach((entry) => {
            observer.unobserve(entry.target);
            settle(entry.target as HTMLElement);
          });
        arrived
          .filter((entry) => entry.boundingClientRect.bottom > 0)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          .forEach((entry, i) => {
            const element = entry.target as HTMLElement;
            observer.unobserve(element);
            const delay = Math.min(i, MOST_STAGGERED) * stagger;
            element.style.setProperty("--rise-delay", `${delay}ms`);
            element.setAttribute("data-rise-state", "rising");
            const done = (event: TransitionEvent) => {
              if (event.target !== element || event.propertyName !== "opacity") return;
              element.removeEventListener("transitionend", done);
              settle(element);
            };
            element.addEventListener("transitionend", done);
            timers.push(window.setTimeout(() => settle(element), delay + GRACE));
          });
      },
      // As it comes up past the bottom of the screen, not the moment a pixel
      // shows. The area runs on far above the screen, so anything that's gone
      // past the top counts as arrived too, however it got there: an observer
      // only speaks up when something crosses an edge of its area, and a jump
      // straight past the screen crosses none of the screen's.
      { rootMargin: "100000px 0px -8% 0px" },
    );

    // Once the new page is laid out: everything below the screen waits.
    const frame = requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>(TARGETS).forEach((element) => {
        const box = element.getBoundingClientRect();
        if (box.height === 0 || box.top < window.innerHeight) return;
        element.setAttribute("data-rise-state", "waiting");
        watched.add(element);
        observer.observe(element);
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      // Anything still waiting shows as it is.
      watched.forEach(settle);
    };
  }, [pathname]);

  return null;
}
