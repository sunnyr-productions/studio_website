import Image from "next/image";
import type { Photo } from "@/content/media";

export type ScrapbookItem = {
  photo: Photo;
  caption: string;
  /** "night" is for photos that are mostly dark, which glare on the white print. */
  print?: "paper" | "night";
  /** Tailwind rotate utility, so the prints don't line up too neatly. */
  tilt: string;
  /** Tailwind grid placement, for when `className` makes the list `contents`. */
  placement?: string;
};

/**
 * Prints laid on the page like a scrapbook, in a row on smaller screens. They
 * straighten up when you hover. Pass "lg:contents" and a `placement` on each item
 * to scatter them through the surrounding grid on wide screens.
 */
export function Scrapbook({ items, className = "" }: { items: ScrapbookItem[]; className?: string }) {
  return (
    <ul className={`grid gap-8 sm:grid-cols-3 ${className}`}>
      {items.map(({ photo, caption, print = "paper", tilt, placement = "" }) => (
        <li key={caption} className={placement}>
          <figure
            className={`depth-media border-[1.5px] border-ink-900/80 p-2.5 shadow-[3px_4px_0_0_var(--sketch-shadow)] transition-transform duration-300 motion-safe:hover:rotate-0 ${tilt} ${
              print === "night" ? "surface-night surface-card" : "bg-[#fffdf7]"
            }`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              sizes="(min-width: 1024px) 476px, (min-width: 640px) 33vw, 100vw"
              placeholder="blur"
              className="h-auto w-full"
            />
            <figcaption className="px-1 pb-1 pt-2.5 text-center font-display text-sm italic text-ink-700">
              {caption}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
