"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cloud, maskOf } from "./cloud";
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
 * How far a block is still shifted down while it rises into view (Rise.tsx),
 * so its cloud is drawn where it will settle rather than where it starts.
 */
function riseShift(block: Element, content: Element) {
  let shift = 0;
  for (let element: Element | null = block; element && element !== content; element = element.parentElement) {
    if (!element.hasAttribute("data-rise-state")) continue;
    const transform = getComputedStyle(element).transform;
    if (transform && transform !== "none") shift += new DOMMatrixReadOnly(transform).m42;
  }
  return shift;
}

/** A plain rounded box round a block, `pad` past it. */
const around = (x: number, y: number, width: number, height: number, [px, py]: [number, number], round: number) =>
  `<rect x="${(x - px).toFixed(0)}" y="${(y - py).toFixed(0)}" width="${(width + 2 * px).toFixed(0)}" height="${(height + 2 * py).toFixed(0)}" rx="${round}"/>`;

/**
 * What each bank and the header were last drawn from. A mask handed over again
 * is drawn again, blurs and all, which is slow on a bank the size of a section,
 * and most reshapes (a font or a photo arriving, a question opening elsewhere)
 * leave most clouds exactly as they were.
 */
const drawn = new WeakMap<HTMLElement, string>();

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
    return [box.left - area.left, box.top - area.top - riseShift(block, content), box.width, box.height] as const;
  });
  // The fog follows the content: thick right behind it, so the copy reads, a
  // cloud round each block at half that, and a faint haze further out. Where
  // blocks crowd together the layers stack up, and the fog thins toward the
  // edges of what's there.
  const mask = maskOf(area.width, area.height, [
    { blocks: boxes.map(([x, y, w, h]) => cloud(x, y, w, h, random, [64, 52], [46, 78])), density: 0.24, soften: 26 },
    { blocks: boxes.map(([x, y, w, h]) => cloud(x, y, w, h, random, REACH, [24, 42])), density: 0.5, soften: 13 },
    { blocks: boxes.map(([x, y, w, h]) => around(x, y, w, h, [12, 10], 14)), density: 1, soften: 7 },
  ]);
  if (drawn.get(panel) === mask) return;
  drawn.set(panel, mask);
  panel.style.setProperty("-webkit-mask", mask);
  panel.style.setProperty("mask", mask);
}

/**
 * The header's cloud. Its glass is a pseudo-element (see globals.css) reaching
 * 0.4rem past the bar at each side and 0.9rem above and below, so the cloud is
 * drawn in that box and handed over as --cloud: a smooth, rounded bar with a few
 * soft billows along its top, small enough to stay inside the box.
 */
function shapeHeader(header: HTMLElement) {
  const box = header.getBoundingClientRect();
  if (box.width === 0) return;
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const [ex, ey] = [0.4 * rem, 0.9 * rem];
  const random = seeded(Math.round(box.width));
  const puff: [number, number] = [ey * 0.75, ey * 1.1];
  const clouds = cloud(ex + 10, ey + 4, box.width - 20, box.height - 8, random, [0, 0], puff, { top: true, bottom: false, sides: false });
  const [width, height] = [box.width + 2 * ex, box.height + 2 * ey];
  const key = `${width.toFixed(0)}x${height.toFixed(0)}:${clouds}`;
  if (drawn.get(header) === key) return;
  drawn.set(header, key);
  header.style.setProperty("--cloud", maskOf(width, height, [{ blocks: [clouds], density: 1, soften: 4 }]));
  // One layer, so none of the stand-in's compositing.
  header.style.setProperty("--cloud-composite", "add");
  // Its rim, for the light at its edges where the sun's behind it (its silver
  // lining): the soft cloud less the cloud worn back from its edge, softened.
  const rim = 0.45 * rem;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width.toFixed(0)}" height="${height.toFixed(0)}" fill="#000">` +
    `<filter id="r" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur in="SourceAlpha" stdDeviation="4" result="soft"/>` +
    `<feMorphology in="soft" operator="erode" radius="${rim.toFixed(1)}" result="inner"/>` +
    `<feComposite in="soft" in2="inner" operator="out" result="ring"/><feGaussianBlur in="ring" stdDeviation="2.5"/></filter>` +
    `<g filter="url(#r)">${clouds}</g></svg>`;
  header.style.setProperty("--cloud-rim", `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0 / 100% 100% no-repeat`);
  header.toggleAttribute("data-cloud", true);
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
