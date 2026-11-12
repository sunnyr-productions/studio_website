"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { go, place } from "./journey";
import { skyThings, type SkyThingName } from "./SkyThings";
import { SunGlow, SunRays } from "./Sun";
import { useVisitSeed } from "./visit";

/**
 * What's up in the sky behind the page: soft, sunlit clouds and the odd thing
 * floating past.
 *
 * The clouds are the sky itself, held to the screen like the scenery and drifting
 * slowly left to right on their own, at the same easy pace as the trees, in a
 * loop with enough of them spaced round it that one's always in view. They pay no
 * attention to the scroll, and keep out of the footer. They come in a back and a
 * front layer (the --z-* tokens in globals.css): the far-off things fly between
 * them, and both are behind the forest and the sections' fog.
 *
 * The things are the only part of the sky that answer to the scroll (with the
 * salmon at the falls, in Scenery), and only to set them off: as you come to
 * each, it crosses the whole screen at its own pace, and if you scroll back up
 * past it, turns round where it is and goes back the way it came, facing back
 * (journey.ts), so none is ever left stopped partway.
 * They're dealt afresh on every visit to a page (visit.ts), so the show is never
 * quite the same twice: one to three of them, about one for every screen or so
 * of the page give or take one, spread down it, alongside whichever of the
 * swimmers and the salmon turn up this time (Scenery). The things all fly behind
 * the panels, so they never cross the copy. The far-off ones (planes, balloons,
 * birds, kites) are behind the forest at the bottom of the screen, and the near
 * ones go behind the far shore too, rather than over the river.
 */
const VIEW_BOX = { width: 240, height: 120 };
/** How many things a page gets: one more for each `every` px of it, within these. */
const THINGS = { fewest: 1, most: 3, every: 1800, closest: 500, first: 420 };
/** The far shore's foot, as a fraction of the screen's height from the top (Scenery's valley). */
const HORIZON = 0.865;

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

/**
 * A cloud drawn as a heap of puffs: a long, flat-bottomed base with a puff
 * rounding off each end, and three to five puffs on top, biggest in the middle,
 * all in VIEW_BOX. Circles as [x, y, r].
 */
function puffs(random: () => number) {
  const { width, height } = VIEW_BOX;
  const base = height * 0.78;
  const circles: [number, number, number][] = [];
  circles.push([44, base - 14, 18 + random() * 6], [width - 44, base - 14, 18 + random() * 6]);
  const count = 3 + Math.floor(random() * 3);
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const middle = 1 - Math.abs(t - 0.5) * 1.4;
    const r = 22 + middle * 20 + random() * 8;
    circles.push([46 + t * (width - 92) + (random() - 0.5) * 12, base - r * 0.75 - random() * 8, r]);
  }
  return circles;
}
/**
 * The same clouds on every page, so they carry on drifting as you move between
 * them. Each layer's are spaced evenly round its loop. Nearer, bigger clouds
 * cross faster, the far ones slowly, for a sense of depth, and the near ones sit
 * higher, clear of the forest.
 */
const CLOUDS = (() => {
  const random = seeded(0xc10d);
  const layer = (count: number, front: boolean) =>
    Array.from({ length: count }, (_, i) => {
      const size = front ? 0.6 + random() * 0.4 : random() * 0.6;
      // Seconds to cross: the nearer and bigger a cloud, the faster it seems to go,
      // so the far ones take three times as long as the near.
      const seconds = front ? 85 + (1 - size) * 75 : 210 + (0.6 - size) * 180;
      const along = (i + random() * 0.5) / count;
      return {
        puffs: puffs(random),
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

function buildSky(pathname: string, seed: number) {
  const random = seeded(seed ^ hash(pathname));

  // Deal the things out like a shuffled deck, so repeats stay far apart. The
  // page's own thing leads about half the time.
  const deck: SkyThingName[] = [];
  const first = FIRST_THING[pathname];
  if (first && random() < 0.5) deck.push(first);
  while (deck.length < THINGS.most) {
    const shuffled = ALL_THINGS.map((name) => ({ name, order: random() }))
      .sort((a, b) => a.order - b.order)
      .map(({ name }) => name)
      .filter((name) => name !== deck[deck.length - 1]);
    deck.push(...shuffled);
  }

  // They take turns coming in from the left and from the right.
  const firstDirection = random() > 0.5 ? 1 : -1;
  const things = deck.slice(0, THINGS.most).map((name, i) => {
    const direction = i % 2 === 0 ? firstDirection : -firstDirection;
    const far = skyThings[name].far;
    return {
      name,
      // Where it sits in its share of the page, once the page's length is known
      // (Sky's layout), and until then, roughly.
      jitter: random(),
      top: THINGS.first + i * 1200,
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

  // One fewer or one more than the page's length calls for, now and then.
  const roll = random();
  const shift = roll < 0.25 ? -1 : roll > 0.8 ? 1 : 0;

  return { things, shift };
}

type Cloud = (typeof CLOUDS)[number];
type Thing = ReturnType<typeof buildSky>["things"][number];

const NO_THINGS = { things: [] as Thing[], shift: 0 };

/**
 * One cloud: its puffs merged into a single soft shape, lit from above and
 * shaded underneath, translucent so the sky's colour comes through it.
 */
function CloudShape({ cloud, index }: { cloud: Cloud; index: number }) {
  const { width, height } = VIEW_BOX;
  const base = height * 0.78;
  const id = `cloud-${index}`;
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
      <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}-light`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.15" stopColor="#ffffff" />
            <stop offset="0.65" stopColor="#f6f3fb" />
            <stop offset="1" stopColor="#d9d3ea" />
          </linearGradient>
          <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>
        <g opacity={cloud.front ? 0.62 : 0.48} filter={`url(#${id}-soft)`} fill={`url(#${id}-light)`}>
          <rect x={30} y={base - 26} width={width - 60} height={30} rx={15} />
          {cloud.puffs.map(([x, y, r], i) => (
            <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={r.toFixed(1)} />
          ))}
        </g>
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
      className={`invisible absolute ${thing.far ? "opacity-70" : "opacity-95"}`}
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
  const seed = useVisitSeed();
  const { things, shift } = useMemo(() => (seed === null ? NO_THINGS : buildSky(pathname, seed)), [pathname, seed]);
  const sky = useRef<HTMLDivElement>(null);

  // Nothing in the sky comes into the footer: the clouds' layers (held to the
  // screen) and the things' (down the page) all end where the falls begin.
  useEffect(() => {
    const clouds = Array.from(sky.current?.querySelectorAll<HTMLElement>("[data-clouds]") ?? []);
    const flyers = Array.from(sky.current?.querySelectorAll<HTMLElement>("[data-things]") ?? []);
    const falls = document.querySelector("[data-falls]");
    const root = sky.current;
    if (!falls || !root) return;
    let frame = 0;
    // Where the falls begin, down the page. Measured only when the page's
    // layout changes, so scrolling never has to measure anything: a
    // measurement mid-scroll makes the browser lay the page out again then and
    // there, whenever something has just changed (like content rising in).
    let fallsTop = 0;
    let cloudClip = "";
    // The clouds are held to the screen, so they're cut off where the falls
    // come up it, which changes as you scroll; only written when it does.
    const clipClouds = () => {
      frame = 0;
      const belowScreen = Math.max(0, Math.round(window.innerHeight - (fallsTop - window.scrollY)));
      const clip = belowScreen ? `inset(0 0 ${belowScreen}px 0)` : "";
      if (clip === cloudClip) return;
      cloudClip = clip;
      clouds.forEach((layer) => (layer.style.clipPath = clip));
    };
    // The things are down the page with it, so their cut only moves when the
    // page's layout does.
    const measure = () => {
      const top = falls.getBoundingClientRect().top;
      fallsTop = top + window.scrollY;
      const belowPage = Math.max(0, root.getBoundingClientRect().bottom - top);
      flyers.forEach((layer) => (layer.style.clipPath = `inset(0 0 ${belowPage}px 0)`));
      clipClouds();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(clipClouds);
    };
    measure();
    const watcher = new ResizeObserver(measure);
    watcher.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      watcher.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const root = sky.current;
    if (!root) return;
    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-thing]"));
    const falls = document.querySelector("[data-falls]");
    const moving = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Where each is down the page, once it's laid out (null if the page is too
    // short for it), and how tall it is.
    const tops: (number | null)[] = things.map(() => null);
    const heights: number[] = things.map(() => 0);
    const clips: string[] = things.map(() => "");
    // Whether each has been sent across (and not called back).
    const across: boolean[] = things.map(() => false);
    let pageTop = 0;

    // Just off the side it comes in from, or the side it's heading for.
    const side = (element: HTMLElement, i: number, far: boolean) => {
      const toRight = (things[i].direction > 0) === far;
      return toRight ? window.innerWidth + 24 : -element.offsetWidth - 24;
    };
    const face = (element: HTMLElement) => element.firstElementChild as Element;
    const bob = (i: number) => {
      const thing = things[i];
      const wobble = skyThings[thing.name].wobble;
      // Two swings across the screen, wherever it is on it.
      return (x: number): [number, number] => {
        const swing = Math.sin((x / window.innerWidth) * Math.PI * 4 + thing.phase) * wobble;
        return [swing, swing * 0.6];
      };
    };
    const speed = (i: number) => things[i].speed * 320;
    const rest = (element: HTMLElement, i: number) => {
      // Gone off the far side, facing on, or waiting off the near side.
      place(element, face(element), side(element, i, across[i]), things[i].direction, { bob: bob(i) });
    };

    // Spread them evenly from near the top to a little before the falls.
    const layout = () => {
      pageTop = root.getBoundingClientRect().top + window.scrollY;
      const end = falls ? falls.getBoundingClientRect().top + window.scrollY - pageTop : root.offsetHeight;
      const room = Math.max(0, end - window.innerHeight * 0.55 - THINGS.first);
      const count = Math.min(THINGS.most, Math.max(THINGS.fewest, 1 + Math.round(room / THINGS.every) + shift));
      const gap = Math.max(THINGS.closest, room / Math.max(1, count - 1));
      elements.forEach((element) => {
        const i = Number(element.dataset.thing);
        if (i >= count) {
          tops[i] = null;
          element.style.visibility = "hidden";
          return;
        }
        const top = THINGS.first + gap * i + (things[i].jitter - 0.5) * gap * (i ? 0.3 : 0.1);
        tops[i] = top;
        heights[i] = element.offsetHeight;
        element.style.top = `${top.toFixed(0)}px`;
        element.style.visibility = "visible";
        if (moving) {
          // Its journeys place it; held still, it sits where it was put.
          element.style.left = "0";
          if (!element.getAnimations().length) rest(element, i);
        }
      });
    };

    // Each is sent across as its place on the page comes up past the middle of
    // the screen, the whole way, and if you scroll back up past it, turns round
    // where it is and goes back the way it came.
    const send = (element: HTMLElement, i: number, forward: boolean) => {
      if (across[i] === forward) return;
      across[i] = forward;
      go(element, face(element), { to: side(element, i, forward), speed: speed(i), bob: bob(i) });
    };

    let frame = 0;
    const check = (now: boolean) => {
      frame = 0;
      const line = window.scrollY + window.innerHeight * 0.45;
      const screen = window.innerHeight;
      // The far shore's foot, which rides up with the scenery at the end of the page.
      const shore = Math.min(screen, falls ? falls.getBoundingClientRect().top : screen) - screen * (1 - HORIZON);
      elements.forEach((element) => {
        const i = Number(element.dataset.thing);
        const top = tops[i];
        if (top === null) return;
        const at = pageTop + top;
        if (moving) {
          if (now) {
            // Loading the page part way down: the ones above are long gone.
            across[i] = at < line;
            rest(element, i);
          } else if (at < line) send(element, i, true);
          else if (at > line + 160) send(element, i, false);
        }
        // The near ones go down behind the far shore, not into the river: cut off
        // at the shore, allowing for the lowest it bobs in its crossing, so it
        // can't dip below between one scroll and the next.
        if (!things[i].far) {
          const reach = moving ? skyThings[things[i].name].wobble : 0;
          const below = at - window.scrollY + reach + heights[i] - shore;
          const clip = below > 0 ? `inset(0 0 ${Math.min(below, heights[i]).toFixed(0)}px 0)` : "";
          if (clip !== clips[i]) {
            clips[i] = clip;
            element.style.clipPath = clip;
          }
        }
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => check(false));
    };
    const onResize = () => {
      layout();
      onScroll();
    };
    layout();
    check(true);
    // The page's length changes as its fonts and pictures come in.
    const watcher = new ResizeObserver(onResize);
    watcher.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      watcher.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      elements.forEach((element) => element.getAnimations().forEach((animation) => animation.cancel()));
    };
  }, [things, shift]);

  const cloudLayer = (front: boolean) => (
    <div
      data-clouds
      className={`fixed inset-0 overflow-hidden ${front ? "z-[var(--z-cloud-front)]" : "z-[var(--z-cloud-back)]"}`}
    >
      {/* First, so every cloud and the far-off things pass in front of it. */}
      {!front && <SunGlow />}
      {CLOUDS.map((cloud, i) => (cloud.front === front ? <CloudShape key={i} cloud={cloud} index={i} /> : null))}
      {/* With the nearer clouds, so they keep out of the footer too. */}
      {front && <SunRays />}
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
            thing.far === far ? <ThingShape key={`${seed}-thing-${i}`} thing={thing} index={i} /> : null,
          )}
        </div>
      ))}
      {cloudLayer(true)}
    </div>
  );
}
