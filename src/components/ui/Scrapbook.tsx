import Image from "next/image";
import type { Photo } from "@/content/media";
import { Frame } from "@/components/ui/Frame";

export type ScrapbookItem = {
  photo: Photo;
  caption: string;
  /** "night" is for photos that are mostly dark, which glare on a light mat. */
  print?: "paper" | "night";
  /** Degrees, so the prints don't line up too neatly. */
  tilt: number;
  /** Tailwind grid placement, for when `className` makes the list `contents`. */
  placement?: string;
};

/**
 * Prints taped on the page like a scrapbook, in a row on smaller screens. They
 * straighten up and lift when you hover (Frame.tsx). Pass "lg:contents" and a
 * `placement` on each item to scatter them through the surrounding grid on
 * wide screens. The tape alternates marigold and periwinkle; night prints get
 * periwinkle, which reads better on the dark mat.
 */
export function Scrapbook({ items, className = "" }: { items: ScrapbookItem[]; className?: string }) {
  return (
    <ul className={`grid gap-10 sm:grid-cols-3 sm:gap-8 ${className}`}>
      {items.map(({ photo, caption, print = "paper", tilt, placement = "" }, i) => (
        <li key={caption} className={`pt-3 ${placement}`}>
          <Frame
            variant="taped"
            mat={print === "night" ? "night" : "cream"}
            tape={print === "night" || i % 2 === 1 ? "periwinkle" : "marigold"}
            tilt={tilt}
            label={caption}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              sizes="(min-width: 1024px) 476px, (min-width: 640px) 33vw, 100vw"
              placeholder="blur"
              className="h-auto w-full"
            />
          </Frame>
        </li>
      ))}
    </ul>
  );
}
