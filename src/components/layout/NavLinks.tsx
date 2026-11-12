"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

/** Whether a nav link is for the page you're on, or a page inside it (a lesson, a post). */
export function useCurrent() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

/** A ray of the asterisk: tapered from its root inside the disc to a round tip. */
const RAY = "M-16 -18L-9 -56A9 9 0 0 1 9 -56L16 -18Z";

/**
 * The logo's asterisk (docs/logo/build_logo.py, `sun`): a disc and eight
 * tapered, round-tipped rays, in the logo's marigold and outlined in its
 * periwinkle. Drawn twice, the outline under the fill, so the outline runs
 * round the whole star rather than round each ray where they overlap. It
 * marks the page you're on, turning in as you arrive and then slowly on.
 */
export function Asterisk({ className = "" }: { className?: string }) {
  const star = (
    <>
      <circle r="30" />
      {RAYS.map((angle) => (
        <path key={angle} d={RAY} transform={`rotate(${angle})`} />
      ))}
    </>
  );
  return (
    <svg aria-hidden="true" viewBox="-70 -70 140 140" className={`nav-asterisk ${className}`}>
      <g className="nav-asterisk-line">{star}</g>
      <g className="nav-asterisk-fill">{star}</g>
    </svg>
  );
}

/**
 * The header's links on wide screens, in the logo's own lettering, each on a
 * flat river stone: the page you're on on a sunlit one, with the asterisk over
 * it, the one you point at on a pale one (.nav-tab in globals.css).
 */
export function NavLinks() {
  const isCurrent = useCurrent();
  return (
    <ul className="flex items-center gap-1">
      {siteConfig.nav.map((item) => {
        const current = isCurrent(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className="nav-tab"
            >
              {current && <Asterisk className="nav-asterisk-over" />}
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
