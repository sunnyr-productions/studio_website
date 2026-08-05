"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { ModeToggle } from "@/components/ui/ModeToggle";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink-900 transition-transform duration-200 motion-safe:active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold-600"
      >
        <span className="sr-only">Toggle menu</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={`origin-center transition-all duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          />
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={`origin-center transition-all duration-300 ${open ? "opacity-0" : "opacity-100"}`}
          />
        </svg>
      </button>

      {open && (
        <nav className="animate-fade-up absolute inset-x-0 top-full z-40 border-t border-ink-900/10 bg-cream-50 px-6 py-4 shadow-lg">
          <div className="mb-4 border-b border-ink-900/10 pb-4">
            <ModeToggle />
          </div>
          <ul className="flex flex-col gap-3">
            {siteConfig.nav.map((item, i) => (
              <li
                key={item.href}
                data-mode-only={item.modes?.length === 1 ? item.modes[0] : undefined}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-lg font-medium text-ink-900 transition-colors hover:text-marigold-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
