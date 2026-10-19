import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Guitar, Voice & Production Lessons in Corvallis, OR";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "MUSIC LESSONS",
    title: "Guitar, voice & production lessons in Corvallis, OR",
    accent: "marigold",
  });
}
