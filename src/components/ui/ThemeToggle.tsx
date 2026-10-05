"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const EVENT = "sunnyr:theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

// Matches the <html data-theme="light"> default in the root layout — the
// pre-paint script may have already corrected the real DOM before hydration,
// but the SERVER-rendered value (what this returns) must match that default
// exactly, or React logs a hydration mismatch.
function getServerSnapshot(): Theme {
  return "light";
}

/**
 * Light/dark switch. Reads <html data-theme> via useSyncExternalStore — the
 * value is external, browser-only state set by the pre-paint script in the
 * root layout and by this component's own click handler, so this is the
 * React-recommended way to read it (no effect+setState render cascade).
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "dark";

  function toggle() {
    const next: Theme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode — session-only toggle is fine */
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-9 w-9 items-center justify-center border-[1.5px] border-ink-900/25 bg-cream-50 text-ink-900 shadow-[2px_3px_0_0_var(--sketch-shadow)] transition-all duration-300 ease-out motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[3px_4px_0_0_var(--sketch-shadow)] motion-safe:active:translate-x-0 motion-safe:active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold-600"
      style={{ borderRadius: "var(--radius-sketch-sm)" }}
    >
      {/* Sun */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={`absolute text-marigold-600 transition-all duration-300 ${
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      >
        <circle cx="12" cy="12" r="4.5" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
        </g>
      </svg>
      {/* Moon */}
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={`absolute text-periwinkle-500 transition-all duration-300 ${
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        }`}
      >
        <path
          d="M20 14.5A8 8 0 0 1 9.5 4 6.5 6.5 0 1 0 20 14.5Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
