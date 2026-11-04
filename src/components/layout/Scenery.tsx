"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { seeded } from "./Sky";

/**
 * The forest along the bottom of the screen: old-growth Douglas firs crowding in
 * at both edges and a river running down the middle toward you over mossy rocks,
 * drawn like the things in the sky (SkyThings). It sticks to the bottom of the
 * screen the whole way down and comes to rest in the footer's sunset, where the
 * river goes over the edge and falls behind the footer's copy (Falls). It's a depth layer of its own (--z-scenery),
 * in front of the back clouds and behind everything else.
 *
 * It holds still while you do. Scrolling stirs it: the trees sway and the river
 * runs, picking up gradually and settling gradually once you stop. The river
 * only ever runs downstream, whichever way you scroll.
 *
 * Everything's drawn from a fixed seed with plain arithmetic, so the server and
 * the browser come up with exactly the same paths.
 */

const ink = {
  stroke: "var(--color-ink-700)",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

const line = { ...ink, fill: "none" } as const;

/** Each colour with the darker shade of it that the side away from the light takes. */
const paint = {
  farGround: "#3a5d4d",
  backFir: ["#5b8a6e", "#4c7a60"],
  backBark: ["#8c6d5a", "#76594a"],
  frontFir: ["#3e6e4c", "#2f5a3d"],
  frontBark: ["#7b4f36", "#5f3b28"],
  bank: "#557f45",
  water: "#3a7086",
  // The sky shows in the middle of the river, the forest along its edges.
  skyInWater: "#4f88a0",
  treesInWater: "#2b5868",
  stone: ["#a19d92", "#827e74"],
  wetStone: ["#77878c", "#5d6d72"],
  moss: "#6d9a45",
  fern: "#4e8a46",
  fernRib: "#2f5a2c",
  foam: "rgba(255,255,255,0.8)",
} as const;

type Point = [number, number];
type Side = "left" | "right";

const pt = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;
const lerp = ([x0, y0]: Point, [x1, y1]: Point, t: number): Point => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];

/** A smooth curve on through the points (Catmull-Rom as cubic Béziers), to follow a move to the first. */
function through(points: Point[]) {
  let d = "";
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[Math.max(i - 1, 0)];
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const [x3, y3] = points[Math.min(i + 2, points.length - 1)];
    d += `C${pt(x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6)} ${pt(x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6)} ${pt(x2, y2)}`;
  }
  return d;
}

/** A soft hump, 1 at `at` and falling away either side. */
function bump(x: number, at: number, width: number) {
  const d = (x - at) / width;
  return 1 / (1 + d * d);
}

/**
 * One tier of a fir: boughs hanging from the trunk at (x, apex) and drooping to
 * tips that curl up at `bottom`, the needles sagging in lobes between them. The
 * shade is the underside of the tier, out of the light.
 */
function bough(x: number, apex: number, bottom: number, left: number, right: number) {
  const depth = bottom - apex;
  const curl = depth * 0.1;
  const sag = depth * 0.17;
  const lobes = Math.max(2, Math.round((left + right) / 15));
  const tips: Point[] = Array.from({ length: lobes + 1 }, (_, i) => [
    x - left + ((left + right) * i) / lobes,
    i === 0 || i === lobes ? bottom - curl : bottom,
  ]);
  const hang = (from: Point, to: Point) => `Q${pt((from[0] + to[0]) / 2, bottom + sag)} ${pt(...to)}`;
  let body = `M${pt(x, apex)}C${pt(x - left * 0.2, apex + depth * 0.45)} ${pt(x - left * 0.8, bottom)} ${pt(...tips[0])}`;
  for (let i = 1; i <= lobes; i++) body += hang(tips[i - 1], tips[i]);
  body += `C${pt(x + right * 0.8, bottom)} ${pt(x + right * 0.2, apex + depth * 0.45)} ${pt(x, apex)}Z`;
  let shade = `M${pt(...tips[0])}Q${pt(x + (right - left) / 2, bottom - depth * 0.5)} ${pt(...tips[lobes])}`;
  for (let i = lobes; i >= 1; i--) shade += hang(tips[i], tips[i - 1]);
  return { body, shade: `${shade}Z` };
}

const FIR_BOX = { width: 100, height: 320 };

/**
 * A Douglas fir standing at the bottom middle of FIR_BOX. Old growth is taller in
 * the trunk, thicker, mossy, and ragged in the crown.
 */
function fir(random: () => number, old: boolean) {
  const x = FIR_BOX.width / 2;
  const top = 4;
  const base = FIR_BOX.height;
  // Old growth has long since shed its lower limbs, so more trunk shows.
  const crownBase = old ? 205 + random() * 30 : 258 + random() * 22;
  const count = Math.round((crownBase - top) / 28);
  const step = (crownBase - top) / count;
  const boughs: ReturnType<typeof bough>[] = [];
  let gap = false;
  for (let i = 0; i < count; i++) {
    // Here and there an old crown is missing a tier, and the trunk shows through.
    if (old && i > 1 && i < count - 1 && !gap && random() < 0.25) {
      gap = true;
      continue;
    }
    const t = (i + 1) / count;
    // Old crowns are more of a column than a cone, and more ragged.
    const spread = old ? 6 + 34 * t * (1.8 - 0.8 * t) : 5 + 39 * t * (1.6 - 0.6 * t);
    const ragged = old ? 0.5 : 0.35;
    const bottom = top + step * (i + 1);
    const apex = i === 0 ? top : bottom - step * (gap ? 1.4 : 1.9);
    boughs.push(
      bough(x, apex, bottom, spread * (1 - ragged / 2 + random() * ragged), spread * (1 - ragged / 2 + random() * ragged)),
    );
    gap = false;
  }

  const foot = old ? 10 : 6;
  const shoulder = base - 20;
  const trunk =
    `M${pt(x - foot * 1.7, base)}Q${pt(x - foot, base - 3)} ${pt(x - foot, shoulder)}` +
    `L${pt(x - 2, top + step)}L${pt(x + 2, top + step)}` +
    `L${pt(x + foot, shoulder)}Q${pt(x + foot, base - 3)} ${pt(x + foot * 1.7, base)}Z`;
  // The light comes from the left, so the right of the trunk is in shade.
  const trunkShade =
    `M${pt(x + 0.5, top + step)}L${pt(x + 2, top + step)}L${pt(x + foot, shoulder)}` +
    `Q${pt(x + foot, base - 3)} ${pt(x + foot * 1.7, base)}L${pt(x + foot * 0.25, base)}Z`;
  if (!old) return { trunk, trunkShade, moss: "", bark: "", boughs: boughs.reverse() };

  // How far out the trunk's left edge is at height y, above the root flare.
  const girth = (y: number) => 2 + ((foot - 2) * (y - top - step)) / (shoulder - top - step);

  // Moss up the shady side, its edge creeping round the trunk in lobes.
  const mossTop = shoulder - 40 - random() * 40;
  let moss = `M${pt(x - foot * 1.7, base)}Q${pt(x - foot, base - 3)} ${pt(x - foot, shoulder)}L${pt(x - girth(mossTop), mossTop)}`;
  for (let i = 1; i <= 4; i++) {
    const y = mossTop + ((base - mossTop) * i) / 4;
    const reach = foot * (0.5 + random() * 0.5);
    moss += `Q${pt(x - girth(y) + reach * 1.6, y - (base - mossTop) / 8)} ${pt(x - girth(Math.min(y, shoulder)) + reach, y)}`;
  }
  moss += "Z";

  // Bark furrows, and a dead limb still hanging on the bare trunk.
  const snag = crownBase + 18 + random() * 40;
  const side = random() < 0.5 ? -1 : 1;
  const bark =
    `M${pt(x - 3, base - 6)}L${pt(x - 2, crownBase)}M${pt(x + 1, base - 14)}L${pt(x + 0.5, crownBase + 10)}` +
    `M${pt(x + 4.5, base - 8)}L${pt(x + 2.5, crownBase + 30)}` +
    `M${pt(x + side * girth(snag), snag)}l${pt(side * 10, 4)}m${pt(side * -5, -2)}l${pt(side * 2, -4)}`;

  // Drawn from the bottom tier up, so each tier hangs over the one below.
  return { trunk, trunkShade, moss, bark, boughs: boughs.reverse() };
}

const FERN_BOX = { width: 120, height: 64 };

/**
 * One fern frond along a curve from its root through `bend` to `tip`, toothed
 * with leaflets that sweep toward the tip and shrink along the way.
 */
function frond(root: Point, bend: Point, tip: Point, width: number) {
  const along = (t: number): Point => {
    const u = 1 - t;
    return [u * u * root[0] + 2 * u * t * bend[0] + t * t * tip[0], u * u * root[1] + 2 * u * t * bend[1] + t * t * tip[1]];
  };
  const across = (t: number, reach: number, side: number): Point => {
    const u = 1 - t;
    const dx = u * (bend[0] - root[0]) + t * (tip[0] - bend[0]);
    const dy = u * (bend[1] - root[1]) + t * (tip[1] - bend[1]);
    // Scaled by |dx| + |dy| rather than the true length: near enough, and exact in any browser.
    const scale = (reach * side) / (Math.abs(dx) + Math.abs(dy));
    const [x, y] = along(t);
    return [x - dy * scale, y + dx * scale];
  };
  const leaflets = 9;
  const edge = (side: number) =>
    Array.from({ length: leaflets }, (_, i) => {
      const reach = width * (1 - (i / leaflets) * 0.7);
      return [across(i / leaflets, reach * 0.3, side), across((i + 0.9) / leaflets, reach, side)];
    }).flat();
  const points = [root, ...edge(1), tip, ...edge(-1).reverse()];
  return `M${points.map((point) => pt(...point)).join("L")}Z`;
}

/** A sword fern: a fan of fronds from one root, the outer ones arching over. */
function fern(random: () => number) {
  const x = FERN_BOX.width / 2;
  const y = FERN_BOX.height - 2;
  const count = 7;
  return Array.from({ length: count }, (_, i) => {
    const lean = (i / (count - 1)) * 2 - 1 + (random() - 0.5) * 0.2;
    const reach = 44 + Math.abs(lean) * 12 + random() * 8;
    const out = lean * reach;
    const up = reach * (1 - Math.abs(lean) * 0.55);
    const tip: Point = [x + out, y - up + Math.abs(lean) * reach * 0.35];
    const bend: Point = [x + out * 0.5, y - up * 1.05];
    return {
      lean,
      leaf: frond([x, y], bend, tip, 7),
      rib: `M${pt(x, y)}Q${pt(...bend)} ${pt(...tip)}`,
    };
  }).sort((a, b) => Math.abs(a.lean) - Math.abs(b.lean));
}

const ROCK_BOX = { width: 100, height: 64 };
/** Where a rock meets the water or the ground in ROCK_BOX; below it is room for foam. */
const WATERLINE = 50;

/**
 * A path around the corners with each one rounded off, from the middle of each
 * side to the next. `from` and `to` pick out a run of corners (wrapping round);
 * the whole outline by default.
 */
function rounded(corners: Point[], from = 0, to = corners.length - 1) {
  const n = corners.length;
  const middle = (i: number) => lerp(corners[(i + n) % n], corners[(i + 1 + n) % n], 0.5);
  let d = `M${pt(...middle(from - 1))}`;
  for (let i = from; i <= to; i++) d += `Q${pt(...corners[i % n])} ${pt(...middle(i))}`;
  return { d, start: middle(from - 1), end: middle(to) };
}

/**
 * A river stone: a lumpy, irregular outline sitting flat on its waterline, shaded
 * underneath and on the right, and maybe capped in moss.
 */
function stone(random: () => number, mossy: boolean) {
  const height = 26 + random() * 22;
  const count = 6 + Math.floor(random() * 3);
  // Over the top from the left foot to the right, a hump knocked out of true.
  const corners: Point[] = [[2 + random() * 8, WATERLINE]];
  for (let i = 1; i < count; i++) {
    const t = i / count;
    corners.push([
      2 + 96 * t + (random() - 0.5) * 12,
      WATERLINE - height * 4 * t * (1 - t) * (0.75 + random() * 0.45),
    ]);
  }
  corners.push([90 + random() * 8, WATERLINE]);
  const n = corners.length;
  const outline = `${rounded(corners).d}Z`;

  // The light comes from the left: the right side and the underside are in shade.
  const turn = Math.ceil(n * 0.55);
  const dark = rounded(corners, turn, n);
  const shade = `${dark.d}Q${pt(50, WATERLINE - height * 0.3)} ${pt(...dark.start)}Z`;
  const [a, b, c] = corners;
  const shine = mossy ? "" : `M${pt(a[0] + 8, a[1] - 8)}Q${pt(b[0] + 5, b[1] + 6)} ${pt((b[0] + c[0]) / 2 + 2, (b[1] + c[1]) / 2 + 6)}`;
  if (!mossy) return { outline, shade, moss: "", shine };

  // Moss over the top, following the stone's own outline, its lower edge hanging in lobes.
  const top = rounded(corners, 2, n - 3);
  let moss = top.d;
  const lobes = 5;
  for (let i = 1; i <= lobes; i++) {
    const [x0, y0] = lerp(top.end, top.start, (i - 1) / lobes);
    const [x1, y1] = lerp(top.end, top.start, i / lobes);
    moss += `Q${pt((x0 + x1) / 2, Math.min((y0 + y1) / 2 + 6 + random() * 5, WATERLINE - 4))} ${pt(x1, y1)}`;
  }
  return { outline, shade, moss: `${moss}Z`, shine };
}

const FOAM = `M${pt(-6, WATERLINE + 1)}Q${pt(50, WATERLINE + 9)} ${pt(106, WATERLINE + 1)}M${pt(18, WATERLINE + 8)}Q${pt(50, WATERLINE + 13)} ${pt(82, WATERLINE + 8)}`;

/**
 * The valley between the trees is stretched to the screen, so the river keeps to
 * the middle of it at any width. x runs 0 to 1000 across the screen and the
 * valley is 20% of the screen's height, 200 units from top to bottom. The far
 * shore's firs sit behind the back row of trees, the near bank and the river in
 * front.
 */
const VALLEY = { width: 1000, height: 200 };
/** The valley's height on screen, in vh. */
const VALLEY_VH = 20;
// The valley floor is nearly flat, and the river comes from far off across it.
const rise = (x: number) => 66 - 6 * bump(x, 500, 300);

/** A point in the valley as a place on screen, for things drawn on their own. */
const valleyAt = (x: number, y: number) => ({ left: `${x / 10}%`, bottom: `${((VALLEY.height - y) / VALLEY.height) * VALLEY_VH}vh` });

const random = seeded(0x0f1c);

/**
 * The far shore: a dark wall of firs along the horizon. Unlike the valley it's
 * drawn at a fixed scale and cropped to the screen from the middle out, so the
 * trees keep their shape at any width; its height lines up with the valley's.
 */
const HORIZON = { width: 2000, height: VALLEY.height };
const farShore = (x: number) => 68 - 7 * bump(x, 700, 400) - 5 * bump(x, 1400, 450);

/** A far-off fir: a ragged spire, its tiers jutting out unevenly. */
function spire(x: number, base: number, height: number, width: number) {
  const top = base - height;
  const side = (dir: number): Point[] => [
    [x + dir * width * (0.35 + random() * 0.2), top + height * (0.26 + random() * 0.08)],
    [x + dir * width * 0.15, top + height * 0.3],
    [x + dir * width * (0.6 + random() * 0.3), top + height * (0.56 + random() * 0.1)],
    [x + dir * width * 0.3, top + height * 0.62],
    [x + dir * width * (0.85 + random() * 0.3), top + height * 0.92],
    [x + dir * width * 0.22, base],
  ];
  const points: Point[] = [[x, top], ...side(-1), ...side(1).reverse()];
  return `M${points.map((point) => pt(...point)).join("L")}Z`;
}

/** Two rows of them, the back one taller and hazier. Trees of a colour share a path. */
const FAR_FIRS = [
  { colors: ["#5a8273", "#4f786a", "#628a79", "#557d6c"], shortest: 22, tallest: 42, gap: 14, line: 0.3 },
  { colors: ["#3d6150", "#456a57", "#355a49", "#4b7059", "#40664f"], shortest: 12, tallest: 30, gap: 11, line: 0.45 },
].map((row) => {
  const paths = row.colors.map(() => "");
  for (let x = -10; x < HORIZON.width + 10; x += row.gap * (0.5 + random())) {
    const height = row.shortest + random() * (row.tallest - row.shortest);
    paths[Math.floor(random() * paths.length)] += spire(x, farShore(x) + 6, height, height * (0.2 + random() * 0.12));
  }
  return { line: row.line, trees: paths.map((d, i) => ({ d, fill: row.colors[i] })) };
});

const farPoints = Array.from({ length: 22 }, (_, i): Point => [i * 100 - 50, farShore(i * 100 - 50)]);
const FAR_GROUND = `M${pt(...farPoints[0])}${through(farPoints)}L${pt(HORIZON.width + 50, HORIZON.height + 10)}L${pt(-50, HORIZON.height + 10)}Z`;

// Wide even in the distance, and opening out to nearly the whole width of the
// screen as it reaches you, the banks running almost with the screen's sides.
const LEFT_BANK: Point[] = [[230, rise(230)], [205, 90], [190, 120], [140, 150], [62, 200], [40, 216]];
const RIGHT_BANK: Point[] = [[772, rise(772)], [800, 90], [822, 120], [870, 150], [942, 200], [962, 216]];

/** The near bank's skyline either side of the river, which comes out from among the stones between. */
function shoreline(from: number, to: number) {
  const points: Point[] = [];
  for (let x = from; x < to; x += 25) points.push([x, rise(x)]);
  points.push([to, rise(to)]);
  return `M${pt(...points[0])}${through(points)}`;
}
const BANK_EDGES = [shoreline(-25, LEFT_BANK[0][0]), shoreline(RIGHT_BANK[0][0], VALLEY.width + 25)];
const BANK = `${shoreline(-25, VALLEY.width + 25)}L${pt(VALLEY.width + 25, VALLEY.height + 10)}L${pt(-25, VALLEY.height + 10)}Z`;
const RIVER_BANKS = [LEFT_BANK, RIGHT_BANK].map((bank) => `M${pt(...bank[0])}${through(bank)}`);
/** A line down the river, `across` it from the left bank. */
const downstream = (across: number) => LEFT_BANK.map((point, i) => lerp(point, RIGHT_BANK[i], across));
const water = (left: Point[], right: Point[]) =>
  `M${pt(...left[0])}${through(left)}L${pt(...right[right.length - 1])}${through([...right].reverse())}Z`;

const RIVER = water(LEFT_BANK, RIGHT_BANK);
const SKY_IN_WATER = water(downstream(0.3), downstream(0.66));
const TREES_IN_WATER = [water(downstream(0), downstream(0.1)), water(downstream(0.9), downstream(1))];

/** Current lines down the river. Speed is per pixel scrolled. */
const RIPPLES = [
  { across: 0.14, dash: "2 21", speed: 0.08 },
  { across: 0.29, dash: "4 26", speed: 0.1 },
  { across: 0.43, dash: "5 23", speed: 0.13 },
  { across: 0.57, dash: "3 27", speed: 0.12 },
  { across: 0.71, dash: "4 24", speed: 0.11 },
  { across: 0.86, dash: "2 19", speed: 0.08 },
].map((ripple) => {
  const points = downstream(ripple.across);
  return { ...ripple, d: `M${pt(...points[0])}${through(points)}` };
});

/**
 * Stones where they meet the water or the bank, and their width in vh (or `cap`
 * vw, on a narrow screen). Further off is further up the valley and smaller.
 */
const ROCKS = [
  // A line of them along the horizon, which the river comes out from between.
  ...[236, 259, 288, 326, 361, 398, 441, 480, 517, 559, 598, 637, 678, 713, 745, 767].map((x) => ({
    x,
    y: rise(x) + 1 + random() * 3,
    size: 0.9 + random() * 1.4,
    wet: random() < 0.5,
    mossy: random() < 0.4,
  })),
  // In the current, with foam where it breaks on them.
  { x: 330, y: 185, size: 4.5, wet: true, mossy: false },
  { x: 610, y: 195, size: 3.8, wet: true, mossy: false },
  { x: 740, y: 170, size: 3.4, wet: true, mossy: false },
  { x: 470, y: 150, size: 2.8, wet: true, mossy: false },
  { x: 560, y: 125, size: 2.2, wet: true, mossy: false },
  { x: 380, y: 108, size: 1.8, wet: true, mossy: false },
  { x: 650, y: 95, size: 1.6, wet: true, mossy: false },
  // Big, mossy boulders crowding both banks, half in the water.
  { x: 214, y: 84, size: 3.2, wet: false, mossy: true },
  { x: 790, y: 82, size: 3, wet: false, mossy: true },
  { x: 196, y: 108, size: 4.5, wet: false, mossy: false },
  { x: 812, y: 104, size: 4.2, wet: false, mossy: true },
  { x: 176, y: 134, size: 6, wet: false, mossy: true },
  { x: 846, y: 132, size: 5.5, wet: false, mossy: false },
  { x: 132, y: 162, size: 8.5, wet: false, mossy: true },
  { x: 880, y: 164, size: 8, wet: false, mossy: true },
  { x: 250, y: 168, size: 4, wet: true, mossy: false },
  { x: 92, y: 202, size: 12, wet: false, mossy: true },
  { x: 918, y: 204, size: 13, wet: false, mossy: true },
  { x: 205, y: 198, size: 6, wet: true, mossy: false },
].map((rock) => {
  const width = `min(${rock.size}vh, ${rock.size * 2}vw)`;
  const { left, bottom } = valleyAt(rock.x, rock.y);
  const drop = (ROCK_BOX.height - WATERLINE) / ROCK_BOX.width;
  return {
    ...rock,
    ...stone(random, rock.mossy),
    // Small, far-off rocks get a lighter line, like everything else in the distance.
    fine: rock.size < 3,
    style: { left, bottom: `calc(${bottom} - ${width} * ${drop})`, width, aspectRatio: `${ROCK_BOX.width} / ${ROCK_BOX.height}` },
  };
});

/**
 * The firs on each side, in from the edge by `offset` times their own width so
 * they keep tight to it at any size. Height and bottom are % of the screen's
 * height; the front row's feet are off the bottom of the screen, which puts them
 * nearer to you. On a narrow screen they're squeezed to `cap` % of its width.
 */
const STANDS = [
  { offset: -0.15, height: 42, bottom: 4, cap: 18, back: true },
  { offset: 0.8, height: 36, bottom: 5, cap: 15, back: true },
  { offset: 0.35, height: 54, bottom: -9, cap: 22, back: false },
  { offset: -0.4, height: 58, bottom: -10, cap: 25, back: false },
  // The nearest, a giant right at the edge with most of it out of the frame.
  { offset: -0.72, height: 72, bottom: -24, cap: 30, back: false },
];

const SIDES: Side[] = ["left", "right"];
const fromEdge = (side: Side, at: string) => (side === "left" ? { left: at } : { right: at });

const FIRS = SIDES.flatMap((side) =>
  STANDS.map((stand) => {
    // The right side isn't a mirror of the left.
    const height = stand.height * (0.96 + random() * 0.06);
    const width = `min(${((height * FIR_BOX.width) / FIR_BOX.height).toFixed(2)}vh, ${stand.cap}vw)`;
    return {
      back: stand.back,
      ...fir(random, !stand.back),
      style: { ...fromEdge(side, `calc(${width} * ${stand.offset})`), bottom: `${stand.bottom}vh`, height: `${height.toFixed(2)}vh`, width },
      // Degrees of lean at most, and milliseconds per radian of sway. Further off,
      // they seem to move less.
      sway: stand.back ? 0.8 : 1.4,
      period: 420 + random() * 80,
      phase: random() * Math.PI * 2,
    };
  }),
);

const fernBox = (size: number, cap: number) => ({
  width: `min(${size}vh, ${cap}vw)`,
  aspectRatio: `${FERN_BOX.width} / ${FERN_BOX.height}`,
});

const FERNS = [
  // At the front trees' feet, x in % in from the edge.
  ...SIDES.flatMap((side) =>
    [
      { x: -2, size: 14, cap: 26 },
      { x: 8, size: 10, cap: 18 },
    ].map(({ x, size, cap }) => ({ centered: false, style: { ...fromEdge(side, `${x}%`), bottom: "-0.5vh", ...fernBox(size, cap) } })),
  ),
  // Along the banks, in the valley.
  ...[
    { x: 168, y: 98, size: 4, cap: 8 },
    { x: 838, y: 96, size: 4, cap: 8 },
    { x: 212, y: 70, size: 2.5, cap: 5 },
    { x: 792, y: 69, size: 2.5, cap: 5 },
  ].map(({ x, y, size, cap }) => ({ centered: true, style: { ...valleyAt(x, y), ...fernBox(size, cap) } })),
].map((spot) => ({ ...spot, fronds: fern(random), sway: 3, period: 260 + random() * 60, phase: random() * Math.PI * 2 }));

/** Everything that sways, in the order of their data-sway indexes. */
const PLANTS = [...FIRS, ...FERNS];

function FirShape({ index }: { index: number }) {
  const tree = FIRS[index];
  const needles = tree.back ? paint.backFir : paint.frontFir;
  const bark = tree.back ? paint.backBark : paint.frontBark;
  return (
    <div data-sway={index} className="absolute origin-bottom" style={tree.style}>
      <svg
        viewBox={`0 0 ${FIR_BOX.width} ${FIR_BOX.height}`}
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        strokeOpacity={tree.back ? 0.5 : 1}
      >
        <path d={tree.trunk} fill={bark[0]} />
        <path d={tree.trunkShade} fill={bark[1]} />
        <path d={tree.trunk} {...line} />
        {tree.moss && <path d={tree.moss} fill={paint.moss} {...ink} strokeOpacity={0.6} />}
        {tree.bark && <path d={tree.bark} {...line} strokeWidth={1.2} />}
        {tree.boughs.map(({ body, shade }, i) => (
          <g key={i}>
            <path d={body} fill={needles[0]} />
            <path d={shade} fill={needles[1]} />
            <path d={body} {...line} />
          </g>
        ))}
      </svg>
    </div>
  );
}

function FernShape({ index }: { index: number }) {
  const fern = FERNS[index];
  return (
    <div
      data-sway={FIRS.length + index}
      className={`absolute origin-bottom ${fern.centered ? "-translate-x-1/2" : ""}`}
      style={fern.style}
    >
      {/* Lighter in the line than the rest: all those teeth along the bottom of the
          screen would otherwise blur into a dark band behind the copy. */}
      <svg viewBox={`0 0 ${FERN_BOX.width} ${FERN_BOX.height}`} className="h-full w-full overflow-visible">
        {fern.fronds.map((frond, i) => (
          <g key={i}>
            <path d={frond.leaf} fill={paint.fern} {...ink} strokeOpacity={0.4} />
            <path d={frond.rib} {...line} stroke={paint.fernRib} strokeWidth={1.2} />
          </g>
        ))}
      </svg>
    </div>
  );
}

function RockShape({ rock }: { rock: (typeof ROCKS)[number] }) {
  const stone = rock.wet ? paint.wetStone : paint.stone;
  return (
    <div className="absolute -translate-x-1/2" style={rock.style as CSSProperties}>
      <svg
        viewBox={`0 0 ${ROCK_BOX.width} ${ROCK_BOX.height}`}
        className="h-full w-full overflow-visible"
        strokeOpacity={rock.fine ? 0.6 : 1}
      >
        {rock.wet && <path d={FOAM} {...line} stroke={paint.foam} />}
        <path d={rock.outline} fill={stone[0]} />
        <path d={rock.shade} fill={stone[1]} />
        <path d={rock.outline} {...line} strokeWidth={rock.fine ? 1.2 : 1.6} />
        {rock.moss && <path d={rock.moss} fill={paint.moss} {...ink} strokeWidth={rock.fine ? 1.2 : 1.6} />}
        {rock.shine && <path d={rock.shine} {...line} stroke="rgba(255,255,255,0.75)" />}
      </svg>
    </div>
  );
}

const valleyBox = "absolute inset-x-0 bottom-0 h-[20vh] w-full";

/**
 * The falls, stretched across the screen like the valley and down the footer,
 * 300 units deep: the whole mouth of the river going over the edge in one
 * curtain that spreads as it falls and darkens into the night.
 */
const FALLS = { width: VALLEY.width, height: 300 };
const MOUTH = [LEFT_BANK[4][0], RIGHT_BANK[4][0]];
const DROPS = [0, 30, 90, 170, 240, 300];
// The edges spread out from the middle as it falls, wavering as they go.
const fallingEdge = (x: number, dir: number) =>
  DROPS.map((y, i): Point => [x - dir * (y * 0.1 + (i ? random() * 6 : 0)), y]);
const FALL_LEFT = fallingEdge(MOUTH[0], 1);
const FALL_RIGHT = fallingEdge(MOUTH[1], -1);
/** A line down the falls, `across` it from the left edge. */
const falling = (across: number) => FALL_LEFT.map((point, i) => lerp(point, FALL_RIGHT[i], across));
const CURTAIN = water(FALL_LEFT, FALL_RIGHT);

/** Streams of different widths within the curtain, some catching the light and some in shadow. */
const STREAMS: { d: string; light: boolean }[] = [];
for (let across = 0.01 + random() * 0.03; across < 0.94; ) {
  const width = 0.025 + random() * 0.07;
  STREAMS.push({ d: water(falling(across), falling(Math.min(across + width, 0.99))), light: random() < 0.5 });
  across += width + 0.015 + random() * 0.06;
}

const STREAKS = Array.from({ length: 26 }, (_, i) => {
  const points = falling((i + 0.25 + random() * 0.5) / 26);
  points[0] = [points[0][0], 8 + random() * 14];
  return {
    d: `M${pt(...points[0])}${through(points)}`,
    dash: `${Math.round(36 + random() * 50)} ${Math.round(14 + random() * 26)}`,
    speed: 0.3 + random() * 0.18,
  };
});

/** Where the river bends over the edge and catches the light, with foam along the lip. */
function brink(depth: number, wave: number) {
  let d = `M${pt(MOUTH[0] - 1, -2)}L${pt(MOUTH[1] + 1, -2)}L${pt(MOUTH[1] - 0.1 * depth, depth)}`;
  for (let x = MOUTH[1] - 0.1 * depth; x > MOUTH[0] + 0.1 * depth; ) {
    const next = Math.max(MOUTH[0] + 0.1 * depth, x - 10 - random() * 14);
    d += `Q${pt((x + next) / 2, depth + wave * (0.5 + random()))} ${pt(next, depth)}`;
    x = next;
  }
  return `${d}Z`;
}
const BRINK = brink(14, 6);
const FOAM_LIP = brink(4, 5);

/** Stones breaking the lip, the water parting round them, and the ledge either side. */
const LIP_ROCKS = [
  ...[0.16, 0.41, 0.69, 0.87].map((across) => {
    const at = MOUTH[0] + (MOUTH[1] - MOUTH[0]) * across;
    const w = 7 + random() * 6;
    const depth = 7 + random() * 6;
    return rounded([
      [at - w, -4],
      [at - w - 2, depth * 0.6],
      [at - w * 0.3, depth],
      [at + w * 0.5, depth * 0.85],
      [at + w + 2, depth * 0.4],
      [at + w, -4],
    ]).d + "Z";
  }),
  rounded([[-10, -4], [MOUTH[0] + 10, -4], [MOUTH[0] + 4, 12], [MOUTH[0] - 22, 18], [MOUTH[0] - 44, 11], [-10, 20]]).d + "Z",
  rounded([[MOUTH[1] - 10, -4], [FALLS.width + 10, -4], [FALLS.width + 10, 19], [MOUTH[1] + 40, 12], [MOUTH[1] + 20, 18], [MOUTH[1] - 4, 11]]).d + "Z",
];

/** The cliff either side of the falls, dropping away into the dark, and a few cracks in it. */
const CLIFFS = [
  `M${pt(-10, 0)}L${pt(MOUTH[0] + 12, 0)}L${pt(MOUTH[0] - 6, 160)}L${pt(-10, 160)}Z`,
  `M${pt(MOUTH[1] - 12, 0)}L${pt(FALLS.width + 10, 0)}L${pt(FALLS.width + 10, 160)}L${pt(MOUTH[1] + 6, 160)}Z`,
];
const CRACKS = [
  `M${pt(MOUTH[0] - 18, 20)}l${pt(5, 16)}l${pt(-4, 14)}M${pt(MOUTH[0] - 40, 26)}l${pt(-3, 12)}`,
  `M${pt(MOUTH[1] + 20, 22)}l${pt(-4, 15)}l${pt(5, 12)}M${pt(MOUTH[1] + 42, 24)}l${pt(3, 13)}`,
];

/**
 * The falls: where the river goes over the edge at the end of the page and pours
 * down behind the footer's copy, darkening into the night as it goes, so the
 * footer's sky still shows round it and through it. The footer draws it, lined up
 * with the river's mouth at the bottom of the scenery. It's on the media layer,
 * like a photo, so the clouds and things in the sky pass behind the water rather
 * than between it and the copy. Its streaks run with the river (data-flow).
 */
export function Falls() {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${FALLS.width} ${FALLS.height}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 top-[var(--footer-dusk)] z-[var(--z-media)] h-[calc(100%-var(--footer-dusk))] w-full overflow-visible"
    >
      <defs>
        <linearGradient id="falls-water" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={FALLS.height}>
          {/* Lit where it comes over the edge, and quickly into the dark, so the
              footer's copy reads against it. */}
          <stop offset="0" stopColor="#5a93a8" />
          <stop offset="0.03" stopColor="#3f7590" stopOpacity="0.95" />
          <stop offset="0.12" stopColor="#2c506f" stopOpacity="0.92" />
          <stop offset="0.5" stopColor="#263d60" stopOpacity="0.8" />
          <stop offset="1" stopColor="#22325a" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="falls-streak" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={FALLS.height}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.12" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="falls-cliff" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="160">
          <stop offset="0" stopColor="#3e4552" stopOpacity="0.95" />
          <stop offset="1" stopColor="#3e4552" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="falls-mist">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {CLIFFS.map((d, i) => (
        <path key={i} d={d} fill="url(#falls-cliff)" />
      ))}
      {CRACKS.map((d, i) => (
        <path key={i} d={d} {...line} strokeOpacity={0.35} />
      ))}
      <path d={CURTAIN} fill="url(#falls-water)" />
      {STREAMS.map(({ d, light }, i) => (
        <path key={i} d={d} fill={light ? "#fff" : "#16243f"} fillOpacity={light ? 0.07 : 0.22} />
      ))}
      {STREAKS.map((streak, i) => (
        <path key={i} data-flow={streak.speed} d={streak.d} {...line} stroke="url(#falls-streak)" strokeDasharray={streak.dash} />
      ))}
      <path d={BRINK} fill="#6aa3b8" />
      <path d={FOAM_LIP} fill={paint.foam} />
      {LIP_ROCKS.map((d, i) => (
        <path key={i} d={d} fill={paint.wetStone[1]} {...ink} />
      ))}
      {[180, 500, 820].map((x) => (
        <ellipse key={x} cx={x} cy={FALLS.height - 20} rx={200} ry={50} fill="url(#falls-mist)" />
      ))}
    </svg>
  );
}

export function Scenery() {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const swaying = Array.from(scene.current?.querySelectorAll<HTMLElement>("[data-sway]") ?? []);
    // Running water here and in the falls in the footer, each line at its own speed.
    const flowing = Array.from(document.querySelectorAll<SVGPathElement>("[data-flow]"));
    let frame = 0;
    let then = 0;
    let last = window.scrollY;
    // How hard the scrolling's blowing, in pixels a millisecond, smoothed.
    let wind = 0;
    let flowed = 0;
    const stir = (now: number) => {
      const elapsed = then ? Math.min(now - then, 64) : 16;
      then = now;
      const y = window.scrollY;
      const speed = Math.min(Math.abs(y - last) / elapsed, 4);
      last = y;
      // Pick up over a few tenths of a second and die away over most of one, so
      // nothing starts or stops dead.
      wind += (speed - wind) * (1 - Math.exp(-elapsed / (speed > wind ? 300 : 700)));
      flowed += wind * elapsed;
      const gust = Math.min(1, wind / 1.5);
      swaying.forEach((element) => {
        const plant = PLANTS[Number(element.dataset.sway)];
        const lean = Math.sin(now / plant.period + plant.phase) * plant.sway * gust;
        element.style.transform = `skewX(${lean.toFixed(2)}deg)`;
      });
      flowing.forEach((element) => {
        element.style.strokeDashoffset = `${(-flowed * Number(element.dataset.flow)).toFixed(1)}`;
      });
      if (speed > 0 || wind > 0.003) {
        frame = requestAnimationFrame(stir);
      } else {
        frame = 0;
        then = 0;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(stir);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const firs = (back: boolean) => FIRS.flatMap((tree, i) => (tree.back === back ? [<FirShape key={i} index={i} />] : []));

  return (
    // Holds the scenery's place at the end of the page: the footer is pulled up over
    // it, so the river comes to the edge just above the footer's copy, where the
    // falls take over.
    <div aria-hidden="true" className="pointer-events-none sticky bottom-0 z-[var(--z-scenery)] h-[var(--footer-dusk)]">
      <div ref={scene} className="absolute inset-x-0 bottom-0 h-[50vh] overflow-hidden">
        <svg viewBox={`0 0 ${HORIZON.width} ${HORIZON.height}`} preserveAspectRatio="xMidYMax slice" className={valleyBox}>
          <path d={FAR_GROUND} fill={paint.farGround} />
          {FAR_FIRS.map((row) =>
            row.trees.map(({ d, fill }) => (
              <path key={fill} d={d} fill={fill} {...ink} strokeWidth={1} strokeOpacity={row.line} />
            )),
          )}
        </svg>
        {firs(true)}
        <svg viewBox={`0 0 ${VALLEY.width} ${VALLEY.height}`} preserveAspectRatio="none" className={valleyBox}>
          <path d={BANK} fill={paint.bank} />
          <path d={RIVER} fill={paint.water} />
          <path d={SKY_IN_WATER} fill={paint.skyInWater} />
          {TREES_IN_WATER.map((d, i) => (
            <path key={i} d={d} fill={paint.treesInWater} />
          ))}
          {RIPPLES.map((ripple, i) => (
            <path key={i} data-flow={ripple.speed} d={ripple.d} {...line} stroke={paint.foam} strokeDasharray={ripple.dash} />
          ))}
          {[...RIVER_BANKS, ...BANK_EDGES].map((d, i) => (
            <path key={i} d={d} {...line} />
          ))}
        </svg>
        {ROCKS.map((rock, i) => (
          <RockShape key={i} rock={rock} />
        ))}
        {FERNS.map((fern, i) => (fern.centered ? <FernShape key={i} index={i} /> : null))}
        {firs(false)}
        {FERNS.map((fern, i) => (fern.centered ? null : <FernShape key={i} index={i} />))}
      </div>
    </div>
  );
}
