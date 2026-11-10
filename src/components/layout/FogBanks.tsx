"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { seeded } from "./Sky";

/**
 * Shapes each section's fog bank (.section-panel), and the header's cloud, round
 * the things in it, so they read as cloud rather than boxes: every block of copy,
 * every card and photo, gets a billowing cloud round it, and the clouds of blocks
 * that sit close merge into one bank. The fog is as dense as what's in front of
 * it: thickest right behind the copy and where blocks crowd together, thinning
 * toward its edges. All of it is drawn as one soft-edged mask for the section's
 * single panel, so where clouds meet the haze itself doesn't double up.
 *
 * It measures the page, so it runs in the browser and again whenever anything in
 * a section changes size. Until it has, the panel keeps its plain billowing
 * rectangle from globals.css.
 */

/** Things the fog wraps whole rather than looking inside. */
const BLOCKS = "h1, h2, h3, h4, h5, h6, p, ul, ol, dl, blockquote, figure, form, table, a, button, .surface-card, .depth-media";

/** How far a block's cloud reaches past it, across and down. */
const REACH: [number, number] = [30, 24];

/** The blocks in a section's content to wrap, found by looking down through its layout boxes. */
function blocksIn(element: Element, depth = 0): Element[] {
  return Array.from(element.children).flatMap((child) => {
    const box = child.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) return [];
    // A box with words of its own (not just in the things inside it) is a block too.
    const ownText = Array.from(child.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
    if (ownText || child.matches(BLOCKS) || depth >= 4 || child.children.length === 0) return [child];
    return blocksIn(child, depth + 1);
  });
}

/**
 * One billowing cloud round a box: a rounded body with lobes along its edges,
 * reaching `reach` past it, with its lobes scaled by `size`.
 */
function cloud(x: number, y: number, width: number, height: number, random: () => number, reach = REACH, size = 1) {
  const [rx, ry] = reach;
  const left = x - rx;
  const top = y - ry;
  const right = x + width + rx;
  const bottom = y + height + ry;
  const shapes = [`<rect x="${left}" y="${top}" width="${right - left}" height="${bottom - top}" rx="${ry}"/>`];
  const lobe = (cx: number, cy: number, r: number) => shapes.push(`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}"/>`);
  for (let cx = left + 18; cx < right - 10; cx += 36 + random() * 22) {
    lobe(cx, top + 4, (16 + random() * 16) * size);
    lobe(cx + 18, bottom - 4, (16 + random() * 16) * size);
  }
  for (let cy = top + 22; cy < bottom - 14; cy += 34 + random() * 18) {
    lobe(left + 4, cy, (14 + random() * 12) * size);
    lobe(right - 4, cy + 14, (14 + random() * 12) * size);
  }
  return shapes.join("");
}

/**
 * A layer of fog for the mask: shapes (one string per block), each block drawn at
 * `density` so where blocks overlap the fog thickens, all softened by `soften`.
 */
type Layer = { blocks: string[]; density: number; soften: number };

/** A mask for an area of the given size, the layers of fog adding up. */
function maskOf(width: number, height: number, layers: Layer[]) {
  const filters = layers
    .map(({ soften }, i) => `<filter id="f${i}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${soften}"/></filter>`)
    .join("");
  const groups = layers
    .map(({ blocks, density }, i) => `<g filter="url(#f${i})">${blocks.map((d) => `<g opacity="${density}">${d}</g>`).join("")}</g>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width.toFixed(0)}" height="${height.toFixed(0)}" fill="#000">${filters}${groups}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0 / 100% 100% no-repeat`;
}

/** A plain rounded box round a block, `pad` past it. */
const around = (x: number, y: number, width: number, height: number, [px, py]: [number, number], round: number) =>
  `<rect x="${(x - px).toFixed(0)}" y="${(y - py).toFixed(0)}" width="${(width + 2 * px).toFixed(0)}" height="${(height + 2 * py).toFixed(0)}" rx="${round}"/>`;

function shape(panel: HTMLElement) {
  const content = panel.nextElementSibling;
  if (!content) return;
  // The bank covers the whole section, so a cloud near its side isn't cut off by
  // the narrower column the panel sits in without this.
  panel.style.inset = "0";
  panel.style.marginInline = "0";
  const area = panel.getBoundingClientRect();
  if (area.width === 0 || area.height === 0) return;
  const random = seeded(Math.round(area.height));
  const boxes = blocksIn(content).map((block) => {
    const box = block.getBoundingClientRect();
    return [box.left - area.left, box.top - area.top, box.width, box.height] as const;
  });
  // The fog follows the content: thick right behind it, so the copy reads, a
  // cloud round each block at half that, and a faint haze further out. Where
  // blocks crowd together the layers stack up, and the fog thins toward the
  // edges of what's there.
  const mask = maskOf(area.width, area.height, [
    { blocks: boxes.map(([x, y, w, h]) => around(x, y, w, h, [72, 56], 56)), density: 0.22, soften: 28 },
    { blocks: boxes.map(([x, y, w, h]) => cloud(x, y, w, h, random)), density: 0.5, soften: 10 },
    { blocks: boxes.map(([x, y, w, h]) => around(x, y, w, h, [12, 10], 14)), density: 1, soften: 6 },
  ]);
  panel.style.setProperty("-webkit-mask", mask);
  panel.style.setProperty("mask", mask);
}

/**
 * The header's cloud. Its glass is a pseudo-element (see globals.css) reaching
 * 0.4rem past the bar at each side and 0.9rem above and below, so the cloud is
 * drawn in that box and handed over as --cloud, with lobes small enough to stay
 * inside it.
 */
function shapeHeader(header: HTMLElement) {
  const box = header.getBoundingClientRect();
  if (box.width === 0) return;
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const [ex, ey] = [0.4 * rem, 0.9 * rem];
  const random = seeded(Math.round(box.width));
  const clouds = cloud(ex + 12, ey + 6, box.width - 24, box.height - 12, random, [12, 6], 0.6);
  header.style.setProperty("--cloud", maskOf(box.width + 2 * ex, box.height + 2 * ey, [{ blocks: [clouds], density: 1, soften: 3 }]));
  // One layer, so none of the stand-in's compositing.
  header.style.setProperty("--cloud-composite", "add");
}

export function FogBanks() {
  const pathname = usePathname();

  useEffect(() => {
    const panels = Array.from(document.querySelectorAll<HTMLElement>(".section-panel"));
    let frame = 0;
    const header = document.querySelector<HTMLElement>("header");
    const reshape = () => {
      frame = 0;
      panels.forEach(shape);
      if (header) shapeHeader(header);
    };
    const later = () => {
      if (!frame) frame = requestAnimationFrame(reshape);
    };
    reshape();
    // Content changes size as fonts and photos arrive, as a question opens, or
    // as the window does.
    const watcher = new ResizeObserver(later);
    panels.forEach((panel) => panel.nextElementSibling && watcher.observe(panel.nextElementSibling));
    document.fonts?.ready.then(later);
    window.addEventListener("resize", later, { passive: true });
    return () => {
      watcher.disconnect();
      window.removeEventListener("resize", later);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
