"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { siteConfig } from "@/lib/site-config";
import { cloud, maskOf } from "./cloud";
import { Asterisk, useCurrent } from "./NavLinks";
import { seeded } from "./Sky";

/** How far in from the menu's box its cloud's body sits, leaving room for its billows (px). */
const BILLOW_ROOM = 26;

/** The billows' radii, smallest to largest (px): big enough to read as cloud, not a ragged edge. */
const PUFF: [number, number] = [17, 26];

/**
 * The menu on smaller screens: a cloud that puffs out from under the button,
 * of the same glass as the header's, then its links rise into it one after
 * another (.menu-cloud in globals.css). Its billowing edge is drawn to its
 * size, like the header's cloud. It closes when you pick a link, press
 * Escape, or tap anywhere else, and it's always in the page, just hidden while
 * closed, so it can fade back out as well as in.
 */
export function MobileNav() {
  const pathname = usePathname();
  const isCurrent = useCurrent();
  // Open on one page only, so arriving anywhere else (a link, going back) closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);

  // Its cloud, drawn round whatever size it is.
  useEffect(() => {
    const nav = menu.current;
    if (!nav) return;
    const draw = () => {
      // Layout size, so the puff's scale doesn't skew it.
      const [width, height] = [nav.offsetWidth, nav.offsetHeight];
      if (width === 0 || height === 0) return;
      const room = BILLOW_ROOM;
      const random = seeded(Math.round(width * 31 + height));
      const shape = cloud(room, room, width - 2 * room, height - 2 * room, random, [0, 0], PUFF);
      const mask = maskOf(width, height, [{ blocks: [shape], density: 1, soften: 2.5 }]);
      nav.style.setProperty("-webkit-mask", mask);
      nav.style.setProperty("mask", mask);
      nav.toggleAttribute("data-cloud", true);
    };
    draw();
    const watcher = new ResizeObserver(draw);
    watcher.observe(nav);
    return () => watcher.disconnect();
  }, []);

  // While it's open, Escape or a tap outside it closes it.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenOn(null);
      button.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpenOn(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={root} className="lg:hidden">
      <button
        ref={button}
        type="button"
        onClick={() => setOpenOn(open ? null : pathname)}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        data-open={open || undefined}
        className="menu-button flex h-11 w-11 items-center justify-center rounded-full text-ink-900"
      >
        {/* Three drawn lines that turn into a cross. */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16" className="menu-line menu-line-top" />
          <path d="M4 12h16" className="menu-line menu-line-middle" />
          <path d="M4 17h16" className="menu-line menu-line-bottom" />
        </svg>
      </button>

      <nav ref={menu} id="site-menu" aria-label="Main" data-open={open || undefined} className="menu-cloud">
        <ul className="flex flex-col">
          {siteConfig.nav.map((item, i) => {
            const current = isCurrent(item.href);
            return (
              <li key={item.href} style={{ "--i": i } as CSSProperties}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setOpenOn(null)}
                  className="nav-link my-1.5 font-display text-2xl font-semibold text-ink-900"
                >
                  {current && <Asterisk className="nav-asterisk-before" />}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
