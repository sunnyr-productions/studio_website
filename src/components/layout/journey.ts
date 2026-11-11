/**
 * The way the things that move on their own go about it (the things in the sky,
 * the ducks and the beaver): set off by the scroll, each goes the whole way
 * across, facing the way it's going, and if it's called back, turns round where
 * it is and goes back the way it came, facing back, rather than running
 * backwards. Their drawings all face right; `face` is the part that's mirrored.
 */

/** Where an element is along its translate right now, in px, mid-move or not. */
export function placeOf(element: HTMLElement): [number, number] {
  const translate = getComputedStyle(element).translate;
  if (!translate || translate === "none") return [0, 0];
  const [x = "0", y = "0"] = translate.split(" ");
  return [parseFloat(x) || 0, parseFloat(y) || 0];
}

type Journey = {
  /** Where to, in px across (its translate). */
  to: number;
  /** In px a second. */
  speed: number;
  /** Its bob as it goes, [px down, degrees], at `x` px across; 0 for none. */
  bob?: (x: number) => [number, number];
  /** How visible it is at `x` px across, for things that fade in and out at the ends. */
  shown?: (x: number) => number;
};

/** Puts it somewhere outright, facing a way, with nothing moving it. */
export function place(element: HTMLElement, face: Element, x: number, heading: number, journey?: Pick<Journey, "bob" | "shown">) {
  element.getAnimations().forEach((animation) => animation.cancel());
  const [y, turn] = journey?.bob ? journey.bob(x) : [0, 0];
  element.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
  element.style.rotate = `${turn.toFixed(2)}deg`;
  if (journey?.shown) element.style.opacity = journey.shown(x).toFixed(3);
  (face as HTMLElement).style.transform = heading < 0 ? "scaleX(-1)" : "";
}

/**
 * Sends it from wherever it is now to `to`, turning to face that way first.
 * Whatever it was doing stops where it is. It stays where it ends up.
 */
export function go(element: HTMLElement, face: Element, { to, speed, bob, shown }: Journey) {
  const [x, y] = placeOf(element);
  const opacity = getComputedStyle(element).opacity;
  element.getAnimations().forEach((animation) => animation.cancel());
  element.style.translate = `${x}px ${y}px`;
  element.style.opacity = opacity;
  const heading = to >= x ? 1 : -1;
  (face as HTMLElement).style.transform = heading < 0 ? "scaleX(-1)" : "";
  const distance = Math.abs(to - x);
  if (distance < 1) return null;
  // A frame every 30px or so is plenty for a bob, and the rest is a straight line.
  const steps = Math.max(2, Math.ceil(distance / 30));
  const [y0] = bob ? bob(x) : [0];
  const frames = Array.from({ length: steps + 1 }, (_, k) => {
    const t = k / steps;
    const at = x + (to - x) * t;
    const [dy, turn] = bob ? bob(at) : [0, 0];
    // From where it is now into its bob, so a turn mid-bob doesn't jump.
    const frame: Keyframe = {
      translate: `${at.toFixed(1)}px ${(dy + (y - y0) * (1 - t)).toFixed(1)}px`,
      rotate: `${turn.toFixed(2)}deg`,
    };
    if (shown) frame.opacity = shown(at).toFixed(3);
    return frame;
  });
  const animation = element.animate(frames, { duration: (distance / speed) * 1000, easing: "linear", fill: "forwards" });
  const end = frames[frames.length - 1];
  animation.onfinish = () => {
    element.style.translate = String(end.translate);
    element.style.rotate = String(end.rotate);
    if (end.opacity !== undefined) element.style.opacity = String(end.opacity);
    animation.cancel();
  };
  return animation;
}
