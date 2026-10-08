import Image from "next/image";
import type { Photo as PhotoData } from "@/content/media";

type Accent = "marigold" | "periwinkle";

const shadow: Record<Accent, string> = {
  marigold: "shadow-[6px_8px_0_0_var(--color-marigold-400)]",
  periwinkle: "shadow-[6px_8px_0_0_var(--color-periwinkle-400)]",
};

/**
 * A photo in the site's sticker frame: sketch-radius outline with a solid
 * offset shadow, cropped to a fixed aspect ratio so any upload fits the slot.
 */
export function Photo({
  photo,
  accent = "marigold",
  aspect = "aspect-[4/3]",
  sizes,
  priority = false,
  className = "",
}: {
  photo: PhotoData;
  accent?: Accent;
  /** Tailwind aspect utility, e.g. "aspect-[4/5]". */
  aspect?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      style={{ borderRadius: "var(--radius-sketch)" }}
      className={`relative overflow-hidden border-[1.5px] border-ink-900/80 ${aspect} ${shadow[accent]} ${className}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}

/** The room, in up to three frames. Renders nothing until photos exist. */
export function PhotoStrip({ photos, className = "" }: { photos: PhotoData[]; className?: string }) {
  if (photos.length === 0) return null;
  const columns = ["", "", "sm:grid-cols-2", "sm:grid-cols-3"][photos.length] ?? "sm:grid-cols-3";
  return (
    <div className={`grid gap-6 ${columns} ${className}`}>
      {photos.map((photo, i) => (
        <Photo
          key={photo.src}
          photo={photo}
          accent={i % 2 === 0 ? "marigold" : "periwinkle"}
          aspect={photos.length === 1 ? "aspect-[16/9]" : "aspect-[4/3]"}
          sizes={
            photos.length === 1
              ? "(min-width: 1152px) 1104px, 100vw"
              : "(min-width: 640px) 33vw, 100vw"
          }
        />
      ))}
    </div>
  );
}
