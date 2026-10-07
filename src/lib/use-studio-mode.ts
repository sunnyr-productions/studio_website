"use client";

import { useSyncExternalStore } from "react";
import type { StudioMode } from "@/content/modes";

/** Fired by setStudioMode so every subscriber re-reads the door. */
const EVENT = "sunnyr:mode-change";

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): StudioMode {
  return document.documentElement.getAttribute("data-mode") === "studio" ? "studio" : "lessons";
}

// Matches the <html data-mode="lessons"> default in the root layout — must
// equal the server-rendered value exactly, or React logs a mismatch.
function getServerSnapshot(): StudioMode {
  return "lessons";
}

/**
 * The visitor's current door. External, browser-only state (set by the
 * pre-paint script in the root layout and by setStudioMode), read via
 * useSyncExternalStore so it stays hydration-safe.
 */
export function useStudioMode(): StudioMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Switch doors: flips `data-mode` on <html>, remembers it, notifies subscribers. */
export function setStudioMode(next: StudioMode) {
  document.documentElement.setAttribute("data-mode", next);
  try {
    localStorage.setItem("mode", next);
  } catch {
    /* private mode — session-only choice is fine */
  }
  window.dispatchEvent(new Event(EVENT));
}
