import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Mixing, Mastering & Recording in Corvallis, OR";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "THE STUDIO",
    title: "Mixing, mastering & recording in Corvallis, OR",
    accent: "periwinkle",
  });
}
