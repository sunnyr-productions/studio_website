"use client";

import { Fragment, useEffect, useMemo, useRef, type CSSProperties } from "react";
import { go, place, placeOf } from "./journey";
import { seeded } from "./Sky";
import { useVisitSeed } from "./visit";

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
 * again, seamlessly, at `speed` units a millisecond. Moving dashes are redrawn
 * rather than slid along, so a slow run can be given a number of `steps` a second
 * to move in, with none of them big enough to see, and be redrawn only that often.
 * Its time is rounded to a whole number of steps, so every run given the same
 * `steps` steps at the same instant: on their own clocks, a handful of runs
 * between them had something to redraw almost every frame.
 */
const flowing = (dash: string, speed: number, steps = 0) => {
  const pattern = dash.split(" ").reduce((sum, length) => sum + Number(length), 0);
  const seconds = pattern / speed / 1000;
  const count = steps ? Math.max(1, Math.round(seconds * steps)) : 0;
  return {
    "--flow-to": -pattern,
    "--flow-time": `${(steps ? count / steps : seconds).toFixed(3)}s`,
    ...(steps ? { animationTimingFunction: `steps(${count})` } : null),
  } as CSSProperties;
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

/** Each colour with the darker shade of it that the side away from the light takes. The greens are in `greens`. */
const paint = {
  farGround: "#3a5d4d",
  backBark: ["#8c6d5a", "#76594a"],
  frontBark: ["#7b4f36", "#5f3b28"],
  bank: "#557f45",
  water: "#3a7086",
  // The sky shows in the middle of the river, the forest along its edges.
  skyInWater: "#4f88a0",
  treesInWater: "#2b5868",
  stone: ["#a19d92", "#827e74"],
  wetStone: ["#77878c", "#5d6d72"],
  fernRib: "#2f5a2c",
  foam: "rgba(255,255,255,0.8)",
} as const;

/**
 * The forest's greens. No two trees, stones or ferns need be quite the same:
 * each takes one of these, lit and shaded. The front firs are the deepest and
 * warmest, the back ones lighter and bluer with the distance, and the woods
 * behind them hazier still. Moss runs from yellow-green in the sun to deep and
 * cool in the damp, and darker again on the cliffs, down in the night.
 */
const greens = {
  frontFir: [["#3e6e4c", "#2f5a3d"], ["#467240", "#355b31"], ["#356650", "#284f3f"], ["#4b7747", "#385d36"], ["#2f604a", "#234b39"]],
  backFir: [["#5b8a6e", "#4c7a60"], ["#678f66", "#577f58"], ["#527f70", "#456f62"], ["#6a9474", "#5a8465"]],
  woods: [["#4f7666", "#43695b"], ["#5a7d63", "#4d6f57"], ["#466f61", "#3b6053"], ["#62866a", "#55785d"], ["#557a6d", "#486c60"]],
  midFir: [["#47755a", "#39624a"], ["#4f7a52", "#3f6544"]],
  moss: ["#6d9a45", "#80a84a", "#5f9048", "#8ba34b", "#558a4f", "#94ae56", "#4f8046"],
  fern: ["#4e8a46", "#5b9548", "#43804b", "#64904a", "#3f7a44"],
  // Up the shady side of an old trunk: never the sunny yellow-greens.
  trunkMoss: ["#5f8a45", "#567f48", "#4f7a44", "#668f4a"],
  cliffMoss: ["#486541", "#536e3f", "#3f5f47", "#58744a", "#44683f", "#4d6a4b"],
  cliffFern: ["#446a40", "#4e7444", "#3d6248"],
};

/** Bark for the woods and the dead trees standing in them, weathered grey. */
const woodsBark = [["#86705f", "#6f5c4e"], ["#8d8073", "#746a5f"], ["#7c6656", "#665345"]];

type Point = [number, number];
type Side = "left" | "right";

/**
 * A coordinate to a tenth, written as short as it can be (50 for 50.0, .5 for
 * 0.5): the scenery is tens of thousands of them, all sent with every page.
 */
const num = (n: number) => {
  const s = n.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s.replace(/^(-?)0\./, "$1.");
};
const pt = (x: number, y: number) => `${num(x)} ${num(y)}`;
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
const defaultRandom = random;
// The colours are picked from a stream of their own, and the woods drawn from
// another, so neither moves a single bough or stone of the rest.
const tones = seeded(0x6ee7);
const pick = <T,>(list: readonly T[]) => list[Math.floor(tones() * list.length)];
const woodsRandom = seeded(0x3d5a);

/**
 * The far shore: a dark wall of firs along the horizon. Unlike the valley it's
 * drawn at a fixed scale and cropped to the screen from the middle out, so the
 * trees keep their shape at any width; its height lines up with the valley's.
 */
const HORIZON = { width: 2000, height: VALLEY.height };
const farShore = (x: number) => 68 - 7 * bump(x, 700, 400) - 5 * bump(x, 1400, 450);

/** A far-off fir: a ragged spire, its tiers jutting out unevenly. */
function spire(x: number, base: number, height: number, width: number, random = defaultRandom) {
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

/**
 * Two rows of them, the back one taller and hazier. Trees of a colour share a
 * path. They part in the middle (`clear` either side of it), where the river
 * comes down out of the hills (STREAM).
 */
const FAR_FIRS = [
  { colors: ["#5a8273", "#4f786a", "#628a79", "#557d6c"], shortest: 22, tallest: 42, gap: 14, line: 0.3, clear: 30 },
  { colors: ["#3d6150", "#456a57", "#355a49", "#4b7059", "#40664f"], shortest: 12, tallest: 30, gap: 11, line: 0.45, clear: 24 },
].map((row) => {
  const paths = row.colors.map(() => "");
  for (let x = -10; x < HORIZON.width + 10; x += row.gap * (0.5 + random())) {
    const height = row.shortest + random() * (row.tallest - row.shortest);
    const color = Math.floor(random() * paths.length);
    // Drawn either way, so the trees either side keep their shapes.
    const tree = spire(x, farShore(x) + 6, height, height * (0.2 + random() * 0.12));
    if (Math.abs(x - HORIZON.width / 2) > row.clear) paths[color] += tree;
  }
  return { line: row.line, trees: paths.map((d, i) => ({ d, fill: row.colors[i] })) };
});

const farPoints = Array.from({ length: 22 }, (_, i): Point => [i * 100 - 50, farShore(i * 100 - 50)]);
const FAR_GROUND = `M${pt(...farPoints[0])}${through(farPoints)}L${pt(HORIZON.width + 50, HORIZON.height + 10)}L${pt(-50, HORIZON.height + 10)}Z`;

/**
 * Rolling hills beyond the far shore, where the river comes from: three ranges of
 * them, paler and bluer the further off, falling away either side of the valley
 * in the middle that the river winds down, with firs dotted over them in clumps.
 * At HORIZON's scale and lined up with it, but taller, to stand up above it; y
 * here is HORIZON's plus HILLS.rise.
 */
const HILLS = { width: HORIZON.width, height: 340, rise: 140 };
const RANGES = (() => {
  const random = seeded(0x41f5);
  return [
    {
      fill: "#a9bcb0",
      treeColor: "#93ab9d",
      line: 0.2,
      ridge: (x: number) => 150 - 30 * bump(x, 520, 330) - 36 * bump(x, 1500, 360) + 18 * bump(x, 1000, 140),
    },
    {
      fill: "#86a593",
      treeColor: "#6f917d",
      line: 0.28,
      ridge: (x: number) =>
        172 - 22 * bump(x, 760, 240) - 24 * bump(x, 1290, 260) - 12 * bump(x, 180, 260) - 14 * bump(x, 1820, 260) + 16 * bump(x, 1010, 110),
    },
    {
      fill: "#6c937c",
      treeColor: "#567e69",
      line: 0.36,
      ridge: (x: number) =>
        190 - 14 * bump(x, 600, 200) - 16 * bump(x, 1400, 220) - 8 * bump(x, 880, 120) - 9 * bump(x, 1130, 120) + 8 * bump(x, 1000, 70),
    },
  ].map((range, i) => {
    const points = Array.from({ length: 42 }, (_, k): Point => [k * 50 - 25, range.ridge(k * 50 - 25)]);
    const ridge = `M${pt(...points[0])}${through(points)}`;
    // Further off, the trees are smaller and closer together.
    const [spacing, size] = [[22, 6], [16, 8], [12, 11]][i];
    let trees = "";
    for (let x = -10; x < HILLS.width + 10; x += spacing * (0.4 + random() * 1.4)) {
      // The valley floor's clear, and they grow in clumps, not hedges.
      if (Math.abs(x - HILLS.width / 2) < 70 + i * 25 || random() < 0.35) continue;
      const height = size * (0.6 + random() * 0.8);
      trees += spire(x, range.ridge(x) + 2 + random() * (4 + i * 4), height, height * 0.3, random);
    }
    return { ...range, ridge, land: `${ridge}L${pt(HILLS.width + 25, HILLS.height)}L${pt(-25, HILLS.height)}Z`, trees };
  });
})();

/**
 * The river, small in the distance, winding down the valley between the hills
 * and on through the gap in the far shore's firs, widening as it comes, into the
 * near end of the river. In the river's box like the river, so it meets it at
 * any width, but taller, by HILLS.rise, to reach up into the hills: points are
 * [x, y, width]. It comes from behind the far range's dip.
 */
const STREAM_COURSE: [number, number, number][] = [
  [507, 147, 1.4], [497, 152, 2], [510, 158, 2.8], [528, 164, 3.6], [512, 170, 4.6], [484, 176, 6],
  [470, 182, 7.6], [486, 188, 10], [512, 193, 15], [514, 196.5, 26], [500, 199.5, 40],
];

// In the river's own box: narrow where it comes out of the hills (STREAM) at the
// horizon, and opening out quickly, in perspective, to the whole of the box as it
// reaches you, the banks running almost with its sides. Its far end starts a touch
// above the horizon, over the bank's skyline, so it runs on from the stream there
// rather than from behind a line.
const LEFT_BANK: Point[] = [[480, rise(480) - 2], [380, 68], [230, 86], [160, 112], [95, 148], [0, 200], [-25, 216]];
const RIGHT_BANK: Point[] = [[520, rise(520) - 2], [620, 68], [770, 86], [840, 112], [905, 148], [1000, 200], [1025, 216]];

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
const STREAM = water(
  STREAM_COURSE.map(([x, y, w]): Point => [x - w / 2, y]),
  STREAM_COURSE.map(([x, y, w]): Point => [x + w / 2, y]),
);
const SKY_IN_WATER = water(downstream(0.3), downstream(0.66));
const TREES_IN_WATER = [water(downstream(0), downstream(0.1)), water(downstream(0.9), downstream(1))];

/**
 * The current: lines down the river, each wavering a little as it comes and
 * broken into an uneven run of streaks and gaps of its own, brightest and
 * quickest mid-stream and slack by the banks. Each runs in two stretches, the
 * far one in short, slow flecks and the near one in longer streaks that come on
 * faster, as water does coming toward you. Speed is in units a millisecond. From
 * a stream of numbers of its own, so the rest of the river keeps its shapes.
 */
const currentRandom = seeded(0xc0a5e);
const between = ([lo, hi]: [number, number]) => Math.round(lo + currentRandom() * (hi - lo));
/** An uneven dash pattern: `count` streaks and gaps, no two alike. */
const streaks = (count: number, dash: [number, number], gap: [number, number]) =>
  Array.from({ length: count }, () => `${between(dash)} ${between(gap)}`).join(" ");
/** A point down the river, `s` of the way from its far end, `across` it from the left bank. */
const inRiver = (s: number, across: number): Point => {
  const k = s * (LEFT_BANK.length - 2);
  const i = Math.min(Math.floor(k), LEFT_BANK.length - 3);
  const t = k - i;
  return lerp(lerp(LEFT_BANK[i], LEFT_BANK[i + 1], t), lerp(RIGHT_BANK[i], RIGHT_BANK[i + 1], t), across);
};
const RIPPLES = Array.from({ length: 6 }, (_, i) => {
  const across = 0.1 + (0.8 * i) / 5 + (currentRandom() - 0.5) * 0.06;
  const mid = 1 - Math.abs(across - 0.5) * 2;
  // Each line snakes gently as it comes, so its streaks are little curls of
  // water, not ticks: a few slow bends, a ripple on top of them.
  const [phase, bends, ripples] = [currentRandom() * 6, 2 + currentRandom() * 1.5, 9 + currentRandom() * 5];
  const sway = 0.012 + mid * 0.012;
  const at = (s: number) =>
    inRiver(s, Math.min(0.98, Math.max(0.02, across + Math.sin(s * bends * Math.PI + phase) * sway + Math.sin(s * ripples * Math.PI + phase * 2) * sway * 0.45)));
  const course = (from: number, to: number) => {
    const run = Array.from({ length: 22 }, (_, k): Point => at(from + ((to - from) * k) / 21));
    return `M${pt(...run[0])}${through(run)}`;
  };
  const opacity = 0.28 + mid * 0.3 + currentRandom() * 0.1;
  const width = 0.8 + mid * 0.35 + currentRandom() * 0.2;
  const speed = (0.006 + mid * 0.009) * (0.85 + currentRandom() * 0.3);
  return [
    { d: course(0, 0.42), dash: streaks(3, [2, 4], [14, 30]), speed, opacity: opacity * 0.8, width: width * 0.8 },
    { d: course(0.4, 1), dash: streaks(3, [5, 12], [20, 44]), speed: speed * 1.8, opacity, width },
  ];
}).flat();

/**
 * Stones where they meet the water or the bank, and their width in vh (or `cap`
 * vw, on a narrow screen). Further off is further up the valley and smaller.
 */
const FAR_STONES = [198, 224, 257, 300, 340, 382, 431, 475, 517, 565, 609, 653, 700, 740, 776, 801];
const ROCKS = [
  // A few along the horizon, which the river comes out from between. (All are
  // drawn, so the rest keep their shapes, and those not in the water dropped.)
  ...FAR_STONES.map((x) => ({
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
    mossColor: pick(greens.moss),
    // Small, far-off rocks get a lighter line, like everything else in the distance.
    fine: rock.size < 3,
    style: { left, bottom: `calc(${bottom} - ${width} * ${drop})`, width, aspectRatio: `${ROCK_BOX.width} / ${ROCK_BOX.height}` },
  };
}).filter((rock, i) => i >= FAR_STONES.length || Math.abs(rock.x - VALLEY.width / 2) < 72);

/**
 * The water's depth: hazy and pale far off where it catches the sky, deepening
 * as it comes toward you, darker still down the channel in the middle, and
 * bright in the shallows where it laps the gravel. And light moving on it: soft
 * patches drifting slowly over the surface (.river-sheen in globals.css),
 * inside the river's own shape (RIVER_MASK).
 */
const DEEP_CHANNEL = water(downstream(0.4), downstream(0.6));
const SHALLOWS = [water(downstream(0), downstream(0.035)), water(downstream(0.965), downstream(1))];
const RIVER_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VALLEY.width} ${VALLEY.height}" preserveAspectRatio="none"><path d="${RIVER}"/></svg>`,
)}")`;

/**
 * A wake below each stone out in the current: two short lines opening out
 * downstream from it, as the water parts round it. In the river's units.
 */
const WAKES = ROCKS.filter((rock) => rock.wet && rock.y > 90 && rock.x > 280 && rock.x < 800)
  .map(({ x, y, size }) => {
    const [w, h] = [size * 3.2, size * 2.6];
    return `M${pt(x - w * 0.35, y + 1)}Q${pt(x - w * 0.6, y + h * 0.5)} ${pt(x - w, y + h)}M${pt(x + w * 0.35, y + 1)}Q${pt(x + w * 0.6, y + h * 0.5)} ${pt(x + w, y + h)}`;
  })
  .join("");

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
      sway: swaying(stand.back ? 0.3 : 0.55, 4.4 + random() * 1.25, random()) as CSSProperties | undefined,
      needles: pick(stand.back ? greens.backFir : greens.frontFir),
      barkColors: (stand.back ? paint.backBark : paint.frontBark) as readonly string[],
      mossColor: pick(greens.trunkMoss),
      line: stand.back ? 0.5 : 1,
    };
  }),
);

type Tree = (typeof FIRS)[number];

/**
 * A dead fir still standing, as old-growth woods are full of: a bare, tapering
 * trunk snapped off jaggedly at the top, with stubs where its limbs were. In
 * FIR_BOX, like a living one.
 */
function snag(random: () => number) {
  const x = FIR_BOX.width / 2;
  const base = FIR_BOX.height;
  const top = 70 + random() * 90;
  const foot = 8 + random() * 2.5;
  const tip = 3.5 + random() * 1.5;
  const shoulder = base - 18;
  const trunk =
    `M${pt(x - foot * 1.6, base)}Q${pt(x - foot, base - 3)} ${pt(x - foot, shoulder)}L${pt(x - tip, top + 7)}` +
    `L${pt(x - tip * 0.3, top)}L${pt(x + tip * 0.2, top + 6)}L${pt(x + tip * 0.6, top + 2)}L${pt(x + tip, top + 9)}` +
    `L${pt(x + foot, shoulder)}Q${pt(x + foot, base - 3)} ${pt(x + foot * 1.6, base)}Z`;
  const trunkShade =
    `M${pt(x + tip * 0.3, top + 5)}L${pt(x + tip, top + 9)}L${pt(x + foot, shoulder)}` +
    `Q${pt(x + foot, base - 3)} ${pt(x + foot * 1.6, base)}L${pt(x + foot * 0.3, base)}Z`;
  const girth = (y: number) => tip + ((foot - tip) * (y - top)) / (shoulder - top);
  let bark = `M${pt(x - 1.5, base - 6)}L${pt(x - 0.8, top + 24)}M${pt(x + 2, base - 12)}L${pt(x + 1, top + 40)}`;
  for (let y = top + 26; y < base - 50; y += 24 + random() * 34) {
    const side = random() < 0.5 ? -1 : 1;
    bark += `M${pt(x + side * girth(y), y)}l${pt(side * (4 + random() * 6), -(1.5 + random() * 3))}`;
  }
  return { trunk, trunkShade, moss: "", bark, boughs: [] as ReturnType<typeof bough>[] };
}

/**
 * The woods behind: a crowd of firs and the odd dead one between the far shore
 * and the swaying trees, in from the edge by `offset` times their own width,
 * their feet beyond the bank's skyline. They're further off than anything that
 * sways, so they hold still, and they're hazier, in the woods' own greens. A
 * couple more, big and old, stand just behind the front row, their bare trunks
 * showing between it.
 */
const WOODS_STANDS = [
  { offset: 0.35, height: 40, bottom: 7, cap: 13, dead: false },
  { offset: 1.25, height: 31, bottom: 9, cap: 10, dead: false },
  { offset: 0.05, height: 46, bottom: 6, cap: 14, dead: true },
  { offset: 2.1, height: 27, bottom: 10, cap: 9, dead: false },
  { offset: 1.75, height: 37, bottom: 8, cap: 11, dead: true },
  { offset: 3, height: 22, bottom: 11, cap: 7, dead: false },
  { offset: 2.6, height: 30, bottom: 9.5, cap: 8, dead: true },
  { offset: 3.9, height: 18, bottom: 12, cap: 6, dead: false },
  { offset: 4.6, height: 15, bottom: 12.5, cap: 5, dead: false },
];
const MID_STANDS = [
  { offset: 0.3, height: 50, bottom: -3, cap: 16 },
  { offset: 1.05, height: 44, bottom: -1, cap: 13 },
];

const placed = (side: Side, stand: { offset: number; height: number; bottom: number; cap: number }) => {
  const height = stand.height * (0.95 + woodsRandom() * 0.1);
  const width = `min(${((height * FIR_BOX.width) / FIR_BOX.height).toFixed(2)}vh, ${stand.cap}vw)`;
  const tall = `min(${height.toFixed(2)}vh, ${((stand.cap * FIR_BOX.height) / FIR_BOX.width / 0.8).toFixed(2)}vw)`;
  return { ...fromEdge(side, `calc(${width} * ${stand.offset})`), bottom: `${stand.bottom}vh`, height: tall, width };
};

const WOODS: Tree[] = SIDES.flatMap((side) =>
  WOODS_STANDS.map((stand) => ({
    back: true,
    ...(stand.dead ? snag(woodsRandom) : fir(woodsRandom, woodsRandom() < 0.5)),
    style: placed(side, stand),
    sway: undefined,
    needles: pick(greens.woods),
    barkColors: pick(woodsBark),
    mossColor: pick(greens.cliffMoss),
    line: 0.38,
  })),
);

const MID_WOODS: Tree[] = SIDES.flatMap((side) =>
  MID_STANDS.map((stand) => ({
    back: false,
    ...fir(woodsRandom, true),
    style: placed(side, stand),
    sway: undefined,
    needles: pick(greens.midFir),
    barkColors: ["#6e5141", "#573f32"],
    mossColor: pick(greens.trunkMoss),
    line: 0.7,
  })),
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
].map((spot) => ({ ...spot, fronds: fern(random), sway: swaying(1.2, 2.8 + random() * 0.8, random()), green: pick(greens.fern) }));

/**
 * Gravel: a bed of smooth, flat river stones covering the ground along both
 * banks, from the shallows up into the grass, as a river leaves it. One texture
 * (a tile of stones packed close on a sandy bed) laid over a band along each
 * bank: the band follows the river (drawn in its stretched units, as a mask),
 * but the stones are sized in screen units, so they stay round at any width.
 * In three reaches, the stones coarser the nearer they are, each fading into
 * the next. Three layers in all, from a stream of numbers of its own.
 */
const gravelRandom = seeded(0x67a7e1);
/** Lit and shaded tones of washed river stone: greys, tans, and a bluish slate. */
const PEBBLE_TONES = [
  ["#c4bcaa", "#a59d8b"],
  ["#b3ad9f", "#948e81"],
  ["#a9a8a0", "#8b8a83"],
  ["#c0b39b", "#a1947b"],
  ["#9fa5a4", "#838988"],
];

/**
 * The tile: stones packed close at random, mostly small, some middling and the
 * odd big one, in all the tones, some flatter than others and lying at angles,
 * none crossing its edges, so it repeats without a seam and without a grid.
 */
const GRAVEL_TILE = (() => {
  const [w, h] = [300, 180];
  const tones = [...PEBBLE_TONES, ["#cfc6b3", "#b0a793"], ["#8f8a7f", "#75716a"]];
  const shapes = tones.map(() => ({ lit: "", shade: "" }));
  let outline = "";
  let shine = "";
  const placed: { x: number; y: number; rx: number; ry: number }[] = [];
  for (let tries = 0; tries < 9000 && placed.length < 420; tries++) {
    const size = gravelRandom();
    const rx = size < 0.55 ? 4.5 + gravelRandom() * 3 : size < 0.9 ? 7.5 + gravelRandom() * 3.5 : 11 + gravelRandom() * 4;
    const ry = rx * (0.36 + gravelRandom() * 0.26);
    const x = rx + 1 + gravelRandom() * (w - 2 * rx - 2);
    const y = rx * 0.6 + 1 + gravelRandom() * (h - rx * 1.2 - 2);
    if (placed.some((q) => ((q.x - x) / (q.rx + rx)) ** 2 + ((q.y - y) / (q.ry + ry + 0.6)) ** 2 < 0.62)) continue;
    placed.push({ x, y, rx, ry });
    const tilt = (gravelRandom() - 0.5) * 40;
    const [c, sn] = [Math.cos((tilt * Math.PI) / 180), Math.sin((tilt * Math.PI) / 180)];
    const [left, right] = [pt(x - rx * c, y - rx * sn), pt(x + rx * c, y + rx * sn)];
    const arc = (r: number) => `${num(rx)} ${num(r)} ${tilt.toFixed(0)}`;
    const oval = `M${left}A${arc(ry)} 1 0 ${right}A${arc(ry)} 1 0 ${left}Z`;
    const tone = shapes[Math.floor(gravelRandom() * shapes.length)];
    tone.lit += oval;
    tone.shade += `M${left}A${arc(ry)} 0 0 ${right}A${arc(ry * 0.4)} 0 1 ${left}Z`;
    outline += oval;
    if (rx > 6.5) shine += `M${pt(x - rx * 0.5, y - ry * 0.35)}Q${pt(x - rx * 0.15, y - ry * 0.75)} ${pt(x + rx * 0.2, y - ry * 0.65)}`;
  }
  let body = `<rect width="${w}" height="${h}" fill="#a39a88"/>`;
  shapes.forEach(({ lit, shade }, i) => {
    if (lit) body += `<path d="${lit}" fill="${tones[i][0]}"/><path d="${shade}" fill="${tones[i][1]}"/>`;
  });
  body += `<path d="${outline}" fill="none" stroke="#1f2430" stroke-opacity="0.35" stroke-width="0.8"/>`;
  body += `<path d="${shine}" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="0.9" stroke-linecap="round"/>`;
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`)}")`;
})();

/**
 * The band along each bank, in the river's units widened a tenth either side
 * (GRAVEL_SPAN), from just into the water up the bank, wider the nearer it is,
 * with a lumpy edge where it gives way to grass. As a mask for each reach:
 * `from` and `to` down the valley, soft at both ends so the reaches blend.
 */
const GRAVEL_SPAN = { left: -100, width: 1200 };
function gravelMask(from: number, to: number, widen = 1) {
  const band = (bank: Point[], out: number) => {
    const edge = Array.from({ length: 40 }, (_, k) => inRiver(k / 39, out < 0 ? 0 : 1));
    const water = edge.map(([x, y]): Point => [x - out * 3, y]);
    const grass = edge.map(([x, y], k): Point => {
      const reach = (14 + Math.max(0, y - 58) * 1.15) * widen;
      return [x + out * reach * (0.85 + 0.15 * Math.sin(k * 2.3) + 0.08 * Math.sin(k * 5.1)), y - 0.6];
    });
    return `M${pt(...water[0])}${through(water)}L${pt(...grass[grass.length - 1])}${through([...grass].reverse())}Z`;
  };
  const shape = band(LEFT_BANK, -1) + band(RIGHT_BANK, 1);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${GRAVEL_SPAN.left} 0 ${GRAVEL_SPAN.width} ${VALLEY.height + 20}" preserveAspectRatio="none">` +
    `<defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="${from - 6}" x2="0" y2="${to + 6}">` +
    `<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="${(6 / (to - from + 12)).toFixed(3)}" stop-color="#fff"/>` +
    `<stop offset="${(1 - 6 / (to - from + 12)).toFixed(3)}" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>` +
    `<path d="${shape}" fill="url(#g)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** The three reaches: where they run down the valley, and how big a tile of stones is there, in vh. */
const GRAVEL = [
  { from: 50, to: 100, tile: 11 },
  { from: 94, to: 150, tile: 20 },
  { from: 144, to: 222, tile: 34 },
]
  // On a phone the river's box is squeezed across, so the band's drawn three
  // times as wide to cover as much ground (.gravel-bed in globals.css).
  .map(({ from, to, tile }) =>
    ({
      backgroundImage: GRAVEL_TILE,
      backgroundSize: `min(${tile}vh, ${tile * 2}vw) auto`,
      "--gravel": gravelMask(from, to),
      "--gravel-narrow": gravelMask(from, to, 3),
    }) as CSSProperties,
  );

function FirShape({ tree }: { tree: Tree }) {
  const { needles, barkColors: bark } = tree;
  return (
    <div className={`${tree.sway ? "scenery-sway " : ""}absolute origin-bottom`} style={{ ...tree.style, ...tree.sway }}>
      <svg
        viewBox={`0 0 ${FIR_BOX.width} ${FIR_BOX.height}`}
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        strokeOpacity={tree.line}
      >
        <path d={tree.trunk} fill={bark[0]} />
        <path d={tree.trunkShade} fill={bark[1]} />
        <path d={tree.trunk} {...line} />
        {tree.moss && <path d={tree.moss} fill={tree.mossColor} {...ink} strokeOpacity={0.6 * tree.line} />}
        {tree.bark && <path d={tree.bark} {...line} strokeWidth={1.2} />}
        {/* Each tier straight in the drawing, in order, no group round it: a group
            is one more thing in the page and draws nothing. */}
        {tree.boughs.map(({ body, shade }, i) => (
          <Fragment key={i}>
            <path d={body} fill={needles[0]} />
            <path d={shade} fill={needles[1]} />
            <path d={body} {...line} />
          </Fragment>
        ))}
      </svg>
    </div>
  );
}

/**
 * Fiddleheads: young fronds still curled tight at the tip, standing up out of
 * the front ferns, their coils just like the scroll of a fiddle, which is how
 * they got the name. A stem rising from the fern's root and a spiral winding in
 * at its top, in the fern's own green with an ink line, two to a fern. Each
 * fern's from a stream of numbers of its own, so nothing else moves.
 */
function fiddleheads(random: () => number) {
  return Array.from({ length: 2 }, (_, n) => {
    const root: Point = [FERN_BOX.width / 2 + (random() - 0.5) * 18, FERN_BOX.height - 2];
    const height = 30 + random() * 14;
    const top: Point = [root[0] + (n ? 1 : -1) * (4 + random() * 10), root[1] - height];
    const dir = top[0] < root[0] ? -1 : 1;
    const r0 = 4.5 + random() * 2;
    const centre: Point = [top[0] + dir * r0, top[1]];
    // Up and over, outward, and winding in to the middle.
    const coil = Array.from({ length: 14 }, (_, k): Point => {
      const turn = (k / 13) * 2.4 * Math.PI;
      const r = r0 * (1 - turn / (2.7 * Math.PI));
      const angle = dir > 0 ? Math.PI + turn : -turn;
      return [centre[0] + Math.cos(angle) * r, centre[1] + Math.sin(angle) * r];
    });
    const stem = `M${pt(...root)}Q${pt(root[0] + (top[0] - root[0]) * 0.2, root[1] - height * 0.6)} ${pt(...top)}`;
    return `${stem}${through([top, ...coil.slice(1)])}`;
  });
}

const FIDDLEHEADS = FERNS.map((fern, i) => (fern.centered ? [] : fiddleheads(seeded(0xf1dd1e + i))));

function FernShape({ index }: { index: number }) {
  const fern = FERNS[index];
  // Centred by a box of its own, swaying in another: a translate and the sway's
  // transform on the one box would have the browser draw every frame of the
  // sway itself, rather than hand it to the compositor.
  return (
    <div className={`absolute ${fern.centered ? "-translate-x-1/2" : ""}`} style={fern.style}>
      <div className="scenery-sway h-full w-full origin-bottom" style={fern.sway}>
        {/* Lighter in the line than the rest: all those teeth along the bottom of the
            screen would otherwise blur into a dark band behind the copy. */}
        <svg viewBox={`0 0 ${FERN_BOX.width} ${FERN_BOX.height}`} className="h-full w-full overflow-visible">
          {fern.fronds.map((frond, i) => (
            <Fragment key={i}>
              <path d={frond.leaf} fill={fern.green} {...ink} strokeOpacity={0.4} />
              <path d={frond.rib} {...line} stroke={paint.fernRib} strokeWidth={1.2} />
            </Fragment>
          ))}
          {FIDDLEHEADS[index].map((d, i) => (
            <Fragment key={`f${i}`}>
              <path d={d} {...line} strokeWidth={3.6} strokeOpacity={0.7} />
              <path d={d} {...line} stroke={fern.green} strokeWidth={2} />
            </Fragment>
          ))}
        </svg>
      </div>
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
        {rock.moss && <path d={rock.moss} fill={rock.mossColor} {...ink} strokeWidth={rock.fine ? 1.2 : 1.6} />}
        {rock.shine && <path d={rock.shine} {...line} stroke="rgba(255,255,255,0.75)" />}
      </svg>
    </div>
  );
}

const valleyBox = "absolute inset-x-0 bottom-0 h-[20vh] w-full";
const riverBox = "absolute bottom-0 left-[var(--forest-foot)] h-[20vh] w-[calc(100%-2*var(--forest-foot))] overflow-visible";
// The hills and the stream stand up above the valley, at its scale: HILLS.height
// is 34vh as VALLEY.height is 20.
const hillsBox = "absolute inset-x-0 bottom-0 h-[34vh] w-full";
const streamBox = "absolute bottom-0 left-[var(--forest-foot)] h-[34vh] w-[calc(100%-2*var(--forest-foot))]";

/**
 * The falls, in the same box as the river (so exactly as wide as its mouth) and
 * stretched down the footer, 300 units deep: the whole river going over the edge
 * in one curtain that darkens into the night. The cliff faces either side
 * (CliffFace) run out to the edges of the screen.
 */
const FALLS = { width: VALLEY.width, height: 300 };
const MOUTH = [LEFT_BANK[LEFT_BANK.length - 2][0], RIGHT_BANK[RIGHT_BANK.length - 2][0]];
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
 * right edge; the right side is its own, mirrored. Scaled to the width between
 * the screen's edge and the falls, and drawn as far down (`drawn`) as it shows
 * before fading into the night (CliffRock), at any size of screen.
 */
const CLIFF = { width: 160, height: 3600, drawn: 1400 };
/**
 * How far the rock can run on in under the falls, past their edge (at 160). Each
 * layer of stones ends where it ends, so the cliff's edge is as ragged as the
 * rock, and shows through the water's thin edges rather than stopping at a line.
 */
const CLIFF_UNDER = 56;

/** Lit and shaded tones for dry rock, and for wet rock by the water. Dusky, since it's night down here. */
const CLIFF_ROCK = [
  ["#4a526b", "#363c53"],
  ["#525b75", "#3a4058"],
  ["#454c64", "#32374d"],
];
const CLIFF_WET = ["#3d445c", "#2c3146"];

function cliffFace(random: () => number) {
  const rocks: ({ x: number; y: number; w: number; h: number; wet: boolean; tone: number; flip: boolean; mossColor: string } & ReturnType<typeof stone>)[] = [];
  const ferns: { x: number; y: number; size: number; fronds: ReturnType<typeof fern>; green: string }[] = [];
  // Down the cliff's ragged edge, a little in from each layer's last stone: the
  // shadowed rock behind the stones stops there too.
  const edge: Point[] = [];
  for (let y = -2; y < CLIFF.drawn; ) {
    // One layer: its depth, and how much it tilts across the face.
    const band = 30 + random() * 50;
    const tilt = (random() - 0.5) * 0.3;
    for (let right = CLIFF.width + 4 + random() * (CLIFF_UNDER - 8), first = true; right > -40; first = false) {
      const w = band * (1 + random() * 1.4);
      const h = band * (0.85 + random() * 0.6);
      if (first) edge.push([right - w * 0.2, y + h * 0.15], [right - w * 0.12, y + h * 0.55]);
      // How close to the water, 0 far off to 1 at the falls, and how high up.
      const near = Math.max(0, Math.min(1, right / CLIFF.width));
      const high = 1 - Math.min(1, Math.max(0, y) / 700);
      // The top row is the cliff's cap, under the bank's grass, so it's all moss.
      const mossy = y < 10 || random() < 0.2 + 0.55 * high * (0.4 + 0.6 * near);
      const top = y + (right - w / 2 - CLIFF.width / 2) * tilt + (random() - 0.5) * 10;
      rocks.push({ x: right - w, y: top, w, h, wet: near > 0.82, tone: Math.floor(random() * CLIFF_ROCK.length), flip: random() < 0.5, ...stone(random, mossy), mossColor: pick(greens.cliffMoss) });
      if (mossy && random() < 0.2 * high + 0.04) {
        ferns.push({ x: right - w * (0.3 + random() * 0.4), y: top + h * 0.3, size: 0.24 + random() * 0.14, fronds: fern(random), green: pick(greens.cliffFern) });
      }
      // Neighbours overlap, so the layer reads as one heap of rock.
      right -= w * (0.6 + random() * 0.28);
    }
    y += band * (0.6 + random() * 0.22);
  }
  const inside = edge.filter(([, y]) => y > 34);
  const backing =
    `M${pt(0, 34)}L${pt(inside[0][0], 34)}${inside.map((point) => `L${pt(...point)}`).join("")}` +
    `L${pt(inside[inside.length - 1][0], CLIFF.height)}L${pt(0, CLIFF.height)}Z`;
  return { rocks, ferns, backing };
}

const CLIFFS = [cliffFace(random), cliffFace(random)];

/** Where a stone from ROCK_BOX goes on the cliff: drawn on its waterline there, set in its place here. */
const placeStone = (rock: { x: number; y: number; w: number; h: number; flip: boolean }) =>
  rock.flip
    ? `translate(${pt(rock.x + rock.w, rock.y)}) scale(${(-rock.w / ROCK_BOX.width).toFixed(3)} ${(rock.h / WATERLINE).toFixed(3)})`
    : `translate(${pt(rock.x, rock.y)}) scale(${(rock.w / ROCK_BOX.width).toFixed(3)} ${(rock.h / WATERLINE).toFixed(3)})`;

/**
 * The cliff behind the falls, the same heaped stones as the faces either side,
 * wet all over, the odd one mossy, and so `width` by `depth` in CLIFF's units,
 * as a picture: there are hundreds of stones, and drawn once as an image they
 * cost nothing as the water runs over them. It's seen only through the water.
 */
function cliffWall(width: number, depth: number) {
  const random = seeded(0x5ca1);
  let body = `<rect width="${width}" height="${depth}" fill="#262a3e"/>`;
  for (let y = -10; y < depth; ) {
    const band = 30 + random() * 50;
    const tilt = (random() - 0.5) * 0.3;
    for (let right = width + 40; right > -40; ) {
      const w = band * (1 + random() * 1.4);
      const h = band * (0.85 + random() * 0.6);
      const top = y + (right - w / 2 - width / 2) * tilt * 0.3 + (random() - 0.5) * 10;
      const rock = { x: right - w, y: top, w, h, flip: random() < 0.5, ...stone(random, random() < 0.08) };
      const [lit, shaded] = random() < 0.6 ? CLIFF_WET : CLIFF_ROCK[Math.floor(random() * CLIFF_ROCK.length)];
      const moss = greens.cliffMoss[Math.floor(random() * greens.cliffMoss.length)];
      const stroke = `stroke="#1f2430" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"`;
      body +=
        `<g transform="${placeStone(rock)}"><path d="${rock.outline}" fill="${lit}"/><path d="${rock.shade}" fill="${shaded}"/>` +
        (rock.moss ? `<path d="${rock.moss}" fill="${moss}" ${stroke} stroke-opacity="0.4" stroke-width="1.1"/>` : "") +
        `<path d="${rock.outline}" fill="none" ${stroke} stroke-opacity="0.4" stroke-width="1.2"/></g>`;
      right -= w * (0.6 + random() * 0.28);
    }
    y += band * (0.6 + random() * 0.22);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${depth}" width="${width}" height="${depth}">${body}</svg>`;
}

const roundInk = `stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"`;

/**
 * One of the cliff's faces as a picture (the right one mirrored): a thousand
 * paths that never change, so they're kept out of the page's HTML and drawn once
 * as an image instead.
 */
function cliffFacePicture(face: (typeof CLIFFS)[number], mirrored: boolean) {
  const width = CLIFF.width + CLIFF_UNDER;
  // The shadowed rock showing in the crevices between the stones, from below the
  // top row, so the bank shows between the cap stones' tops, and out to the
  // cliff's ragged edge.
  let body = `<path d="${face.backing}" fill="#262a3e"/>`;
  for (const rock of face.rocks) {
    const [lit, shaded] = rock.wet ? CLIFF_WET : CLIFF_ROCK[rock.tone];
    body +=
      `<g transform="${placeStone(rock)}"><path d="${rock.outline}" fill="${lit}"/><path d="${rock.shade}" fill="${shaded}"/>` +
      (rock.moss ? `<path d="${rock.moss}" fill="${rock.mossColor}" stroke="#1f2430" ${roundInk} stroke-opacity="0.4" stroke-width="1.1"/>` : "") +
      (rock.shine ? `<path d="${rock.shine}" fill="none" stroke="#fff" ${roundInk} stroke-opacity="0.12" stroke-width="1.6"/>` : "") +
      `<path d="${rock.outline}" fill="none" stroke="#1f2430" ${roundInk} stroke-opacity="0.4" stroke-width="1.2"/></g>`;
  }
  for (const { x, y, size, fronds, green } of face.ferns) {
    body +=
      `<g transform="translate(${pt(x - (FERN_BOX.width * size) / 2, y - FERN_BOX.height * size)}) scale(${size.toFixed(2)})">` +
      fronds
        .map(
          (frond) =>
            `<path d="${frond.leaf}" fill="${green}" stroke="#1f2430" ${roundInk} stroke-opacity="0.4" stroke-width="1.6"/>` +
            `<path d="${frond.rib}" fill="none" stroke="#2f5a2c" ${roundInk} stroke-width="1.1"/>`,
        )
        .join("") +
      `</g>`;
  }
  if (mirrored) body = `<g transform="translate(${width} 0) scale(-1 1)">${body}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${CLIFF.drawn}" width="${width}" height="${CLIFF.drawn}">${body}</svg>`;
}

/**
 * The cliff: its faces either side of the falls, and the wall right across
 * behind them and the water, so it's all one cliff with the water falling over
 * it. Three pictures on one element, made in the browser: the faces once, sized
 * from the forest's foot in CSS, and the wall (cliffWall) at the faces' scale, as
 * big as the screen needs and again only if it needs to be bigger. It starts a
 * little above the river's lip, where the faces' mossy top row caps the bank
 * (the wall starts at the lip), and fades into the night a little way down.
 */
function CliffRock() {
  const rock = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = rock.current;
    const falls = document.querySelector("[data-falls]");
    if (!box || !falls) return;
    const picture = (svg: string) => URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const faces = [picture(cliffFacePicture(CLIFFS[0], false)), picture(cliffFacePicture(CLIFFS[1], true))];
    let wall = "";
    const built = { width: 0, depth: 0 };
    const fit = () => {
      // The faces' scale: CLIFF.width units to the forest's foot, plus their overlap.
      const foot = falls.getBoundingClientRect().left - box.getBoundingClientRect().left;
      const scale = (foot + 4) / CLIFF.width;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const width = box.offsetWidth / scale + 40;
      const depth = Math.min(box.offsetHeight, 31 * rem) / scale + 40;
      if (width > built.width || depth > built.depth) {
        built.width = Math.ceil(width / 200) * 200;
        built.depth = Math.ceil(depth / 200) * 200;
        if (wall) URL.revokeObjectURL(wall);
        wall = picture(cliffWall(built.width, built.depth));
        box.style.backgroundImage = `url(${faces[0]}), url(${faces[1]}), url(${wall})`;
      }
      const face = `calc((var(--forest-foot) + 4px) * ${(CLIFF.width + CLIFF_UNDER) / CLIFF.width}) auto`;
      box.style.backgroundSize = `${face}, ${face}, ${(built.width * scale).toFixed(1)}px ${(built.depth * scale).toFixed(1)}px`;
    };
    box.style.backgroundPosition = "left top, right top, center 1.25rem";
    fit();
    box.style.opacity = "1";
    window.addEventListener("resize", fit, { passive: true });
    return () => {
      window.removeEventListener("resize", fit);
      [...faces, wall].forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div
      ref={rock}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 top-[calc(var(--footer-dusk)-1.25rem)] z-[var(--z-media)] bg-no-repeat opacity-0 transition-opacity duration-500 [mask-image:linear-gradient(to_bottom,#000_6rem,transparent_32rem)]"
    />
  );
}

/**
 * The forest floor's edge, where it rounds over the top of the cliff either side
 * of the falls: a mossy bank of turf, its top in low hummocks the trees and ferns
 * stand in, its underside hanging over the cliff's top stones in lobes, with roots
 * and a few small ferns. By the falls it curves down to the water at the lip.
 * Drawn for the left side, the falls at its right edge, at a fixed scale in a box
 * 3.2rem tall that starts 1.3rem above the lip (CLIFF_TOP.lip), and cropped to
 * the width from the screen's edge to the falls.
 */
const CLIFF_TOP = { width: 600, height: 60, lip: 24.4 };

function cliffTop(random: () => number) {
  const edge = CLIFF_TOP.width - 5;
  const { lip } = CLIFF_TOP;
  // Over the top from the water's edge out past the screen's: down from the lip,
  // then hummocks and dips.
  const top: Point[] = [[edge + 1, lip], [edge - 5, lip - 11], [edge - 16, 6 + random() * 2]];
  for (let x = edge - 30, high = true; x > -50; x -= 10 + random() * 22, high = !high) {
    top.push([x, high ? 1.5 + random() * 3 : 6 + random() * 2.5]);
  }
  let d = `M${pt(...top[0])}${through(top)}L${pt(-60, 29)}`;
  // Back along the underside in lobes, drooping over the stones below.
  const under: Point[] = [];
  for (let x = -60; x < edge - 6; ) {
    const next = Math.min(edge - 6, x + 12 + random() * 26);
    const sag = 31 + random() * 7;
    d += `Q${pt((x + next) / 2, sag)} ${pt(next, 27 + random() * 2.5)}`;
    under.push([(x + next) / 2, sag - 4]);
    x = next;
  }
  d += `Q${pt(edge - 1, lip + 9)} ${pt(edge + 1, lip + 4)}Z`;

  // Roots dangling from under the lobes, and moss cushions on the stones they hang over.
  const roots: string[] = [];
  const cushions: { d: string; fill: string }[] = [];
  for (const [x, y] of under) {
    if (random() < 0.3) {
      const length = 8 + random() * 18;
      roots.push(`M${pt(x, y)}q${pt((random() - 0.5) * 8, length * 0.5)} ${pt((random() - 0.5) * 6, length)}`);
    }
    if (random() < 0.35) {
      const w = 8 + random() * 10;
      cushions.push({
        d: `M${pt(x - w, y + 3)}Q${pt(x - w * 0.7, y - 5)} ${pt(x, y - 3)}Q${pt(x + w * 0.8, y - 5)} ${pt(x + w, y + 3)}Q${pt(x, y + 7)} ${pt(x - w, y + 3)}Z`,
        fill: pick(greens.cliffMoss),
      });
    }
  }
  // Small ferns growing up out of the top.
  const ferns = top
    .filter(([x], i) => i > 2 && x > -10 && random() < 0.22)
    .map(([x, y]) => ({ x, y: y + 3, size: 0.18 + random() * 0.12, fronds: fern(random), green: pick(greens.fern) }));
  return { d, roots, cushions, ferns };
}

const CLIFF_TOPS = (() => {
  const random = seeded(0x7c1f);
  return [cliffTop(random), cliffTop(random)];
})();

function CliffTop({ side }: { side: Side }) {
  const top = CLIFF_TOPS[side === "left" ? 0 : 1];
  const id = `cliff-top-${side}`;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${CLIFF_TOP.width} ${CLIFF_TOP.height}`}
      preserveAspectRatio="xMaxYMin slice"
      className={`pointer-events-none absolute top-[calc(var(--footer-dusk)-1.3rem)] z-[var(--z-media)] h-[3.2rem] w-[calc(var(--forest-foot)+5px)] overflow-visible ${side === "left" ? "left-0" : "right-0 -scale-x-100"}`}
    >
      <defs>
        {/* The bank's own green on top, so the ground runs on into it, and into
            the shade underneath where it hangs over the dark. */}
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="38">
          <stop offset="0" stopColor={paint.bank} />
          <stop offset="0.45" stopColor="#4a7040" />
          <stop offset="1" stopColor="#2f4b36" />
        </linearGradient>
      </defs>
      {top.cushions.map(({ d, fill }, i) => (
        <path key={i} d={d} fill={fill} {...ink} strokeOpacity={0.4} strokeWidth={1.1} />
      ))}
      {top.roots.map((d, i) => (
        <path key={i} d={d} {...line} strokeOpacity={0.5} strokeWidth={1.1} />
      ))}
      <path d={top.d} fill={`url(#${id})`} {...ink} />
      {top.ferns.map(({ x, y, size, fronds, green }, i) => (
        <g key={i} transform={`translate(${pt(x - (FERN_BOX.width * size) / 2, y - FERN_BOX.height * size)}) scale(${size.toFixed(2)})`}>
          {fronds.map((frond, j) => (
            <path key={j} d={frond.leaf} fill={green} {...ink} strokeOpacity={0.4} />
          ))}
        </g>
      ))}
    </svg>
  );
}

/**
 * A coho salmon, red for spawning, leaping out of the falls as you come to the
 * end of the page and over the lip into the river, nose up as it rises and down
 * as it dives, with spray where it leaves the water and a splash where it goes
 * back in. Like the things in the sky, the scroll only sets it off: it makes the
 * whole leap in one go, and if you scroll back up, leaps back down out of the
 * river into the falls, facing that way. Drawn facing right. It only comes on
 * visits it's in the river's cast, which also says where along the falls.
 */
/** Its arc, as a curve through three points in units of about 1vh from where it leaves the falls. */
const LEAP: Point[] = [[0, 6], [6, -25], [12, -9]];

const salmonInk = { ...ink, strokeWidth: 1.4 } as const;

function SalmonShape() {
  return (
    <svg viewBox="0 0 120 46" className="h-full w-full overflow-visible">
      <path d="M26 23L6 7Q12 22 5 39L26 28Z" fill="#8f3940" {...salmonInk} />
      <path d="M60 9L68 1L77 9Z" fill="#8f3940" {...salmonInk} />
      <path d="M38 15Q41 10 45 14" fill="#8f3940" {...salmonInk} />
      <path d="M60 35L55 42L66 37ZM42 33L37 39L48 35Z" fill="#8f3940" {...salmonInk} />
      <path d="M22 24C34 11 60 7 86 9C100 11 111 15 117 21C114 27 106 31 94 33C72 37 44 36 22 27Z" fill="#c8434b" />
      <path d="M22 24C34 11 60 7 86 9C100 11 111 15 117 21C104 18 90 18 70 19C50 20 34 22 22 24Z" fill="#3f604a" />
      <path d="M36 31C56 36 80 36 96 32C88 37 60 39 36 31Z" fill="#ead9d0" />
      <path d="M93 10C101 11 111 15 117 21C114 27 106 31 96 32C92 25 91 16 93 10Z" fill="#4d6b4f" />
      <path d="M22 24C34 11 60 7 86 9C100 11 111 15 117 21C114 27 106 31 94 33C72 37 44 36 22 27Z" {...salmonInk} fill="none" />
      <path d="M96 12C92 18 92 26 96 31M117 21Q111 25 104 24M113 17Q119 15 120 20" {...salmonInk} fill="none" strokeOpacity={0.8} />
      <path d="M91 29Q86 36 80 36Q83 31 86 28Z" fill="#8f3940" {...salmonInk} />
      <circle cx="105" cy="17.5" r="2.2" fill="var(--color-ink-fixed)" />
      <circle cx="105.7" cy="16.8" r="0.7" fill="#fff" />
      <path d="M48 15h.01M58 13h.01M70 12h.01M80 12h.01M53 18h.01M66 16h.01" {...salmonInk} strokeWidth={2.6} />
    </svg>
  );
}

function SplashShape() {
  return (
    <svg viewBox="0 0 60 32" className="h-full w-full overflow-visible">
      <ellipse cx="30" cy="27" rx="24" ry="4" {...line} stroke="rgba(255,255,255,0.85)" />
      <path d="M22 25C19 17 15 13 9 11M27 24C26 15 24 9 21 4M33 24C34 15 36 9 39 4M38 25C41 17 45 13 51 11" {...line} stroke="rgba(255,255,255,0.8)" />
      <circle cx="8" cy="9" r="1.6" fill="#fff" />
      <circle cx="20" cy="2" r="1.4" fill="#fff" />
      <circle cx="40" cy="2" r="1.4" fill="#fff" />
      <circle cx="52" cy="9" r="1.6" fill="#fff" />
    </svg>
  );
}

function Salmon() {
  const leap = useRef<HTMLDivElement>(null);
  const across = useRiverCast()?.salmon?.across ?? null;

  useEffect(() => {
    const box = leap.current;
    const footer = box?.closest("footer");
    const falls = document.querySelector<SVGSVGElement>("[data-falls]");
    const fish = box?.querySelector<HTMLElement>("[data-fish]");
    const [spray, splash] = Array.from(box?.querySelectorAll<HTMLElement>("[data-splash]") ?? []);
    // Not on this visit: it stays in the falls.
    if (across === null || !box || !footer || !falls || !fish || !spray || !splash) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Its two leaps, up out of the falls into the river and back down out of the
    // river over the lip, each three animations played together (the fish, the
    // spray where it leaves the water and the splash where it goes in), and which
    // it's done last: it's always in the river or the falls, never in the air.
    let leaps: Record<"up" | "down", { fish: Keyframe[]; spray: Keyframe[]; splash: Keyframe[] }> | null = null;
    let playing: Animation[] = [];
    let upstream = false;
    let wanted = false;

    const bell = (t: number, a: number, peak: number, b: number) =>
      t <= a || t >= b ? 0 : t < peak ? (t - a) / (peak - a) : (b - t) / (b - peak);

    const build = () => {
      const unit = Math.min(innerHeight, innerWidth * 1.8) / 100;
      const mouth = falls.getBoundingClientRect();
      const from = mouth.left - footer.getBoundingClientRect().left + mouth.width * across - (LEAP[2][0] * unit) / 2;
      const size = (element: HTMLElement, width: number, height: number) => {
        element.style.width = `${width * unit}px`;
        element.style.height = `${height * unit}px`;
        element.style.left = `${(-width * unit) / 2}px`;
        element.style.top = `${(-height * unit) / 2}px`;
      };
      size(fish, 8, (8 * 46) / 120);
      size(spray, 5, 2.7);
      size(splash, 6.5, 3.5);

      const [a, b, c] = LEAP;
      const steps = 30;
      const samples = Array.from({ length: steps + 1 }, (_, k) => k / steps);
      // Along a parabola at an even pace across, as a thrown thing goes. Coming
      // back down it's the same arc the other way, the fish mirrored to face it,
      // nose first: mirrored, the same turn points it back along its path.
      const fishAt = (t: number, mirrored: boolean, time: number) => {
        const u = 1 - t;
        const x = (u * u * a[0] + 2 * u * t * b[0] + t * t * c[0]) * unit;
        const y = (u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]) * unit;
        const dx = 2 * u * (b[0] - a[0]) + 2 * t * (c[0] - b[0]);
        const dy = 2 * u * (b[1] - a[1]) + 2 * t * (c[1] - b[1]);
        // Smaller as it goes, upstream and away.
        const scale = 1 - 0.22 * t;
        return {
          translate: `${(from + x).toFixed(1)}px ${y.toFixed(1)}px`,
          rotate: `${((Math.atan2(dy, dx) * 180) / Math.PI).toFixed(1)}deg`,
          scale: `${(mirrored ? -scale : scale).toFixed(3)} ${scale.toFixed(3)}`,
          // In view only between leaving the water and going back in.
          opacity: Math.min(1, Math.max(0, (time - 0.015) / 0.04), Math.max(0, (0.97 - time) / 0.06)),
        };
      };
      const sprayAt = `${(from + a[0] * unit).toFixed(1)}px ${((a[1] - 3) * unit).toFixed(1)}px`;
      const splashAt = `${(from + c[0] * unit).toFixed(1)}px ${((c[1] + 1) * unit).toFixed(1)}px`;
      // The spray at the falls as it leaves them, the splash in the river as it
      // goes in; coming back, the other way about.
      const sprays = samples.map((t) => ({ translate: sprayAt, scale: (0.6 + t * 2.4).toFixed(3), opacity: bell(t, 0.02, 0.1, 0.32) }));
      const splashes = samples.map((t) => ({ translate: splashAt, scale: (0.5 + Math.max(0, t - 0.88) * 5).toFixed(3), opacity: bell(t, 0.88, 0.95, 1) }));
      leaps = {
        up: { fish: samples.map((t) => fishAt(t, false, t)), spray: sprays, splash: splashes },
        down: { fish: samples.map((t) => fishAt(1 - t, true, t)), spray: [...sprays].reverse(), splash: [...splashes].reverse() },
      };
    };

    const timing = { duration: 1700, easing: "linear", fill: "forwards" } as const;
    // Once a leap's done, if it's been called the other way since, it goes again.
    const leapTo = (up: boolean) => {
      wanted = up;
      if (playing.length || up === upstream || !leaps) return;
      upstream = up;
      const { fish: f, spray: s, splash: p } = leaps[up ? "up" : "down"];
      playing = [fish.animate(f, timing), spray.animate(s, timing), splash.animate(p, timing)];
      playing[0].onfinish = () => {
        playing.forEach((animation) => animation.cancel());
        playing = [];
        leapTo(wanted);
      };
    };

    let frame = 0;
    const check = () => {
      frame = 0;
      const lip = falls.getBoundingClientRect().top;
      if (lip < innerHeight * 0.8) leapTo(true);
      else if (lip > innerHeight * 0.95) leapTo(false);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    const onResize = () => {
      build();
      onScroll();
    };
    // Loading the page at its foot: it's already leapt.
    upstream = wanted = falls.getBoundingClientRect().top < innerHeight * 0.8;
    build();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      playing.forEach((animation) => animation.cancel());
    };
  }, [across]);

  return (
    // Hidden until it's set going, and with reduced motion it stays that way.
    <div ref={leap} aria-hidden="true" className="pointer-events-none absolute left-0 top-[var(--footer-dusk)] z-[var(--z-media)] h-0 w-0">
      <div data-splash className="absolute opacity-0">
        <SplashShape />
      </div>
      <div data-fish className="absolute opacity-0">
        <SalmonShape />
      </div>
      <div data-splash className="absolute opacity-0">
        <SplashShape />
      </div>
    </div>
  );
}

/**
 * A varied thrush, the Northwest's own songbird, slate blue with an orange
 * breast and eyebrow, perched on a big mossy boulder by the left bank and
 * singing, its beak opening as each note leaves it, the notes drifting up and
 * away one after another
 * (.song-note in globals.css). Only where they are and how faint they are
 * changes, so they cost nothing to run; with reduced motion there are none.
 */
const PERCH = ROCKS.find((rock) => rock.x === 130 && rock.y === 134)!;
/** How high the boulder's top is in its box (ROCK_BOX), read off its own outline, so the bird stands on it. */
const PERCH_PEAK = Math.min(...PERCH.outline.match(/-?[\d.]+/g)!.map(Number).filter((_, i) => i % 2 === 1));
// The outline's highest numbers are its corners, which the curve only reaches
// toward, so its true top is a little below them.
const PERCH_TOP = PERCH_PEAK + (WATERLINE - PERCH_PEAK) * 0.3;
const thrushInk = { ...ink, strokeWidth: 1.3 } as const;

function ThrushShape() {
  return (
    <svg viewBox="0 0 60 44" className="h-full w-full overflow-visible">
      <path d="M26 37L25 42M31 37L31 42" {...line} strokeWidth={1.2} />
      <path d="M10 26L0 29L2 34L13 30Z" fill="#33404f" {...thrushInk} />
      <path d="M10 28Q14 16 30 16Q44 16 46 26Q44 36 28 37Q16 37 10 28Z" fill="#3d4b5e" {...thrushInk} />
      <path d="M30 18Q44 18 46 27Q44 35 30 36Q36 28 30 18Z" fill="#e0872f" />
      <path d="M38 19Q41 26 37 34" {...line} stroke="#263040" strokeWidth={2.2} />
      <path d="M18 22Q28 20 36 26Q28 30 18 28Z" fill="#33404f" {...thrushInk} />
      <path d="M21 24L30 25.5M22 27L31 28.5" {...line} stroke="#e0872f" strokeWidth={1.4} />
      <circle cx="44" cy="15" r="8" fill="#3d4b5e" {...thrushInk} />
      <path d="M38.5 11.5Q45 7.5 51.5 12" {...line} stroke="#e0872f" strokeWidth={2} />
      <path d="M44 20Q48 21.5 51 17.8" {...line} stroke="#e0872f" strokeWidth={1.8} />
      <circle cx="47" cy="14" r="1.3" fill="var(--color-ink-fixed)" />
    </svg>
  );
}

/**
 * The thrush's beak, open and shut, as two pictures over the bird that take
 * turns showing (.thrush-beak in globals.css), open as each note leaves it.
 * Pictures of their own rather than parts of the bird's drawing, so swapping
 * them is only a fade, which the compositor runs.
 */
function BeakShape({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 60 44" className={`thrush-beak ${open ? "thrush-beak-open" : "thrush-beak-shut"} overflow-visible`}>
      {open ? (
        <>
          <path d="M51 13L58.5 10.5L52 15.2Z" fill="#2b2b2b" {...thrushInk} strokeWidth={1} />
          <path d="M52 16.2L57.5 19.5L51 17.6Z" fill="#2b2b2b" {...thrushInk} strokeWidth={1} />
        </>
      ) : (
        <path d="M51 13.4L58 15.4L51 17.4Z" fill="#2b2b2b" {...thrushInk} strokeWidth={1} />
      )}
    </svg>
  );
}

/** An eighth note, and a pair beamed together, in marigold outlined in ink, to stand out against the trees and the water. */
const NOTES = [
  "M6 15.5a3.2 2.4 -20 1 1 -6.4 0a3.2 2.4 -20 1 1 6.4 0ZM6 15V2q4 2 5.5 6",
  "M5 16.5a3 2.2 -20 1 1 -6 0a3 2.2 -20 1 1 6 0ZM14 14.5a3 2.2 -20 1 1 -6 0a3 2.2 -20 1 1 6 0ZM5 16V4l9 -2v12.5M5 4l9 -2",
];

function Thrush() {
  const { left, bottom } = riverAt(PERCH.x, PERCH.y);
  const width = `min(${PERCH.size}vh, ${PERCH.size * 2}vw)`;
  return (
    <div
      className="absolute -translate-x-1/2"
      // Its feet (at 42 of its 44) on the stone's top, a little in from its middle.
      style={{
        left: `calc(${left} - ${width} * 0.04)`,
        bottom: `calc(${bottom} - ${width} * ${((ROCK_BOX.height - WATERLINE) / ROCK_BOX.width).toFixed(3)} + ${width} * ${((ROCK_BOX.height - PERCH_TOP) / ROCK_BOX.width - 0.02).toFixed(3)} - ${width} * 0.72 * ${(2 / 60).toFixed(3)})`,
        width: `calc(${width} * 0.72)`,
        aspectRatio: "60 / 44",
      }}
    >
      <ThrushShape />
      <BeakShape open={false} />
      <BeakShape open />
      {[0, 1, 2].map((i) => (
        <span key={i} className="song-note" style={{ "--note-delay": `${i * -1.6}s` } as CSSProperties}>
          <svg viewBox="-4 -1 20 22" className="h-full w-full overflow-visible">
            <path d={NOTES[i % 2]} fill="var(--color-marigold-500)" stroke="var(--color-ink-fixed)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/**
 * Swimmers crossing the river, a nod to Oregon's two big universities: a pair of
 * mallards with their ducklings paddling along behind, and a beaver with its head
 * and back out of the water and a wake fanning out behind it. Like the things in
 * the sky, the scroll sets them off: each swims the whole way across as you come
 * to its part of the page, and if you scroll back up past it, turns round where
 * it is and swims back. They fade in and out at the banks, where they come out
 * from under the trees. Drawn facing right, at their waterline. Whether each
 * turns up on a visit, and when and which way, is the river's cast (below).
 */
const SWIMMERS = [
  // `speed` is in the river's units a second; `y` how far down the valley, so
  // how near; `size` in vh. `box` is its drawing's, and `waterline` how far down
  // it the water is.
  { kind: "ducks", y: 138, from: 95, to: 905, speed: 40, size: 11, box: [220, 44], waterline: 34.5 },
  { kind: "beaver", y: 162, from: 70, to: 930, speed: 70, size: 7, box: [150, 40], waterline: 31.5 },
] as const;

/** A swimmer's crossing on a visit: how far down the page (0 to 1) it sets off, from which bank, and how briskly. */
type Crossing = { at: number; reverse: boolean; pace: number };

type RiverCast = {
  ducks: Crossing | null;
  beaver: Crossing | null;
  /** Where along the falls the salmon leaps, as a fraction of their width. */
  salmon: { across: number } | null;
};

/**
 * Who turns up in the river on this visit (visit.ts), so it isn't the same show
 * on every page: usually one or two of the ducks, the beaver and the salmon,
 * now and then none, never all three. The swimmers set off somewhere in the
 * first two thirds of the page, apart if both come, from either bank.
 */
function riverCast(seed: number): RiverCast {
  const random = seeded(seed ^ 0x51a70);
  const roll = random();
  const count = roll < 0.15 ? 0 : roll < 0.65 ? 1 : 2;
  const order = (["ducks", "beaver", "salmon"] as const)
    .map((kind) => ({ kind, order: random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ kind }) => kind)
    .slice(0, count);
  const cast: RiverCast = { ducks: null, beaver: null, salmon: null };
  const swimmers = order.filter((kind) => kind !== "salmon");
  let at = 0.15 + random() * (swimmers.length > 1 ? 0.2 : 0.5);
  swimmers.forEach((kind) => {
    cast[kind] = { at, reverse: random() < 0.5, pace: 0.85 + random() * 0.35 };
    at = Math.min(0.88, at + 0.25 + random() * 0.2);
  });
  if (order.includes("salmon")) cast.salmon = { across: 0.4 + random() * 0.25 };
  return cast;
}

function useRiverCast() {
  const seed = useVisitSeed();
  return useMemo(() => (seed === null ? null : riverCast(seed)), [seed]);
}

/**
 * Sends a mover off when it isn't in this visit's cast: it fades where it is,
 * rather than vanishing mid-stroke or jumping back to where its journey began.
 */
function fadeAway(element: HTMLElement) {
  const [x, y] = placeOf(element);
  const opacity = Number(getComputedStyle(element).opacity);
  element.getAnimations().forEach((animation) => animation.cancel());
  element.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
  element.style.opacity = "0";
  if (opacity > 0.01) element.animate([{ opacity }, { opacity: 0 }], { duration: 600, easing: "ease-out" });
}

const waterline = { ...line, stroke: "rgba(255,255,255,0.75)", strokeWidth: 1.2 } as const;
const fine = { ...ink, strokeWidth: 1.1 } as const;

/** A duck sitting in the water at `x`, facing right; drake or hen. */
function Duck({ x, drake }: { x: number; drake: boolean }) {
  return (
    // Placed by the outer group, bobbing in the inner: a CSS transform on the
    // outer would replace its place.
    <g transform={`translate(${x} 0)`}>
     <g className="scenery-bob" style={{ "--bob-delay": `${(-x / 90).toFixed(2)}s` } as CSSProperties}>
      {/* Its wake, fanning out behind. */}
      <path d="M2 34L-16 30M2 35L-16 40" {...waterline} strokeOpacity={0.5} />
      <path d="M0 34Q2 24 14 23L28 23Q33 18 35 12Q33 4 40 3Q47 3 47 9L54 11L47 13Q46 18 41 21Q46 25 44 34Z" fill={drake ? "#b8b4ab" : "#9a7552"} {...fine} />
      {drake ? (
        <>
          {/* Chestnut breast, white collar, green head, and the drake's curl. */}
          <path d="M33 22Q42 22 44 34L32 34Q35 28 33 22Z" fill="#7b3f2a" />
          <path d="M35 13Q33 4 40 3Q47 3 47 9L47 13Q46 18 41 20Q36 19 35 13Z" fill="#2f6b4a" {...fine} />
          <path d="M36 19Q40 21 42 19" {...line} stroke="#fff" strokeWidth={1.4} />
          <path d="M2 24Q0 19 4 18" {...fine} fill="none" />
        </>
      ) : (
        <>
          {/* The hen's mottled brown, and the dark line through her eye. */}
          <path d="M10 28q4 -3 8 0M20 27q4 -3 8 0M14 31q4 -3 8 0" {...line} stroke="#6e5034" strokeWidth={1} />
          <path d="M37 8L46 8" {...line} stroke="#5a412a" strokeWidth={1.2} />
        </>
      )}
      <path d="M47 9L54 11L47 13Z" fill={drake ? "#e2c24a" : "#d98c3a"} {...fine} />
      <circle cx="42" cy="8" r="1.2" fill="var(--color-ink-fixed)" />
      <path d="M6 30q10 -4 22 -1" {...line} strokeWidth={1} strokeOpacity={0.35} />
      <path d="M-2 34.5Q22 37 46 34.5" {...waterline} />
     </g>
    </g>
  );
}

/** A duckling, a little ball of fluff, at `x`. */
function Duckling({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <g className="scenery-bob" style={{ "--bob-delay": `${(-x / 70).toFixed(2)}s` } as CSSProperties}>
        <path d="M0 34Q1 27 8 26Q11 22 15 22Q20 22 20 26L23 27L20 28Q19 31 16 34Z" fill="#cfa84c" {...fine} />
        <path d="M9 27Q12 30 16 29" {...line} stroke="#7a5a26" strokeWidth={1} />
        <path d="M14 25L19 25" {...line} stroke="#5a412a" strokeWidth={1} />
        <path d="M-1 34.5Q10 36 18 34.5" {...waterline} />
      </g>
    </g>
  );
}

function DucksShape() {
  return (
    <svg viewBox="-20 0 220 44" className="h-full w-full overflow-visible">
      {/* Ducklings strung out behind, then the hen, then the drake out front. */}
      {[4, 26, 46, 68].map((x) => (
        <Duckling key={x} x={x} />
      ))}
      <Duck x={96} drake={false} />
      <Duck x={146} drake />
    </svg>
  );
}

function BeaverShape() {
  return (
    <svg viewBox="-30 0 150 40" className="h-full w-full overflow-visible">
      {/* Its wake: a V opening out behind from its nose, and rings off its back. */}
      <path d="M100 30L-24 20M100 31L-24 40" {...waterline} strokeOpacity={0.55} />
      <path d="M40 31q-14 -2 -26 0" {...waterline} strokeOpacity={0.4} />
      <g className="scenery-bob" style={{ "--bob-delay": "-0.4s" } as CSSProperties}>
        {/* The flat tail, just under the water behind it. */}
        <path d="M4 31Q8 27 22 28Q30 29 32 31Q24 34 10 33Q4 33 4 31Z" fill="#4a3a30" fillOpacity={0.55} />
        {/* A low hump of back, then the head held up: round, with a small ear, a
            blunt dark nose and a beady eye. */}
        <path d="M30 31.5Q38 22 56 21Q68 21 76 25L76 31.5Z" fill="#7a4f2e" {...fine} />
        <path d="M36 31.5Q46 27 60 27Q70 27 76 31.5Z" fill="#5f3b22" />
        <circle cx="83" cy="15.5" r="2.6" fill="#5f3b22" {...fine} />
        <path d="M74 31.5Q71 15 89 13Q103 12 108 22Q110 27 107 31.5Z" fill="#865733" {...fine} />
        <path d="M76 31.5Q78 24 90 24Q102 24 107 31.5Z" fill="#6b4428" />
        <circle cx="108" cy="21.5" r="2.4" fill="#2b1d16" />
        <circle cx="96" cy="18" r="1.4" fill="var(--color-ink-fixed)" />
        <circle cx="96.4" cy="17.5" r="0.4" fill="#fff" />
        <path d="M101 25q4 1 7 0" {...line} strokeWidth={1} strokeOpacity={0.5} />
        <path d="M26 31.5Q66 35 110 31.5" {...waterline} />
      </g>
    </svg>
  );
}

/** One of SWIMMERS, by its place in the list. */
function Swimmer({ index }: { index: number }) {
  const swimmer = SWIMMERS[index];
  const self = useRef<HTMLDivElement>(null);
  const crossing = useRiverCast()?.[swimmer.kind] ?? null;

  useEffect(() => {
    const element = self.current;
    const river = document.querySelector<SVGSVGElement>("[data-river]");
    // Not on this visit: it stays out of sight.
    if (!element || !river || !crossing) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { from, to, speed } = SWIMMERS[index];
    const { at, reverse, pace } = crossing;
    const face = element.firstElementChild as Element;
    let out = false;
    // The river's units in px, and how far it swims, from the left bank.
    let unit = 1;
    const leg = () => (to - from) * unit;
    // From the left bank to the right, or the other way about.
    const start = () => (reverse ? leg() : 0);
    const end = () => (reverse ? 0 : leg());
    const heading = reverse ? -1 : 1;
    const trip = () => ({
      speed: speed * pace * unit,
      // Out from under the trees, and back under them at the far bank.
      shown: (x: number) => Math.min(1, Math.max(0, Math.min(x, leg() - x) / (60 * unit))),
    });
    const rest = () => place(element, face, out ? end() : start(), out ? heading : -heading, trip());
    const measure = () => {
      unit = river.getBoundingClientRect().width / VALLEY.width;
      if (!element.getAnimations().length) rest();
    };
    const progress = () => {
      const room = document.documentElement.scrollHeight - innerHeight;
      return room > 0 ? scrollY / room : 0;
    };
    let frame = 0;
    const check = () => {
      frame = 0;
      const p = progress();
      const going = p >= at ? true : p < at - 0.05 ? false : out;
      if (going === out) return;
      out = going;
      go(element, face, { to: going ? end() : start(), ...trip() });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    // Loading the page part way down: it's already across.
    out = progress() >= at;
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
      // On to another page: whatever comes next starts from its own bank.
      fadeAway(element);
    };
  }, [index, crossing]);

  const { left, bottom } = riverAt(swimmer.from, swimmer.y);
  const width = `min(${swimmer.size}vh, ${swimmer.size * 2}vw)`;
  // Its waterline on the water at its place in the valley.
  const below = (swimmer.box[1] - swimmer.waterline) / swimmer.box[0];
  return (
    // Hidden until it's set going, and with reduced motion it stays that way.
    // Centred on its place by its left, not a translate class: its journeys are
    // its translate.
    <div
      ref={self}
      data-swimmer={swimmer.kind}
      // Only bobs on visits it's in the river (.scenery-bob): the bob is drawn
      // afresh every frame, so it shouldn't run for a swimmer nobody sees.
      data-swimming={crossing ? "" : undefined}
      aria-hidden="true"
      className="absolute opacity-0"
      style={{
        left: `calc(${left} - ${width} / 2)`,
        bottom: `calc(${bottom} - ${width} * ${below.toFixed(3)})`,
        width,
        aspectRatio: `${swimmer.box[0]} / ${swimmer.box[1]}`,
      }}
    >
      {swimmer.kind === "ducks" ? <DucksShape /> : <BeaverShape />}
    </div>
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
const fallsBox =
  "pointer-events-none absolute left-[var(--forest-foot)] top-[var(--footer-dusk)] z-[var(--z-media)] h-[calc(100%-var(--footer-dusk))] w-[calc(100%-2*var(--forest-foot))] overflow-visible";

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
      <CliffRock />
      {/* The falls are three drawings in the same box, so that only the middle one,
          the moving streaks, is redrawn as they run, on a layer of its own: the
          water under them and the foam over them (with its blur) are drawn once. */}
      <svg
        ref={falls}
        data-falls
        aria-hidden="true"
        viewBox={`0 0 ${FALLS.width} ${FALLS.height}`}
        preserveAspectRatio="none"
        className={fallsBox}
      >
        <defs>
          <linearGradient id="falls-water" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={FALLS.height}>
            {/* Lit where it comes over the edge, and quickly into the dark, so the
                footer's copy reads against it. */}
            <stop offset="0" stopColor="#5a93a8" />
            <stop offset="0.03" stopColor="#3f7590" stopOpacity="0.9" />
            <stop offset="0.12" stopColor="#2c506f" stopOpacity="0.82" />
            <stop offset="0.5" stopColor="#263d60" stopOpacity="0.72" />
            <stop offset="1" stopColor="#22325a" stopOpacity="0.4" />
          </linearGradient>
          {/* The water's thinner at its sides, where it spills over the rock, so the
              cliffs' ragged edges show through it. */}
          <linearGradient id="falls-thin">
            <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="0.07" stopColor="#fff" />
            <stop offset="0.93" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.35" />
          </linearGradient>
          <mask id="falls-sides" maskUnits="userSpaceOnUse" x={MOUTH[0] - 10} y={-40} width={MOUTH[1] - MOUTH[0] + 20} height={FALLS.height + 50}>
            <rect x={MOUTH[0] - 4} y={-40} width={MOUTH[1] - MOUTH[0] + 8} height={FALLS.height + 50} fill="url(#falls-thin)" />
          </mask>
        </defs>
        <g mask="url(#falls-sides)">
          <path d={CURTAIN} fill="url(#falls-water)" />
          {STREAMS.map(({ d, light }, i) => (
            <path key={i} d={d} fill={light ? "#fff" : "#16243f"} fillOpacity={light ? 0.07 : 0.22} />
          ))}
        </g>
      </svg>
      <svg
        data-streaks
        aria-hidden="true"
        viewBox={`0 0 ${FALLS.width} ${FALLS.height}`}
        preserveAspectRatio="none"
        // Thinner at its sides like the water (falls-thin), as a mask on the layer.
        className={`${fallsBox} will-change-transform [mask-image:linear-gradient(90deg,rgba(0,0,0,0.35),#000_7%,#000_93%,rgba(0,0,0,0.35))]`}
      >
        <defs>
          <linearGradient id="falls-streak" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={FALLS.height}>
            <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="0.12" stopColor="#fff" stopOpacity="0.14" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.03" />
          </linearGradient>
        </defs>
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
      </svg>
      <svg aria-hidden="true" viewBox={`0 0 ${FALLS.width} ${FALLS.height}`} preserveAspectRatio="none" className={fallsBox}>
        <defs>
          {/* From the river's own blue at the edge, brightening where it bends over,
              and back into the curtain's. */}
          <linearGradient id="falls-brink" gradientUnits="userSpaceOnUse" x1="0" y1="-2" x2="0" y2="24">
            <stop offset="0" stopColor={paint.skyInWater} />
            <stop offset="0.35" stopColor="#8fc1cf" />
            <stop offset="1" stopColor="#5a93a8" />
          </linearGradient>
          {/* The foam gathers gradually over the last stretch of the river, is
              thickest just over the edge, and thins out below, clear of the footer's copy. */}
          <linearGradient id="falls-foam" gradientUnits="userSpaceOnUse" x1="0" y1="-26" x2="0" y2="30">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.22" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="0.4" stopColor="#fff" stopOpacity="0.82" />
            <stop offset="0.6" stopColor="#f2f8fa" stopOpacity="0.6" />
            <stop offset="1" stopColor="#e6f2f6" stopOpacity="0" />
          </linearGradient>
          {/* Softer across than down, so the foam's ends dissolve rather than stop. */}
          <filter id="falls-soft" filterUnits="userSpaceOnUse" x={MOUTH[0] - 60} y={-60} width={MOUTH[1] - MOUTH[0] + 120} height={150}>
            <feGaussianBlur stdDeviation="7 3" />
          </filter>
          <linearGradient id="falls-trail" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="46">
            <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="falls-mist">
            <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          {/* The light at the lip keeps to the curtain's own wavering edges (and the
              little way above it the foam crests). */}
          <clipPath id="falls-lip">
            <rect x={MOUTH[0]} y={-40} width={MOUTH[1] - MOUTH[0]} height={40} />
            <path d={CURTAIN} />
          </clipPath>
          {/* The foam thins away to nothing over the last of each side, into the mist
              (the glows over the lip, outside this), so it has no edge at any width. */}
          <linearGradient id="falls-foam-fade">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.15" stopColor="#fff" />
            <stop offset="0.85" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="falls-foam-sides" maskUnits="userSpaceOnUse" x={MOUTH[0] - 60} y={-60} width={MOUTH[1] - MOUTH[0] + 120} height={150}>
            <rect x={MOUTH[0] - 20} y={-60} width={MOUTH[1] - MOUTH[0] + 40} height={150} fill="url(#falls-foam-fade)" />
          </mask>
        </defs>
        {/* The light where the water bends over keeps to the water, and like the
            foam, thins away at its sides into the mist. */}
        <g mask="url(#falls-foam-sides)">
          <path d={BRINK} fill="url(#falls-brink)" clipPath="url(#falls-lip)" />
        </g>
        <g mask="url(#falls-foam-sides)">
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
      <CliffTop side="left" />
      <CliffTop side="right" />
      {/* Mist off the lip, drifting out over the cliffs' mossy tops either side, and
          thickest at the ends where the water breaks on the rock: soft glows in
          screen units, not the falls' stretched ones, so they're round at any width. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[calc(var(--forest-foot)-5rem)] top-[calc(var(--footer-dusk)-2.6rem)] z-[var(--z-media)] h-[6rem] [background:radial-gradient(closest-side,rgba(236,246,249,0.72),transparent)_0_50%/10rem_100%_no-repeat,radial-gradient(closest-side,rgba(236,246,249,0.72),transparent)_100%_50%/10rem_100%_no-repeat,radial-gradient(closest-side,rgba(236,246,249,0.22),transparent)_50%_50%/100%_80%_no-repeat]"
      />
      <Salmon />
    </>
  );
}

export function Scenery() {
  const firs = (back: boolean) => FIRS.flatMap((tree, i) => (tree.back === back ? [<FirShape key={i} tree={tree} />] : []));

  return (
    // Holds the scenery's place at the end of the page: the footer is pulled up over
    // it, so the river comes to the edge just above the footer's copy, where the
    // falls take over.
    <div aria-hidden="true" className="pointer-events-none sticky bottom-0 z-[var(--z-scenery)] h-[var(--footer-dusk)]">
      <div className="absolute inset-x-0 bottom-0 h-[50vh] overflow-hidden">
        <svg viewBox={`0 0 ${HILLS.width} ${HILLS.height}`} preserveAspectRatio="xMidYMax slice" className={hillsBox}>
          {RANGES.map((range, i) => (
            <g key={i}>
              <path d={range.land} fill={range.fill} />
              <path d={range.ridge} {...line} strokeWidth={1} strokeOpacity={range.line} />
              {/* So small far off that a line would swamp them, so the farthest have none. */}
              <path d={range.trees} fill={range.treeColor} {...ink} strokeWidth={0.8} strokeOpacity={i ? range.line * 0.6 : 0} />
            </g>
          ))}
        </svg>
        <svg viewBox={`0 0 ${VALLEY.width} ${HILLS.height}`} preserveAspectRatio="none" className={streamBox}>
          <path d={STREAM} fill="#86b7c6" {...ink} strokeWidth={1} strokeOpacity={0.35} />
        </svg>
        <svg viewBox={`0 0 ${HORIZON.width} ${HORIZON.height}`} preserveAspectRatio="xMidYMax slice" className={valleyBox}>
          <path d={FAR_GROUND} fill={paint.farGround} />
          {FAR_FIRS.map((row) =>
            row.trees.map(({ d, fill }) => (
              <path key={fill} d={d} fill={fill} {...ink} strokeWidth={1} strokeOpacity={row.line} />
            )),
          )}
        </svg>
        {WOODS.map((tree, i) => (
          <FirShape key={i} tree={tree} />
        ))}
        {firs(true)}
        <svg viewBox={`0 0 ${VALLEY.width} ${VALLEY.height}`} preserveAspectRatio="none" className={valleyBox}>
          <path d={BANK} fill={paint.bank} />
          <path d={BANK_EDGE} {...line} />
        </svg>
        <svg data-river viewBox={`0 0 ${VALLEY.width} ${VALLEY.height}`} preserveAspectRatio="none" className={riverBox}>
          <defs>
            <linearGradient id="river-depth" gradientUnits="userSpaceOnUse" x1="0" y1="56" x2="0" y2="216">
              <stop offset="0" stopColor="#8fbccb" stopOpacity="0.6" />
              <stop offset="0.3" stopColor="#4f8aa2" stopOpacity="0.12" />
              <stop offset="1" stopColor="#1d4a60" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path d={RIVER} fill={paint.water} />
          <path d={SKY_IN_WATER} fill={paint.skyInWater} />
          <path d={DEEP_CHANNEL} fill="#244f66" fillOpacity={0.22} />
          {TREES_IN_WATER.map((d, i) => (
            <path key={i} d={d} fill={paint.treesInWater} />
          ))}
          <path d={RIVER} fill="url(#river-depth)" />
          {SHALLOWS.map((d, i) => (
            <path key={i} d={d} fill="#6aa6ae" fillOpacity={0.55} />
          ))}
          {RIVER_BANKS.map((d, i) => (
            <path key={i} d={d} {...line} />
          ))}
        </svg>
        <div aria-hidden="true" className={`${riverBox} river-sheen`} style={{ "--river": RIVER_MASK } as CSSProperties}>
          <span />
          <span />
          <span />
        </div>
        {/* The ripples are a drawing of their own on a layer of its own, so that as
            they run, they're all that's redrawn, not the valley round them. */}
        <svg viewBox={`0 0 ${VALLEY.width} ${VALLEY.height}`} preserveAspectRatio="none" className={`${riverBox} will-change-transform`}>
          <path d={WAKES} {...line} stroke={paint.foam} strokeOpacity={0.55} strokeWidth={1.2} />
          {RIPPLES.map((ripple, i) => (
            <path
              key={i}
              className="scenery-flow"
              // A few pixels a second: fifteen steps a second are each about a
              // pixel, even on a wide screen, and the river's redrawn only that often.
              style={flowing(ripple.dash, ripple.speed, 15)}
              d={ripple.d}
              {...line}
              stroke={paint.foam}
              strokeOpacity={ripple.opacity}
              strokeWidth={ripple.width}
              strokeDasharray={ripple.dash}
            />
          ))}
        </svg>
        {/* The gravel beds, over the bank and the river's edge, under the stones. In
            the river's box, a tenth wider either side, and as far below as the
            river reaches. */}
        <div className={riverBox}>
          {GRAVEL.map((style, i) => (
            <div key={i} className="gravel-bed absolute -inset-x-[10%] top-0 h-[110%]" style={style} />
          ))}
        </div>
        {/* Further up the valley is further off: the rocks beyond each swimmer go
            behind it, the nearer ones in front. */}
        {ROCKS.map((rock, i) => (rock.y <= SWIMMERS[0].y ? <RockShape key={i} rock={rock} /> : null))}
        <Swimmer index={0} />
        {ROCKS.map((rock, i) => (rock.y > SWIMMERS[0].y && rock.y <= SWIMMERS[1].y ? <RockShape key={i} rock={rock} /> : null))}
        <Swimmer index={1} />
        {ROCKS.map((rock, i) => (rock.y > SWIMMERS[1].y ? <RockShape key={i} rock={rock} /> : null))}
        <Thrush />
        {FERNS.map((fern, i) => (fern.centered ? <FernShape key={i} index={i} /> : null))}
        {MID_WOODS.map((tree, i) => (
          <FirShape key={i} tree={tree} />
        ))}
        {firs(false)}
        {FERNS.map((fern, i) => (fern.centered ? null : <FernShape key={i} index={i} />))}
      </div>
    </div>
  );
}
