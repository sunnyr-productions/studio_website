import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "The sunny*r Studio | Music Lessons, Mixing & Mastering, Corvallis, OR";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "CORVALLIS, OR & ONLINE",
    title: "Music lessons, mixing & mastering",
  });
}
