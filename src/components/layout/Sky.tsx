"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { skyThings, type SkyThingName } from "./SkyThings";

/**
 * What's up in the sky behind the page: frosted-glass clouds and the odd thing
 * floating past. Everything's seeded from the page's path, so each page has its
 * own sky that stays the same between visits and matches on server and client.
 * Spacing is in pixels and clipped to the page, so a short page shows less.
 *
 * Both come in a back and a front layer, which the page's panels, photos and
 * copy slot between (the --z-* tokens in globals.css). Big clouds and every
 * other thing go in front; the rest sit behind the frosted section panels.
 */
const SHAPES = [
  "M40 100a30 30 0 0 1-4-59a42 42 0 0 1 76-18a34 34 0 0 1 56 14a37 37 0 0 1 34 63z",
  "M30 100a26 26 0 0 1 8-50a34 34 0 0 1 58-18a44 44 0 0 1 78 10a30 30 0 0 1 40 30a15 15 0 0 1-4 28z",
  "M48 96a24 24 0 0 1 2-46a36 36 0 0 1 66-14a28 28 0 0 1 48 12a27 27 0 0 1 28 48z",
];

const VIEW_BOX = "0 0 240 120";
const CLOUD_SPACING_PX = 250;
const CLOUD_COUNT = 44;
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
function seeded(seed: number) {
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

function buildSky(pathname: string) {
  const random = seeded(hash(pathname));

  const clouds = Array.from({ length: CLOUD_COUNT }, (_, i) => {
    const size = random();
    return {
      shape: SHAPES[Math.floor(random() * SHAPES.length)],
      top: 40 + i * CLOUD_SPACING_PX + random() * (CLOUD_SPACING_PX * 0.8),
      // Alternate sides of the page, so they don't stack up in one column.
      left: (i % 2 === 0 ? -8 : 48) + random() * 44,
      width: 18 + size * 30,
      maxWidth: 200 + size * 380,
      flip: random() > 0.5,
      // Pixels moved per pixel scrolled. Bigger clouds read as nearer, so they move more.
      driftX: (random() > 0.5 ? 1 : -1) * (0.04 + size * 0.1),
      driftY: 0.05 + size * 0.1,
      front: size > 0.6,
    };
  });

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

  const things = deck.slice(0, THING_COUNT).map((name, i) => {
    const direction = random() > 0.5 ? 1 : -1;
    return {
      name,
      top: 420 + i * THING_SPACING_PX + random() * (THING_SPACING_PX * 0.5),
      // Start on the side it's heading away from, so it crosses the screen.
      left: direction > 0 ? 8 + random() * 30 : 58 + random() * 30,
      direction,
      speed: 0.28 + random() * 0.3,
      phase: random() * Math.PI * 2,
      // The page's first thing is in front, where it's easiest to spot.
      front: i % 2 === 0,
    };
  });

  return { clouds, things };
}

type Cloud = ReturnType<typeof buildSky>["clouds"][number];
type Thing = ReturnType<typeof buildSky>["things"][number];

function CloudShape({ cloud, index }: { cloud: Cloud; index: number }) {
  const mask = maskFor(cloud.shape);
  return (
    <div
      data-cloud={index}
      className="absolute aspect-[2/1] min-w-[120px]"
      style={{
        top: cloud.top,
        left: `${cloud.left}%`,
        width: `${cloud.width}%`,
        maxWidth: cloud.maxWidth,
        transform: cloud.flip ? "scaleX(-1)" : undefined,
      }}
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
      className={`absolute ${thing.front ? "opacity-90" : "opacity-60"}`}
      style={{ top: thing.top, left: `${thing.left}%`, width: thing.front ? art.width : art.width * 0.75 }}
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
  const { clouds, things } = useMemo(() => buildSky(pathname), [pathname]);
  const sky = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cloudElements = Array.from(sky.current?.querySelectorAll<HTMLElement>("[data-cloud]") ?? []);
    const thingElements = Array.from(sky.current?.querySelectorAll<HTMLElement>("[data-thing]") ?? []);
    let frame = 0;
    const drift = () => {
      frame = 0;
      const y = window.scrollY;
      const screen = window.innerHeight;
      cloudElements.forEach((element) => {
        const cloud = clouds[Number(element.dataset.cloud)];
        // Only move what's near the screen: anything moving under a frosted panel
        // makes the panel redraw its blur.
        if (Math.abs(cloud.top + y * cloud.driftY - y) > screen * 2) return;
        element.style.translate = `${y * cloud.driftX}px ${y * cloud.driftY}px`;
      });
      thingElements.forEach((element) => {
        const thing = things[Number(element.dataset.thing)];
        // Measured from when it's mid-screen, so it crosses as you pass it.
        const passed = y + screen / 2 - thing.top;
        if (Math.abs(passed) > screen * 1.5) return;
        const wobble = skyThings[thing.name].wobble;
        const swing = Math.sin(passed / 90 + thing.phase) * wobble;
        element.style.translate = `${passed * thing.speed * thing.direction}px ${passed * 0.12 + swing}px`;
        element.style.rotate = `${swing * 0.6}deg`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(drift);
    };
    drift();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [clouds, things]);

  const layer = (front: boolean) => ({
    clouds: clouds.map((cloud, i) =>
      cloud.front === front ? <CloudShape key={`${pathname}-cloud-${i}`} cloud={cloud} index={i} /> : null,
    ),
    things: things.map((thing, i) =>
      thing.front === front ? <ThingShape key={`${pathname}-thing-${i}`} thing={thing} index={i} /> : null,
    ),
  });
  const back = layer(false);
  const front = layer(true);

  return (
    <div ref={sky} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 z-[var(--z-cloud-back)]">{back.clouds}</div>
      <div className="absolute inset-0 z-[var(--z-thing-back)]">{back.things}</div>
      <div className="absolute inset-0 z-[var(--z-cloud-front)]">{front.clouds}</div>
      <div className="absolute inset-0 z-[var(--z-thing-front)]">{front.things}</div>
    </div>
  );
}
