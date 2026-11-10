import type { ReactNode } from "react";
import Image from "next/image";
import type { Photo as PhotoData } from "@/content/media";

type Accent = "marigold" | "periwinkle";

// The accent tints the frame's soft glow (.photo-frame in globals.css).
const glow: Record<Accent | "none", string> = {
  marigold: "card-marigold",
  periwinkle: "card-periwinkle",
  none: "",
};

/** Blur-up only works for imported photos; slot photos are plain paths. */
const blur = (photo: PhotoData) => (typeof photo.src === "string" ? undefined : ("blur" as const));

/**
 * A photo in a thin white mount with a soft shadow tinted by its accent, in the
 * site's stone-round shape, cropped to a fixed aspect ratio so any upload fits
 * the slot. Use accent="none" inside something that already has a frame, like a card.
 */
export function Photo({
  photo,
  accent = "marigold",
  aspect = "aspect-[4/3]",
  sizes,
  preload = false,
  className = "",
}: {
  photo: PhotoData;
  accent?: Accent | "none";
  /** Tailwind aspect utility, e.g. "aspect-[4/5]". */
  aspect?: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  return (
    <div
      style={{ borderRadius: "var(--radius-sketch)" }}
      className={`depth-media relative overflow-hidden ${accent === "none" ? "" : "photo-frame"} ${aspect} ${glow[accent]} ${className}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        preload={preload}
        placeholder={blur(photo)}
        style={{ objectPosition: photo.position }}
        className="object-cover"
      />
    </div>
  );
}

/** Up to three frames in a row. Renders nothing until photos exist. */
export function PhotoStrip({ photos, className = "" }: { photos: PhotoData[]; className?: string }) {
  if (photos.length === 0) return null;
  const columns = ["", "", "sm:grid-cols-2", "sm:grid-cols-3"][photos.length] ?? "sm:grid-cols-3";
  return (
    <div className={`grid gap-6 ${columns} ${className}`}>
      {photos.map((photo, i) => (
        <Photo
          key={photo.alt}
          photo={photo}
          accent={i % 2 === 0 ? "marigold" : "periwinkle"}
          aspect={photos.length === 1 ? "aspect-[16/9]" : "aspect-[4/3]"}
          sizes={
            photos.length === 1
              ? "(min-width: 1152px) 1104px, 100vw"
              : photos.length === 2
                ? "(min-width: 640px) 50vw, 100vw"
                : "(min-width: 640px) 33vw, 100vw"
          }
        />
      ))}
    </div>
  );
}

/**
 * A page hero's copy with its photo beside it, or below it on smaller screens
 * so the buttons stay near the top. Just the copy until the photo exists.
 */
export function HeroWithPhoto({
  photo,
  accent,
  children,
}: {
  photo: PhotoData | null;
  accent: Accent;
  children: ReactNode;
}) {
  if (!photo) return <div className="max-w-3xl">{children}</div>;
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>{children}</div>
      <Photo
        photo={photo}
        accent={accent}
        aspect="aspect-[4/3] lg:aspect-[4/5]"
        sizes="(min-width: 1024px) 340px, (min-width: 640px) 476px, 100vw"
        preload
        className="w-full max-w-md lg:max-w-none"
      />
    </div>
  );
}

/**
 * A photo across the whole page, inset, rounded and as wide as the header and
 * the section panels. It interrupts the sky, so use at most one on a page. Set
 * `position` on the photo to keep its subject in frame as the shape changes with
 * the screen. Capped in width rather than height, since a shorter frame crops off
 * heads.
 */
export function PhotoBanner({ photo }: { photo: PhotoData }) {
  return (
    <div className="py-1.5">
      <div className="depth-media column-inset relative aspect-[4/3] overflow-hidden rounded-[1.25rem] shadow-[0_10px_30px_-12px_rgba(31,36,48,0.28)] sm:aspect-video lg:aspect-[2/1]">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1282px) 1258px, 100vw"
          placeholder={blur(photo)}
          style={{ objectPosition: photo.position }}
          className="object-cover"
        />
      </div>
    </div>
  );
}

/**
 * A band that grows out of a photo taken against an orange stage backdrop: the
 * copy sits on the backdrop's own colour (.surface-stage) and the top of the
 * photo fades into it, so nothing is printed over anyone's face.
 */
export function StageSection({
  photo,
  id,
  children,
}: {
  photo: PhotoData;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="py-1.5 scroll-mt-4">
      <div className="surface-stage column-inset relative overflow-hidden rounded-[1.25rem] shadow-[0_10px_30px_-12px_rgba(31,36,48,0.28)]">
        <div className="relative z-[var(--z-copy)] mx-auto max-w-3xl px-6 pt-12 sm:pt-16">{children}</div>
        <div className="depth-media relative -mt-8 aspect-[3/2] w-full [mask-image:linear-gradient(to_bottom,transparent,black_30%)] sm:-mt-24 lg:-mt-28">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1282px) 1258px, 100vw"
            placeholder={blur(photo)}
            className="object-cover object-bottom"
          />
        </div>
      </div>
    </section>
  );
}
