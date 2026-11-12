"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * The sun, behind the logo and behind the header's cloud: a radiant golden disc
 * with a close corona, which the cloud's frosted glass softens into light shining
 * through it, evenly, so the cloud stays one even layer. Centred on the mark, its
 * corona kept inside the cloud: the header is in front of the page, so anything
 * reaching past the cloud would shine over the copy as it scrolls under. Its wide
 * glow (SunGlow) is in the sky instead, behind everything on the page, and below
 * the cloud its rays reach out across the sky (SunRays).
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
    // The colours go on the sun and its rays (SunRays) only, never the whole page,
    // which would have the browser restyle everything on every frame of a scroll;
    // and only when they've changed.
    const rays = document.querySelector<HTMLElement>(".sun-rays");
    const glow = document.querySelector<HTMLElement>(".sun-glow");
    const header = svg.closest("header");
    // In steps too small to see, so a scroll doesn't repaint them on every frame.
    // The glow, the rays and the light in the header's cloud are big and soft, so
    // theirs are coarser: a few dozen down the page.
    const lit: [HTMLElement | SVGSVGElement | null, number, string][] = [
      [svg, 240, ""],
      [glow, 40, ""],
      [rays, 40, ""],
      [header, 40, ""],
    ];
    const paint = (day: number) => {
      lit.forEach((light) => {
        const [element, steps, painted] = light;
        if (!element) return;
        const colors = paletteAt(Math.round(day * steps) / steps);
        if (colors.join() === painted) return;
        light[2] = colors.join();
        colors.forEach((color, i) => element.style.setProperty(NAMES[i], color));
      });
    };
    // Where the rays start, and where the sun is in the header's cloud (its glass
    // reaches 0.4rem past the bar's sides and 0.9rem past its top). The header
    // holds still, so this only changes with the window.
    const place = () => {
      const box = svg.getBoundingClientRect();
      const [x, y] = [box.left + box.width / 2, box.top + box.height / 2];
      if (rays) {
        rays.style.left = `${x.toFixed(0)}px`;
        rays.style.top = `${y.toFixed(0)}px`;
      }
      // The glow is as wide as the sun's whole box, three times the mark's height.
      if (glow) {
        glow.style.left = `${x.toFixed(0)}px`;
        glow.style.top = `${y.toFixed(0)}px`;
        glow.style.width = glow.style.height = `${box.height.toFixed(0)}px`;
      }
      if (header) {
        const bar = header.getBoundingClientRect();
        header.style.setProperty("--sun-x", `calc(${(x - bar.left).toFixed(0)}px + 0.4rem)`);
        header.style.setProperty("--sun-y", `calc(${(y - bar.top).toFixed(0)}px + 0.9rem)`);
      }
    };
    let shown = dayNow();
    paint(shown);
    place();
    window.addEventListener("resize", place, { passive: true });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const onScroll = () => paint(dayNow());
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", place);
      };
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
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", place);
      cancelAnimationFrame(frame);
    };
  }, []);

  const dawn = paletteAt(0);
  return (
    <svg
      ref={sun}
      aria-hidden="true"
      viewBox="-100 -100 200 200"
      className="pointer-events-none absolute left-1/2 top-1/2 z-[-2] aspect-square h-[300%] w-auto -translate-x-1/2 -translate-y-1/2"
      style={Object.fromEntries(NAMES.map((name, i) => [name, dawn[i]]))}
    >
      <defs>
        {/* From the disc's edge (26 of 46) out to nothing, inside the cloud. */}
        <radialGradient id="sun-corona">
          <stop offset="0.5" style={{ stopColor: "var(--sun-core)" }} />
          <stop offset="0.6" style={{ stopColor: "var(--sun-glow)" }} stopOpacity="0.9" />
          <stop offset="0.8" style={{ stopColor: "var(--sun-haze)" }} stopOpacity="0.4" />
          <stop offset="1" style={{ stopColor: "var(--sun-rim)" }} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sun-disc" cx="0.45" cy="0.42" r="0.6">
          <stop offset="0" style={{ stopColor: "var(--sun-core)" }} />
          <stop offset="0.6" style={{ stopColor: "var(--sun-middle)" }} />
          <stop offset="1" style={{ stopColor: "var(--sun-rim)" }} />
        </radialGradient>
      </defs>
      <circle r="46" fill="url(#sun-corona)" />
      <circle r="26" fill="url(#sun-disc)" />
    </svg>
  );
}

/**
 * The sun's wide glow, in the sky behind the page: the back layer of clouds and
 * the things far off pass in front of it, and the page's fog and copy are in
 * front of all of them. Sun puts it where the sun is and paints it its colours.
 */
export function SunGlow() {
  return <div aria-hidden="true" className="sun-glow" />;
}

/** The rays: [angle from straight down, how wide, how long], the long ones near the middle. */
const RAYS: [number, number, number][] = [
  [-62, 5, 0.55],
  [-44, 7, 0.75],
  [-27, 4, 0.9],
  [-12, 8, 1],
  [4, 5, 0.95],
  [19, 7, 1],
  [35, 4, 0.8],
  [51, 6, 0.65],
  [68, 4, 0.5],
];

/** How much wider a ray's box is than the ray looks (see .sun-ray in globals.css). */
const WIDER = 1.6;

/**
 * Light from the sun behind the header's cloud, fanning out below it in soft
 * shafts that swing a little and brighten and fade, slowly, as light through
 * moving cloud does. They're in the sky, behind the forest and the fog, in the
 * sun's own colours (set on them by Sun as it follows the day), from where it
 * puts them.
 */
export function SunRays() {
  return (
    <div aria-hidden="true" className="sun-rays pointer-events-none absolute left-[14rem] top-[3.5rem] h-0 w-0">
      {RAYS.map(([angle, spread, length], i) => (
        <span
          key={i}
          className="sun-ray"
          style={
            {
              "--ray-angle": `${angle}deg`,
              // The box is wider than the ray looks, since it fades toward its
              // sides, and the wedge of light just fills it at its foot.
              "--ray-width": `${(spread * WIDER).toFixed(1)}vh`,
              "--ray-length": `${(length * 75).toFixed(0)}vh`,
              "--ray-half": `${((Math.atan((spread * WIDER) / 2 / (length * 75)) * 180) / Math.PI).toFixed(2)}deg`,
              "--ray-delay": `${(-i * 1.7).toFixed(1)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
