"use client";

import { useEffect, useRef } from "react";

/**
 * The sun, behind the logo, glowing through the header's cloud: a radiant golden
 * disc with a soft corona round it, somewhere between drawn and real. It sits just
 * in front of the cloud's glass (which would blur it away to nothing), softened
 * and a little see-through so the cloud shows through it, and its light spills
 * out past the cloud's top. Centred on the mark, nearly twice its height.
 *
 * The page runs through a day from sunrise at the top to sunset at the footer
 * (--sky-day in globals.css), and the sun follows it as you scroll: soft gold at
 * dawn, near white at midday, deep orange-red by evening.
 */

type Rgb = [number, number, number];
/** The disc's centre, middle and rim, then the corona's inner and outer glow. */
type Palette = [Rgb, Rgb, Rgb, Rgb, Rgb];

const hex = (color: string): Rgb => [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16)) as Rgb;

/**
 * The sun's colours through the day, at that far down the page. Close together,
 * so it moves through them gently rather than swinging between three.
 */
const DAY: [number, Palette][] = [
  [0, ["#fff1e6", "#ffcf9a", "#f5a070", "#ffe0cc", "#f8b490"].map(hex) as Palette],
  [0.18, ["#fff8ea", "#ffdc95", "#f9b45f", "#ffe9c6", "#fbc572"].map(hex) as Palette],
  [0.4, ["#fffdf2", "#ffe68a", "#fbbe4e", "#fff1c2", "#fcd25a"].map(hex) as Palette],
  [0.62, ["#fffbe6", "#ffd978", "#f9aa40", "#ffeab4", "#fbc04c"].map(hex) as Palette],
  [0.8, ["#fff2d8", "#ffbe68", "#f28a3e", "#ffdaa8", "#f7a050"].map(hex) as Palette],
  [1, ["#ffe3c8", "#ff9a5a", "#e8553a", "#ffc7a0", "#f2734a"].map(hex) as Palette],
];

const NAMES = ["--sun-core", "--sun-middle", "--sun-rim", "--sun-glow", "--sun-haze"];

function paletteAt(day: number): string[] {
  const after = DAY.findIndex(([at]) => at >= day);
  if (after <= 0) return DAY[0][1].map((c) => `rgb(${c.join(" ")})`);
  const [from, a] = DAY[after - 1];
  const [to, b] = DAY[after];
  const t = (day - from) / (to - from);
  return a.map((c, i) => `rgb(${c.map((v, j) => Math.round(v + (b[i][j] - v) * t)).join(" ")})`);
}

/** How far through the day the page has scrolled, 0 at the top to 1 at the bottom. */
function dayNow() {
  const room = document.documentElement.scrollHeight - window.innerHeight;
  return room > 0 ? Math.min(1, Math.max(0, window.scrollY / room)) : 0;
}

export function Sun() {
  const sun = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = sun.current;
    if (!svg) return;
    const paint = (day: number) => paletteAt(day).forEach((color, i) => svg.style.setProperty(NAMES[i], color));
    let shown = dayNow();
    paint(shown);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const onScroll = () => paint(dayNow());
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
    // The colour eases after the scroll, so even a quick jump down the page turns
    // it over a second or so rather than all at once.
    let frame = 0;
    let then = 0;
    const follow = (now: number) => {
      const target = dayNow();
      const elapsed = then ? Math.min(now - then, 64) : 16;
      then = now;
      shown += (target - shown) * (1 - Math.exp(-elapsed / 450));
      if (Math.abs(target - shown) < 0.001) shown = target;
      paint(shown);
      if (shown === target) {
        frame = 0;
        then = 0;
      } else {
        frame = requestAnimationFrame(follow);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(follow);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const dawn = paletteAt(0);
  return (
    <svg
      ref={sun}
      aria-hidden="true"
      viewBox="-100 -100 200 200"
      className="pointer-events-none absolute left-1/2 top-1/2 z-[-1] aspect-square h-[190%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-85 blur-[1.5px]"
      style={Object.fromEntries(NAMES.map((name, i) => [name, dawn[i]]))}
    >
      <defs>
        <radialGradient id="sun-corona">
          <stop offset="0.3" style={{ stopColor: "var(--sun-glow)" }} stopOpacity="0.95" />
          <stop offset="0.5" style={{ stopColor: "var(--sun-haze)" }} stopOpacity="0.55" />
          <stop offset="0.75" style={{ stopColor: "var(--sun-rim)" }} stopOpacity="0.18" />
          <stop offset="1" style={{ stopColor: "var(--sun-rim)" }} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sun-disc" cx="0.42" cy="0.4" r="0.65">
          <stop offset="0" style={{ stopColor: "var(--sun-core)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--sun-middle)" }} />
          <stop offset="1" style={{ stopColor: "var(--sun-rim)" }} />
        </radialGradient>
      </defs>
      <circle r="100" fill="url(#sun-corona)" />
      <circle
        r="38"
        fill="url(#sun-disc)"
        style={{ stroke: "var(--sun-rim)" }}
        strokeOpacity="0.6"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
