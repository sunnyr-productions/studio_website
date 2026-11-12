/**
 * Drawing clouds as masks: the fog banks and the header's cloud (FogBanks.tsx),
 * and the menu's cloud (MobileNav.tsx). Each is an SVG of soft black shapes,
 * handed to CSS as a mask image.
 */

/**
 * One billowing cloud round a box: a rounded body reaching `reach` past it,
 * with puffs of radius `puff` (smallest to largest) set mostly inside its edges
 * so they swell out of it gently rather than stand off it like beads. `edges`
 * picks which sides billow; the rest stay smooth.
 */
export function cloud(
  x: number,
  y: number,
  width: number,
  height: number,
  random: () => number,
  reach: [number, number],
  puff: [number, number],
  edges = { top: true, bottom: true, sides: true },
) {
  const [rx, ry] = reach;
  const left = x - rx;
  const top = y - ry;
  const right = x + width + rx;
  const bottom = y + height + ry;
  const round = Math.min(Math.max(ry, puff[1]), (bottom - top) / 2);
  const shapes = [`<rect x="${left.toFixed(0)}" y="${top.toFixed(0)}" width="${(right - left).toFixed(0)}" height="${(bottom - top).toFixed(0)}" rx="${round.toFixed(0)}"/>`];
  const size = () => puff[0] + random() * (puff[1] - puff[0]);
  const lobe = (cx: number, cy: number, r: number) =>
    shapes.push(`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}"/>`);
  // Along an edge from a to b, puffs about their own width apart, each pushed out
  // past the edge by a share of its size.
  const along = (from: number, to: number, place: (at: number, r: number) => void) => {
    for (let at = from + puff[0]; at < to - puff[0] * 0.5; ) {
      const r = size();
      place(at, r);
      at += r * (1.1 + random() * 0.5);
    }
  };
  // How far in from the edge a puff sits: some swell well out, some barely, so
  // the outline wanders rather than running straight.
  const inset = () => 0.15 + random() * 0.7;
  if (edges.top) along(left + round * 0.5, right - round * 0.5, (at, r) => lobe(at, top + r * inset(), r));
  if (edges.bottom) along(left + round * 0.5, right - round * 0.5, (at, r) => lobe(at, bottom - r * inset(), r));
  if (edges.sides && bottom - top > puff[1] * 2) {
    along(top + round, bottom - round, (at, r) => lobe(left + r * inset(), at, r));
    along(top + round, bottom - round, (at, r) => lobe(right - r * inset(), at, r));
  }
  return shapes.join("");
}

/**
 * A layer of fog for the mask: shapes (one string per block), each block drawn at
 * `density` so where blocks overlap the fog thickens, all softened by `soften`.
 */
export type Layer = { blocks: string[]; density: number; soften: number };

/** A mask for an area of the given size, the layers of fog adding up. */
export function maskOf(width: number, height: number, layers: Layer[]) {
  const filters = layers
    .map(({ soften }, i) => `<filter id="f${i}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${soften}"/></filter>`)
    .join("");
  const groups = layers
    .map(({ blocks, density }, i) => `<g filter="url(#f${i})">${blocks.map((d) => `<g opacity="${density}">${d}</g>`).join("")}</g>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width.toFixed(0)}" height="${height.toFixed(0)}" fill="#000">${filters}${groups}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0 / 100% 100% no-repeat`;
}
