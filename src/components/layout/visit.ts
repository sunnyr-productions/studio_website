"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

/**
 * A fresh random seed for each visit to a page, shared by everything that
 * moves on its own (the things in the sky, the swimmers and the salmon), so
 * they agree with each other about the visit and the show differs every time.
 * Coming back to a page, even one you've just left, rolls a new one.
 *
 * Null on the server and while the page hydrates, since a roll of the dice
 * can't match on both sides; the movers wait for it, and they start hidden
 * anyway.
 */
let visit: { path: string; seed: number } | null = null;

function seedFor(path: string) {
  if (visit?.path !== path) visit = { path, seed: Math.floor(Math.random() * 2 ** 32) };
  return visit.seed;
}

// The seed only changes with the page, which re-renders whatever reads it. The
// one other change is from the server's null to the browser's seed once the
// page has hydrated, which React doesn't always pick up by itself, so the store
// says it's changed as soon as anything subscribes.
const subscribe = (changed: () => void) => {
  const frame = requestAnimationFrame(changed);
  return () => cancelAnimationFrame(frame);
};

export function useVisitSeed(): number | null {
  const path = usePathname();
  return useSyncExternalStore(
    subscribe,
    () => seedFor(path),
    () => null,
  );
}
