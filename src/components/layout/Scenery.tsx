"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { seeded } from "./Sky";

/**
 * The forest along the bottom of the screen: old-growth Douglas firs crowding in
 * at both edges and a river running down the middle toward you over mossy rocks,
 * drawn like the things in the sky (SkyThings). It sticks to the bottom of the
 * screen the whole way down and comes to rest in the footer's sunset, where the
 * river goes over the edge and falls behind the footer's copy (Falls). It's a
 * depth layer of its own (--z-scenery), in front of the back clouds and behind
 * everything else.
 *
 * It's alive on its own, whatever you're doing: the trees sway in a slow breeze,
 * easing at each end of the swing, and the river and the falls run, all as CSS
 * animations (.scenery-sway and .scenery-flow in globals.css) rather than with
 * the scroll; only the things in the sky answer to that. With reduced motion it
 * all holds still.
 *
 * Everything's drawn from a fixed seed with plain arithmetic, so the server and
 * the browser come up with exactly the same paths.
 */

/** A swing for .scenery-sway: degrees either way, seconds each way, and where in it to start. */
const swaying = (degrees: number, seconds: number, start: number) =>
  ({
    "--sway": `${degrees}deg`,
    "--sway-time": `${seconds.toFixed(2)}s`,
    "--sway-delay": `${(-start * seconds * 2).toFixed(2)}s`,
  }) as CSSProperties;

/**
 * A run for .scenery-flow: the dashes move one whole pattern along and start
 * again, seamlessly, at `speed` units a millisecond.
 */
const flowing = (dash: string, speed: number) => {
  const pattern = dash.split(" ").reduce((sum, length) => sum + Number(length), 0);
  return { "--flow-to": -pattern, "--flow-time": `${(pattern / speed / 1000).toFixed(2)}s` } as CSSProperties;
};

// The fixed ink, not --color-ink-700: the footer turns that to cream for its
// night copy, and the falls there are drawn in the same dark line as the rest.
const ink = {
  stroke: "var(--color-ink-fixed)",
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

/**
 * A point in the river, as a place on screen for things drawn on their own. The
 * river has its own box, inset from each side by --forest-foot, so its mouth runs
 * from the forest's feet on one side to the other's at any width, and the falls
 * below match it exactly. x runs 0 to 1000 across that box.
 */
const riverAt = (x: number, y: number) => ({
  left: `calc(var(--forest-foot) + (100% - 2 * var(--forest-foot)) * ${x / 1000})`,
  bottom: `${((VALLEY.height - y) / VALLEY.height) * VALLEY_VH}vh`,
});

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

// In the river's own box: wide even in the distance, and opening out to the whole
// of it as it reaches you, the banks running almost with its sides. Its far end
// starts a touch above the horizon, over the bank's skyline, so the river comes
// out from among the stones there rather than from behind a line.
const LEFT_BANK: Point[] = [[191, rise(191) - 2], [163, 90], [145, 120], [89, 150], [0, 200], [-25, 216]];
const RIGHT_BANK: Point[] = [[807, rise(807) - 2], [839, 90], [864, 120], [918, 150], [1000, 200], [1025, 216]];

/** The near bank's skyline, across the whole screen. */
const bankPoints: Point[] = [];
for (let x = -25; x <= VALLEY.width + 25; x += 25) bankPoints.push([x, rise(x)]);
const BANK_EDGE = `M${pt(...bankPoints[0])}${through(bankPoints)}`;
const BANK = `${BANK_EDGE}L${pt(VALLEY.width + 25, VALLEY.height + 10)}L${pt(-25, VALLEY.height + 10)}Z`;
const RIVER_BANKS = [LEFT_BANK, RIGHT_BANK].map((bank) => `M${pt(...bank[0])}${through(bank)}`);
/** A line down the river, `across` it from the left bank. */
const downstream = (across: number) => LEFT_BANK.map((point, i) => lerp(point, RIGHT_BANK[i], across));
const water = (left: Point[], right: Point[]) =>
  `M${pt(...left[0])}${through(left)}L${pt(...right[right.length - 1])}${through([...right].reverse())}Z`;

const RIVER = water(LEFT_BANK, RIGHT_BANK);
const SKY_IN_WATER = water(downstream(0.3), downstream(0.66));
const TREES_IN_WATER = [water(downstream(0), downstream(0.1)), water(downstream(0.9), downstream(1))];

/** Current lines down the river. Speed is in units a millisecond, quickest mid-stream. */
const RIPPLES = [
  { across: 0.14, dash: "2 21", speed: 0.008 },
  { across: 0.29, dash: "4 26", speed: 0.011 },
  { across: 0.43, dash: "5 23", speed: 0.014 },
  { across: 0.57, dash: "3 27", speed: 0.013 },
  { across: 0.71, dash: "4 24", speed: 0.011 },
  { across: 0.86, dash: "2 19", speed: 0.008 },
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
  ...[198, 224, 257, 300, 340, 382, 431, 475, 517, 565, 609, 653, 700, 740, 776, 801].map((x) => ({
    x,
    y: rise(x) + 1 + random() * 3,
    size: 0.9 + random() * 1.4,
    wet: random() < 0.5,
    mossy: random() < 0.4,
  })),
  // In the current, with foam where it breaks on them.
  { x: 305, y: 185, size: 4.5, wet: true, mossy: false },
  { x: 623, y: 195, size: 3.8, wet: true, mossy: false },
  { x: 770, y: 170, size: 3.4, wet: true, mossy: false },
  { x: 464, y: 150, size: 2.8, wet: true, mossy: false },
  { x: 566, y: 125, size: 2.2, wet: true, mossy: false },
  { x: 361, y: 108, size: 1.8, wet: true, mossy: false },
  { x: 668, y: 95, size: 1.6, wet: true, mossy: false },
  // Big, mossy boulders crowding both banks, half in the water.
  { x: 173, y: 84, size: 3.2, wet: false, mossy: true },
  { x: 827, y: 82, size: 3, wet: false, mossy: true },
  { x: 152, y: 108, size: 4.5, wet: false, mossy: false },
  { x: 852, y: 104, size: 4.2, wet: false, mossy: true },
  { x: 130, y: 134, size: 6, wet: false, mossy: true },
  { x: 891, y: 132, size: 5.5, wet: false, mossy: false },
  { x: 80, y: 162, size: 8.5, wet: false, mossy: true },
  { x: 930, y: 164, size: 8, wet: false, mossy: true },
  { x: 214, y: 168, size: 4, wet: true, mossy: false },
  { x: 34, y: 202, size: 12, wet: false, mossy: true },
  { x: 973, y: 204, size: 13, wet: false, mossy: true },
  { x: 163, y: 198, size: 6, wet: true, mossy: false },
  // Breaking the lip of the falls.
  { x: 410, y: 201, size: 3, wet: true, mossy: false },
  { x: 815, y: 202, size: 3.4, wet: true, mossy: false },
].map((rock) => {
  const width = `min(${rock.size}vh, ${rock.size * 2}vw)`;
  const { left, bottom } = riverAt(rock.x, rock.y);
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
 * nearer to you. On a narrow screen they're held to `cap` % of its width.
 */
const STANDS = [
  { offset: -0.15, height: 42, bottom: 4, cap: 18, back: true },
  { offset: 0.8, height: 36, bottom: 5, cap: 15, back: true },
  // Standing at the river's edge, wherever that falls (--forest-foot).
  { offset: -0.6, height: 54, bottom: -9, cap: 22, back: false, atRiver: true },
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
    // On a narrow screen a tree gets narrower, and shorter too beyond a point,
    // so it's never squeezed thinner than about four fifths of its shape.
    const tall = `min(${height.toFixed(2)}vh, ${((stand.cap * FIR_BOX.height) / FIR_BOX.width / 0.8).toFixed(2)}vw)`;
    return {
      back: stand.back,
      ...fir(random, !stand.back),
      style: {
        ...fromEdge(side, `calc(${"atRiver" in stand ? "var(--forest-foot) + " : ""}${width} * ${stand.offset})`),
        bottom: `${stand.bottom}vh`, height: tall, width },
      // Further off, they seem to move less.
      sway: swaying(stand.back ? 0.3 : 0.55, 4.4 + random() * 1.25, random()),
    };
  }),
);

const fernBox = (size: number, cap: number) => ({
  width: `min(${size}vh, ${cap}vw)`,
  aspectRatio: `${FERN_BOX.width} / ${FERN_BOX.height}`,
});

const FERNS = [
  // At the front trees' feet: one hard by the edge of the screen, one hanging over
  // the river's edge.
  ...SIDES.flatMap((side) =>
    [
      { at: "-2%", size: 10, cap: 18 },
      { at: "calc(var(--forest-foot) - min(14vh, 26vw) * 0.7)", size: 14, cap: 26 },
    ].map(({ at, size, cap }) => ({ centered: false, style: { ...fromEdge(side, at), bottom: "-0.5vh", ...fernBox(size, cap) } })),
  ),
  // Along the banks, in the valley.
  ...[
    { x: 120, y: 98, size: 4, cap: 8 },
    { x: 882, y: 96, size: 4, cap: 8 },
    { x: 170, y: 70, size: 2.5, cap: 5 },
    { x: 830, y: 69, size: 2.5, cap: 5 },
  ].map(({ x, y, size, cap }) => ({ centered: true, style: { ...riverAt(x, y), ...fernBox(size, cap) } })),
].map((spot) => ({ ...spot, fronds: fern(random), sway: swaying(1.2, 2.8 + random() * 0.8, random()) }));

function FirShape({ index }: { index: number }) {
  const tree = FIRS[index];
  const needles = tree.back ? paint.backFir : paint.frontFir;
  const bark = tree.back ? paint.backBark : paint.frontBark;
  return (
    <div className="scenery-sway absolute origin-bottom" style={{ ...tree.style, ...tree.sway }}>
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
      className={`scenery-sway absolute origin-bottom ${fern.centered ? "-translate-x-1/2" : ""}`}
      style={{ ...fern.style, ...fern.sway }}
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
const riverBox = "absolute bottom-0 left-[var(--forest-foot)] h-[20vh] w-[calc(100%-2*var(--forest-foot))] overflow-visible";

/**
 * The falls, in the same box as the river (so exactly as wide as its mouth) and
 * stretched down the footer, 300 units deep: the whole river going over the edge
 * in one curtain that darkens into the night. The cliff faces either side
 * (CliffFace) run out to the edges of the screen.
 */
const FALLS = { width: VALLEY.width, height: 300 };
const MOUTH = [LEFT_BANK[4][0], RIGHT_BANK[4][0]];
const DROPS = [0, 30, 90, 170, 240, 300];
// The edges fall straight, wavering a little as they go.
const fallingEdge = (x: number, dir: number) =>
  DROPS.map((y, i): Point => [x + dir * (i ? random() * 8 - 2 : 0), y]);
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
    speed: 0.05 + random() * 0.03,
  };
});

/**
 * A band along the lip from `top` down to a lower edge that hangs in lobes of the
 * given widths and depths, its top corners rounded off by `round` (across, down;
 * across is wider since the falls are stretched sideways).
 */
function lip(top: number, lobeWidth: [number, number], lobeDepth: [number, number], depth: number, round: [number, number] = [0, 0]) {
  const [rx, ry] = round;
  let d =
    `M${pt(MOUTH[0], top + ry)}Q${pt(MOUTH[0], top)} ${pt(MOUTH[0] + rx, top)}` +
    `L${pt(MOUTH[1] - rx, top)}Q${pt(MOUTH[1], top)} ${pt(MOUTH[1], top + ry)}L${pt(MOUTH[1], depth)}`;
  for (let x = MOUTH[1]; x > MOUTH[0]; ) {
    const next = Math.max(MOUTH[0], x - lobeWidth[0] - random() * (lobeWidth[1] - lobeWidth[0]));
    d += `Q${pt((x + next) / 2, depth + lobeDepth[0] + random() * (lobeDepth[1] - lobeDepth[0]))} ${pt(next, depth)}`;
    x = next;
  }
  return `${d}Z`;
}

// Where the river bends over the edge it catches the light, in long, slow swells.
const BRINK = lip(-2, [130, 230], [2, 4], 16, [20, 6]);
/**
 * Whitewater along the lip: no outline, just foam that thickens as the river
 * reaches the edge and thins out below it (the gradient does both), its lower
 * edge rising and falling in long, low swells. The swells are wide because the
 * falls are stretched across the screen, and narrow ones bead up on a phone.
 */
const WHITEWATER = lip(-26, [140, 260], [3, 6], 13, [36, 18]);
/** Veils of foam pulled down off the lip into the curtain, fading as they go. */
const FOAM_TRAILS = Array.from({ length: 12 }, () => {
  const x = MOUTH[0] + 20 + random() * (MOUTH[1] - MOUTH[0] - 40);
  const width = 14 + random() * 18;
  const length = 22 + random() * 22;
  // A soft, rounded tongue rather than a point.
  return `M${pt(x - width / 2, 6)}C${pt(x - width / 2, length)} ${pt(x + width / 2, length)} ${pt(x + width / 2, 6)}Z`;
});

/**
 * The cliff either side of the falls: a natural rock face, built from the same
 * lumpy stones as the river (stone) in every size, heaped in loose, tilted layers
 * like a cliff's strata, each layer overlapping the feet of the one above, with
 * dark crevices between them. Moss on the ledges, ferns growing out of it, and
 * darker, wet rock by the water. Drawn for the left side, with the falls at its
 * right edge; the right side is its own, mirrored. Tall, so it's cut to the
 * footer's height from the top, and scaled to the width between the screen's
 * edge and the falls. It starts a little above the river's lip, so its mossy top
 * row caps the bank, and fades into the night a little way down.
 */
const CLIFF = { width: 160, height: 2400 };

/** Lit and shaded tones for dry rock, and for wet rock by the water. Dusky, since it's night down here. */
const CLIFF_ROCK = [
  ["#4a526b", "#363c53"],
  ["#525b75", "#3a4058"],
  ["#454c64", "#32374d"],
];
const CLIFF_WET = ["#3d445c", "#2c3146"];

function cliffFace(random: () => number) {
  const rocks: ({ x: number; y: number; w: number; h: number; wet: boolean; tone: number; flip: boolean } & ReturnType<typeof stone>)[] = [];
  const ferns: { x: number; y: number; size: number; fronds: ReturnType<typeof fern> }[] = [];
  for (let y = -2; y < CLIFF.height; ) {
    // One layer: its depth, and how much it tilts across the face.
    const band = 30 + random() * 50;
    const tilt = (random() - 0.5) * 0.3;
    for (let right = CLIFF.width + 12 - random() * 24; right > -40; ) {
      const w = band * (1 + random() * 1.4);
      const h = band * (0.85 + random() * 0.6);
      // How close to the water, 0 far off to 1 at the falls, and how high up.
      const near = Math.max(0, Math.min(1, right / CLIFF.width));
      const high = 1 - Math.min(1, Math.max(0, y) / 700);
      // The top row is the cliff's cap, under the bank's grass, so it's all moss.
      const mossy = y < 10 || random() < 0.2 + 0.55 * high * (0.4 + 0.6 * near);
      const top = y + (right - w / 2 - CLIFF.width / 2) * tilt + (random() - 0.5) * 10;
      rocks.push({ x: right - w, y: top, w, h, wet: near > 0.82, tone: Math.floor(random() * CLIFF_ROCK.length), flip: random() < 0.5, ...stone(random, mossy) });
      if (mossy && random() < 0.2 * high + 0.04) {
        ferns.push({ x: right - w * (0.3 + random() * 0.4), y: top + h * 0.3, size: 0.24 + random() * 0.14, fronds: fern(random) });
      }
      // Neighbours overlap, so the layer reads as one heap of rock.
      right -= w * (0.6 + random() * 0.28);
    }
    y += band * (0.6 + random() * 0.22);
  }
  return { rocks, ferns };
}

const CLIFFS = [cliffFace(random), cliffFace(random)];

function CliffFace({ side }: { side: Side }) {
  const face = CLIFFS[side === "left" ? 0 : 1];
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${CLIFF.width} ${CLIFF.height}`}
      preserveAspectRatio="xMaxYMin slice"
      className={`pointer-events-none absolute top-[calc(var(--footer-dusk)-1.25rem)] z-[var(--z-media)] h-[calc(100%-var(--footer-dusk)+1.25rem)] w-[calc(var(--forest-foot)+4px)] [mask-image:linear-gradient(to_bottom,#000_6rem,transparent_32rem)] ${side === "left" ? "left-0" : "right-0 -scale-x-100"}`}
    >
      {/* The shadowed rock showing in the crevices between the stones, from below
          the top row, so the bank shows between the cap stones' tops. */}
      <rect y={34} width={CLIFF.width} height={CLIFF.height} fill="#262a3e" />
      {face.rocks.map((rock, i) => {
        const [lit, shaded] = rock.wet ? CLIFF_WET : CLIFF_ROCK[rock.tone];
        // Each stone is drawn on its waterline in ROCK_BOX; this sets it in its place.
        const place = rock.flip
          ? `translate(${pt(rock.x + rock.w, rock.y)}) scale(${(-rock.w / ROCK_BOX.width).toFixed(3)} ${(rock.h / WATERLINE).toFixed(3)})`
          : `translate(${pt(rock.x, rock.y)}) scale(${(rock.w / ROCK_BOX.width).toFixed(3)} ${(rock.h / WATERLINE).toFixed(3)})`;
        return (
          <g key={i} transform={place}>
            <path d={rock.outline} fill={lit} />
            <path d={rock.shade} fill={shaded} />
            {rock.moss && <path d={rock.moss} fill="#486541" {...ink} strokeOpacity={0.4} strokeWidth={1.1} />}
            {rock.shine && <path d={rock.shine} {...line} stroke="rgba(255,255,255,0.12)" />}
            <path d={rock.outline} {...line} strokeOpacity={0.4} strokeWidth={1.2} />
          </g>
        );
      })}
      {face.ferns.map(({ x, y, size, fronds }, i) => (
        <g key={i} transform={`translate(${pt(x - (FERN_BOX.width * size) / 2, y - FERN_BOX.height * size)}) scale(${size.toFixed(2)})`}>
          {fronds.map((frond, j) => (
            <g key={j}>
              <path d={frond.leaf} fill="#446a40" {...ink} strokeOpacity={0.4} />
              <path d={frond.rib} {...line} stroke="#2f5a2c" strokeWidth={1.1} />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

/**
 * The falls: where the river goes over the edge at the end of the page and pours
 * down behind the footer's copy, darkening into the night as it goes, so the
 * footer's sky still shows round it and through it. The footer draws it, lined up
 * with the river's mouth at the bottom of the scenery. It's on the media layer,
 * like a photo, so the clouds and things in the sky pass behind the water rather
 * than between it and the copy. Its streaks only run while it's on screen.
 */
export function Falls() {
  const falls = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = falls.current;
    if (!svg) return;
    const watcher = new IntersectionObserver(([entry]) => svg.toggleAttribute("data-falling", entry.isIntersecting));
    watcher.observe(svg);
    return () => watcher.disconnect();
  }, []);

  return (
    <>
      <CliffFace side="left" />
      <CliffFace side="right" />
      <svg
        ref={falls}
        data-falls
        aria-hidden="true"
        viewBox={`0 0 ${FALLS.width} ${FALLS.height}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-[var(--forest-foot)] top-[var(--footer-dusk)] z-[var(--z-media)] h-[calc(100%-var(--footer-dusk))] w-[calc(100%-2*var(--forest-foot))] overflow-visible"
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
          <radialGradient id="falls-mist">
            <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          {/* The lip's foam and light keep to the curtain's own wavering edges (and
              the little way above it the foam crests), and the moss to its ledge,
              so nothing ends in a square corner. */}
          <clipPath id="falls-lip">
            <rect x={MOUTH[0]} y={-40} width={MOUTH[1] - MOUTH[0]} height={40} />
            <path d={CURTAIN} />
          </clipPath>
        </defs>
        <path d={CURTAIN} fill="url(#falls-water)" />
        {STREAMS.map(({ d, light }, i) => (
          <path key={i} d={d} fill={light ? "#fff" : "#16243f"} fillOpacity={light ? 0.07 : 0.22} />
        ))}
        {STREAKS.map((streak, i) => (
          <path
            key={i}
            className="scenery-flow"
            style={flowing(streak.dash, streak.speed)}
            d={streak.d}
            {...line}
            stroke="url(#falls-streak)"
            strokeDasharray={streak.dash}
          />
        ))}
        <g clipPath="url(#falls-lip)">
          <path d={BRINK} fill="url(#falls-brink)" />
          <g filter="url(#falls-soft)">
            {FOAM_TRAILS.map((d, i) => (
              <path key={i} d={d} fill="url(#falls-trail)" />
            ))}
          </g>
          <path d={WHITEWATER} fill="url(#falls-foam)" filter="url(#falls-soft)" />
        </g>
        {[180, 500, 820].map((x) => (
          <ellipse key={x} cx={x} cy={FALLS.height - 20} rx={200} ry={50} fill="url(#falls-mist)" />
        ))}
      </svg>
    </>
  );
}

export function Scenery() {
  const firs = (back: boolean) => FIRS.flatMap((tree, i) => (tree.back === back ? [<FirShape key={i} index={i} />] : []));

  return (
    // Holds the scenery's place at the end of the page: the footer is pulled up over
    // it, so the river comes to the edge just above the footer's copy, where the
    // falls take over.
    <div aria-hidden="true" className="pointer-events-none sticky bottom-0 z-[var(--z-scenery)] h-[var(--footer-dusk)]">
      <div className="absolute inset-x-0 bottom-0 h-[50vh] overflow-hidden">
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
          <path d={BANK_EDGE} {...line} />
        </svg>
        <svg viewBox={`0 0 ${VALLEY.width} ${VALLEY.height}`} preserveAspectRatio="none" className={riverBox}>
          <path d={RIVER} fill={paint.water} />
          <path d={SKY_IN_WATER} fill={paint.skyInWater} />
          {TREES_IN_WATER.map((d, i) => (
            <path key={i} d={d} fill={paint.treesInWater} />
          ))}
          {RIPPLES.map((ripple, i) => (
            <path
              key={i}
              className="scenery-flow"
              style={flowing(ripple.dash, ripple.speed)}
              d={ripple.d}
              {...line}
              stroke={paint.foam}
              strokeDasharray={ripple.dash}
            />
          ))}
          {RIVER_BANKS.map((d, i) => (
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
