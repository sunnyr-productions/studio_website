"use client";

import { useSyncExternalStore } from "react";
import { modes, type StudioMode } from "@/content/modes";

const ORDER: StudioMode[] = ["lessons", "studio"];
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
 * The two-door switch. Sets `data-mode` on <html>; all the actual swapping is
 * CSS (see globals.css), so the page content itself is server-rendered and
 * static — this only flips the attribute and remembers the choice. Reads the
 * current door via useSyncExternalStore (external, browser-only state set by
 * the pre-paint script and this component's own click handler).
 */
export function ModeToggle({
  className = "",
  compact = false,
}: {
  className?: string;
  /** Short labels for the header, where space is tight. */
  compact?: boolean;
}) {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function pick(next: StudioMode) {
    document.documentElement.setAttribute("data-mode", next);
    try {
      localStorage.setItem("mode", next);
    } catch {
      /* private mode — session-only choice is fine */
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <div
      role="group"
      aria-label="Choose what you're here for"
      style={{ borderRadius: "var(--radius-sketch-pill)" }}
      className={`inline-flex items-center gap-1 border-[1.5px] border-ink-900/25 bg-cream-50 p-1 shadow-[3px_4px_0_0_var(--sketch-shadow)] ${className}`}
    >
      {ORDER.map((id) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => pick(id)}
            aria-pressed={isActive}
            style={{ borderRadius: "var(--radius-sketch-pill)" }}
            className={`font-semibold transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold-600 ${
              compact ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"
            } ${
              isActive
                ? id === "lessons"
                  ? "bg-marigold-500 text-[color:var(--color-ink-fixed)]"
                  : "bg-periwinkle-500 text-[color:var(--color-ink-fixed)]"
                : "bg-transparent text-ink-700 hover:text-ink-900"
            }`}
          >
            {compact ? modes[id].shortLabel : modes[id].doorLabel}
          </button>
        );
      })}
    </div>
  );
}
