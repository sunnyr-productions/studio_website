"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { skyThings, type SkyThingName } from "./SkyThings";

/**
 * What's up in the sky behind the page: frosted-glass clouds and the odd thing
 * floating past.
 *
 * The clouds are the sky itself, held to the screen like the scenery and drifting
 * slowly left to right on their own, at the same easy pace as the trees, in a
 * loop with enough of them spaced round it that one's always in view. They pay no
 * attention to the scroll, and keep out of the footer. They come in a back and a
 * front layer, which the page's panels, photos and copy slot between (the --z-*
 * tokens in globals.css): big clouds go in front, the rest behind the frosted
 * section panels.
 *
 * The things are the only part of the sky (or the scenery) that answer to the
 * scroll. They're seeded from the page's path, so each page has its own that stay
 * the same between visits and match on server and client, spaced down the page in
 * pixels, so a short page shows fewer. The things all fly behind
 * the panels, so they never cross the copy, and the far-off ones (planes,
 * balloons, birds, kites) behind the forest at the bottom of the screen too.
 */
const SHAPES = [
  "M40 100a30 30 0 0 1-4-59a42 42 0 0 1 76-18a34 34 0 0 1 56 14a37 37 0 0 1 34 63z",
  "M30 100a26 26 0 0 1 8-50a34 34 0 0 1 58-18a44 44 0 0 1 78 10a30 30 0 0 1 40 30a15 15 0 0 1-4 28z",
  "M48 96a24 24 0 0 1 2-46a36 36 0 0 1 66-14a28 28 0 0 1 48 12a27 27 0 0 1 28 48z",
];

const VIEW_BOX = "0 0 240 120";
const THING_SPACING_PX = 760;
const THING_COUNT = 14;

const ALL_THINGS = Object.keys(skyThings) as SkyThingName[];

/** The first thing to float past on a page, where something suits it. */
const FIRST_THING: Record<string, SkyThingName> = {
  "/contact": "paperPlane",
  "/music": "notes",
  "/lessons": "kite",
  "/studio": "plane",
  "/about": "hotAirBalloon",
  "/blog": "paperPlane",
  "/lessons/voice": "birds",
  "/lessons/neurodivergent-learners": "bee",
};

/** Mulberry32: small seeded generator. */
export function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(text: string) {
  let h = 2166136261;
  for (const char of text) h = Math.imul(h ^ char.charCodeAt(0), 16777619);
  return h;
}

function maskFor(path: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${VIEW_BOX}' preserveAspectRatio='none'><path d='${path}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * The same clouds on every page, so they carry on drifting as you move between
 * them. Each layer's are spaced evenly round its loop. Nearer, bigger clouds
 * cross a little faster, and sit higher, clear of the forest.
 */
const CLOUDS = (() => {
  const random = seeded(0xc10d);
  const layer = (count: number, front: boolean) =>
    Array.from({ length: count }, (_, i) => {
      const size = front ? 0.6 + random() * 0.4 : random() * 0.6;
      const seconds = front ? 110 + random() * 30 : 150 + random() * 40;
      const along = (i + random() * 0.5) / count;
      return {
        shape: SHAPES[Math.floor(random() * SHAPES.length)],
        top: front ? 3 + random() * 27 : 4 + random() * 46,
        width: 18 + size * 30,
        maxWidth: 200 + size * 380,
        flip: random() > 0.5,
        front,
        seconds,
        // How far round the loop it starts, as a (negative) delay, and where it
        // sits instead when it's held still.
        delay: -along * seconds,
        still: along,
      };
    });
  return [...layer(4, false), ...layer(3, true)];
})();

function buildSky(pathname: string) {
  const random = seeded(hash(pathname));

  // Deal the things out like a shuffled deck, so repeats stay far apart.
  const deck: SkyThingName[] = [];
  const first = FIRST_THING[pathname];
  if (first) deck.push(first);
  while (deck.length < THING_COUNT) {
    const shuffled = ALL_THINGS.map((name) => ({ name, order: random() }))
      .sort((a, b) => a.order - b.order)
      .map(({ name }) => name)
      .filter((name) => name !== deck[deck.length - 1]);
    deck.push(...shuffled);
  }

  // They take turns coming in from the left and from the right.
  const firstDirection = random() > 0.5 ? 1 : -1;
  const things = deck.slice(0, THING_COUNT).map((name, i) => {
    const direction = i % 2 === 0 ? firstDirection : -firstDirection;
    const far = skyThings[name].far;
    return {
      name,
      top: 420 + i * THING_SPACING_PX + random() * (THING_SPACING_PX * 0.5),
      // Start on the side it's heading away from, so it crosses the screen.
      left: direction > 0 ? 8 + random() * 30 : 58 + random() * 30,
      direction,
      // Further off, it seems to cross more slowly and drift down less.
      speed: far ? 0.16 + random() * 0.12 : 0.34 + random() * 0.26,
      sink: far ? 0.06 : 0.12,
      phase: random() * Math.PI * 2,
      far,
    };
  });

  return things;
}

type Cloud = (typeof CLOUDS)[number];
type Thing = ReturnType<typeof buildSky>[number];

function CloudShape({ cloud }: { cloud: Cloud }) {
  const mask = maskFor(cloud.shape);
  return (
    <div
      className="sky-drift absolute left-0 aspect-[2/1] min-w-[120px]"
      style={
        {
          top: `${cloud.top}vh`,
          width: `${cloud.width}%`,
          maxWidth: cloud.maxWidth,
          transform: cloud.flip ? "scaleX(-1)" : undefined,
          // Spread across the screen when held still; the drift takes over otherwise.
          translate: `calc(${(cloud.still * 100).toFixed(1)}vw - 50%) 0`,
          "--drift-time": `${cloud.seconds.toFixed(1)}s`,
          "--drift-delay": `${cloud.delay.toFixed(1)}s`,
        } as CSSProperties
      }
    >
      <div className="cloud-glass absolute inset-0" style={{ maskImage: mask, WebkitMaskImage: mask }} />
      <svg
        viewBox={VIEW_BOX}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          d={cloud.shape}
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function ThingShape({ thing, index }: { thing: Thing; index: number }) {
  const art = skyThings[thing.name];
  return (
    <div
      data-thing={index}
      data-sky={thing.name}
      // Further away reads smaller and fainter.
      className={`absolute ${thing.far ? "opacity-70" : "opacity-95"}`}
      style={{ top: thing.top, left: `${thing.left}%`, width: thing.far ? art.width * 0.7 : art.width }}
    >
      <svg
        viewBox={art.viewBox}
        className="h-auto w-full overflow-visible"
        style={{ transform: thing.direction < 0 ? "scaleX(-1)" : undefined }}
      >
        {art.drawing}
      </svg>
    </div>
  );
}

export function Sky() {
  const pathname = usePathname();
  const things = useMemo(() => buildSky(pathname), [pathname]);
  const sky = useRef<HTMLDivElement>(null);

  // Nothing in the sky comes into the footer: the clouds' layers (held to the
  // screen) and the things' (down the page) all end where the falls begin.
  useEffect(() => {
    const clouds = Array.from(sky.current?.querySelectorAll<HTMLElement>("[data-clouds]") ?? []);
    const flyers = Array.from(sky.current?.querySelectorAll<HTMLElement>("[data-things]") ?? []);
    const falls = document.querySelector("[data-falls]");
    let frame = 0;
    const clearFooter = () => {
      frame = 0;
      if (!falls || !sky.current) return;
      const top = falls.getBoundingClientRect().top;
      const belowScreen = Math.max(0, window.innerHeight - top);
      clouds.forEach((layer) => (layer.style.clipPath = belowScreen ? `inset(0 0 ${belowScreen}px 0)` : ""));
      const belowPage = Math.max(0, sky.current.getBoundingClientRect().bottom - top);
      flyers.forEach((layer) => (layer.style.clipPath = `inset(0 0 ${belowPage}px 0)`));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(clearFooter);
    };
    clearFooter();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const thingElements = Array.from(sky.current?.querySelectorAll<HTMLElement>("[data-thing]") ?? []);
    let frame = 0;
    let then = 0;
    // Where the things think the page is. It eases after the real scroll position,
    // so they glide instead of jumping with each notch of a wheel, and come to rest
    // gently when the page stops.
    let y = window.scrollY;
    const drift = (now: number) => {
      const target = window.scrollY;
      const elapsed = then ? Math.min(now - then, 64) : 16;
      then = now;
      y += (target - y) * (1 - Math.exp(-elapsed / 140));
      if (Math.abs(target - y) < 0.5) y = target;
      if (y === target) {
        frame = 0;
        then = 0;
      } else {
        frame = requestAnimationFrame(drift);
      }
      const screen = window.innerHeight;
      thingElements.forEach((element) => {
        const thing = things[Number(element.dataset.thing)];
        // Measured from when it's mid-screen, so it crosses as you pass it.
        const passed = y + screen / 2 - thing.top;
        if (Math.abs(passed) > screen * 1.5) return;
        const wobble = skyThings[thing.name].wobble;
        const swing = Math.sin(passed / 90 + thing.phase) * wobble;
        element.style.translate = `${passed * thing.speed * thing.direction}px ${passed * thing.sink + swing}px`;
        element.style.rotate = `${swing * 0.6}deg`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(drift);
    };
    drift(performance.now());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [things]);

  const cloudLayer = (front: boolean) => (
    <div
      data-clouds
      className={`fixed inset-0 overflow-hidden ${front ? "z-[var(--z-cloud-front)]" : "z-[var(--z-cloud-back)]"}`}
    >
      {CLOUDS.map((cloud, i) => (cloud.front === front ? <CloudShape key={i} cloud={cloud} /> : null))}
    </div>
  );

  return (
    <div ref={sky} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {cloudLayer(false)}
      {[true, false].map((far) => (
        <div
          key={String(far)}
          data-things
          className={`absolute inset-0 ${far ? "z-[var(--z-thing-far)]" : "z-[var(--z-thing-near)]"}`}
        >
          {things.map((thing, i) =>
            thing.far === far ? <ThingShape key={`${pathname}-thing-${i}`} thing={thing} index={i} /> : null,
          )}
        </div>
      ))}
      {cloudLayer(true)}
    </div>
  );
}
